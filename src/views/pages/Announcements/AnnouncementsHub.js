import React, { useEffect, useMemo, useState } from 'react'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CAlert,
} from '@coreui/react'

import AnnouncementCarousel from './AnnouncementCarousel'
import {
  AnnouncementCategory,
  AnnouncementVisibility,
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncementStats,
  getCategoryLabel,
  getCountdownLabel,
  getTimeBucket,
  listAnnouncementsForAdmin,
  listAnnouncementsForUser,
  publishAnnouncement,
  unpublishAnnouncement,
  updateAnnouncement,
} from './announcementService'

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: AnnouncementCategory.VENTURE, label: 'New Ventures' },
  { value: AnnouncementCategory.OFFER, label: 'Offers' },
  { value: AnnouncementCategory.PAYMENT, label: 'Payment Reminders' },
  { value: AnnouncementCategory.GENERAL, label: 'General Announcements' },
]

const VISIBILITY_OPTIONS = [
  { value: AnnouncementVisibility.CLIENTS, label: 'Clients Only' },
  { value: AnnouncementVisibility.AGENTS, label: 'Agents Only' },
  { value: AnnouncementVisibility.BOTH, label: 'Both' },
  { value: AnnouncementVisibility.SPECIFIC_CLIENT, label: 'Specific Client' },
  { value: AnnouncementVisibility.SPECIFIC_TEAM, label: 'Specific Team' },
  { value: AnnouncementVisibility.SELECTED_DESIGNATIONS, label: 'Selected Designations' },
]

const PRIORITY_OPTIONS = ['high', 'medium', 'low']

const getRoleData = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const role = String(user.role || '').toLowerCase()
  return { user, role }
}

const emptyForm = {
  category: AnnouncementCategory.GENERAL,
  title: '',
  venture_name: '',
  banner_image: '',
  description: '',
  launch_date: '',
  location: '',
  cta_text: '',
  cta_url: '',
  start_date: '',
  expiry_date: '',
  offer_description: '',
  target_required: '',
  reward_details: '',
  client_name: '',
  selected_client: '',
  project: '',
  plot_number: '',
  payment_amount: '',
  payment_due_date: '',
  deducting_bank: '',
  reminder_priority: 'medium',
  visibility: AnnouncementVisibility.BOTH,
  selected_teams_text: '',
  selected_designations_text: '',
  status: 'draft',
  published: false,
}

const toPayload = (form) => ({
  ...form,
  selected_teams: form.selected_teams_text
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean),
  selected_designations: form.selected_designations_text
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean),
})

const fromItem = (item) => ({
  ...emptyForm,
  ...item,
  selected_teams_text: (item.selected_teams || []).join(', '),
  selected_designations_text: (item.selected_designations || []).join(', '),
})

const AnnouncementCard = ({ item }) => {
  const bucket = getTimeBucket(item)
  const badgeColor = bucket === 'active' ? 'success' : bucket === 'scheduled' ? 'info' : bucket === 'expired' ? 'secondary' : 'warning'

  const overlay =
    item.category === AnnouncementCategory.VENTURE
      ? 'linear-gradient(140deg, rgba(18,57,42,0.88) 0%, rgba(18,57,42,0.42) 60%, rgba(0,0,0,0.2) 100%)'
      : item.category === AnnouncementCategory.OFFER
        ? 'linear-gradient(140deg, rgba(16,41,92,0.88) 0%, rgba(16,41,92,0.42) 60%, rgba(0,0,0,0.2) 100%)'
        : item.category === AnnouncementCategory.PAYMENT
          ? 'linear-gradient(140deg, rgba(93,36,36,0.88) 0%, rgba(93,36,36,0.42) 60%, rgba(0,0,0,0.2) 100%)'
          : 'linear-gradient(140deg, rgba(33,45,64,0.88) 0%, rgba(33,45,64,0.42) 60%, rgba(0,0,0,0.2) 100%)'

  return (
    <CCard
      className="border-0 shadow h-100"
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        backgroundImage: `${overlay}, url(${item.banner_image || ''})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <CCardBody style={{ minHeight: 260, color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div className="d-flex justify-content-between gap-2 mb-2 flex-wrap align-items-center">
          <CBadge color="dark">{getCategoryLabel(item.category)}</CBadge>
          <CBadge color={badgeColor}>{bucket.toUpperCase()}</CBadge>
        </div>
        <h5 className="mb-2" style={{ fontWeight: 800 }}>{item.title}</h5>
        <p className="mb-2" style={{ minHeight: 58, color: 'rgba(255,255,255,0.9)' }}>
          {item.description || item.offer_description || 'No description'}
        </p>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <small>{getCountdownLabel(item)}</small>
          {item.cta_url && (
            <a href={item.cta_url} target="_blank" rel="noreferrer">
              <CButton color="light" size="sm" variant="outline" style={{ borderColor: 'rgba(255,255,255,0.8)', color: '#fff' }}>
                {item.cta_text || 'Open'}
              </CButton>
            </a>
          )}
        </div>
      </CCardBody>
    </CCard>
  )
}

const AnnouncementEditor = ({ visible, onClose, onSave, form, setForm, saving, isAdmin }) => {
  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const showVentureFields = form.category === AnnouncementCategory.VENTURE
  const showOfferFields = form.category === AnnouncementCategory.OFFER
  const showPaymentFields = form.category === AnnouncementCategory.PAYMENT

  const showVisibilityDetail = [
    AnnouncementVisibility.SPECIFIC_CLIENT,
    AnnouncementVisibility.SPECIFIC_TEAM,
    AnnouncementVisibility.SELECTED_DESIGNATIONS,
  ].includes(form.visibility)

  return (
    <CModal visible={visible} onClose={onClose} size="xl" backdrop="static">
      <CModalHeader>
        <CModalTitle>{form.id ? 'Edit Update' : 'Create Update'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow className="g-3">
          <CCol md={4}>
            <CFormSelect label="Category" name="category" value={form.category} onChange={onChange}>
              {CATEGORIES.filter((c) => c.value !== 'all').map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </CFormSelect>
          </CCol>
          <CCol md={4}>
            <CFormSelect label="Visibility" name="visibility" value={form.visibility} onChange={onChange}>
              {VISIBILITY_OPTIONS.map((v) => (
                <option key={v.value} value={v.value}>{v.label}</option>
              ))}
            </CFormSelect>
          </CCol>
          <CCol md={4}>
            <CFormSelect label="Priority" name="reminder_priority" value={form.reminder_priority} onChange={onChange}>
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>{p.toUpperCase()}</option>
              ))}
            </CFormSelect>
          </CCol>

          <CCol md={6}>
            <CFormInput label="Title" name="title" value={form.title} onChange={onChange} required />
          </CCol>
          <CCol md={6}>
            <CFormInput label="Banner Image URL" name="banner_image" value={form.banner_image} onChange={onChange} />
          </CCol>

          <CCol md={12}>
            <CFormInput label="Description" name="description" value={form.description} onChange={onChange} />
          </CCol>

          {showVentureFields && (
            <>
              <CCol md={4}><CFormInput label="Venture Name" name="venture_name" value={form.venture_name} onChange={onChange} /></CCol>
              <CCol md={4}><CFormInput type="date" label="Launch Date" name="launch_date" value={form.launch_date} onChange={onChange} /></CCol>
              <CCol md={4}><CFormInput label="Location" name="location" value={form.location} onChange={onChange} /></CCol>
              <CCol md={4}><CFormInput label="CTA Button Text" name="cta_text" value={form.cta_text} onChange={onChange} /></CCol>
              <CCol md={8}><CFormInput label="CTA URL" name="cta_url" value={form.cta_url} onChange={onChange} /></CCol>
            </>
          )}

          {showOfferFields && (
            <>
              <CCol md={12}><CFormInput label="Offer Description" name="offer_description" value={form.offer_description} onChange={onChange} /></CCol>
              <CCol md={6}><CFormInput label="Target Required" name="target_required" value={form.target_required} onChange={onChange} /></CCol>
              <CCol md={6}><CFormInput label="Reward Details" name="reward_details" value={form.reward_details} onChange={onChange} /></CCol>
            </>
          )}

          {showPaymentFields && (
            <>
              <CCol md={4}><CFormInput label="Client" name="client_name" value={form.client_name} onChange={onChange} /></CCol>
              <CCol md={4}><CFormInput label="Project" name="project" value={form.project} onChange={onChange} /></CCol>
              <CCol md={4}><CFormInput label="Plot Number" name="plot_number" value={form.plot_number} onChange={onChange} /></CCol>
              <CCol md={4}><CFormInput label="Payment Amount" name="payment_amount" value={form.payment_amount} onChange={onChange} /></CCol>
              <CCol md={4}><CFormInput type="date" label="Payment Due Date" name="payment_due_date" value={form.payment_due_date} onChange={onChange} /></CCol>
              <CCol md={4}><CFormInput label="Deducting Bank" name="deducting_bank" value={form.deducting_bank} onChange={onChange} /></CCol>
            </>
          )}

          <CCol md={6}><CFormInput type="date" label="Start Date" name="start_date" value={form.start_date} onChange={onChange} /></CCol>
          <CCol md={6}><CFormInput type="date" label="Expiry Date" name="expiry_date" value={form.expiry_date} onChange={onChange} /></CCol>

          {showVisibilityDetail && form.visibility === AnnouncementVisibility.SPECIFIC_CLIENT && (
            <CCol md={12}><CFormInput label="Specific Client UID" name="selected_client" value={form.selected_client} onChange={onChange} /></CCol>
          )}

          {showVisibilityDetail && form.visibility === AnnouncementVisibility.SPECIFIC_TEAM && (
            <CCol md={12}><CFormInput label="Selected Teams (comma separated)" name="selected_teams_text" value={form.selected_teams_text} onChange={onChange} /></CCol>
          )}

          {showVisibilityDetail && form.visibility === AnnouncementVisibility.SELECTED_DESIGNATIONS && (
            <CCol md={12}><CFormInput label="Selected Designations (comma separated)" name="selected_designations_text" value={form.selected_designations_text} onChange={onChange} /></CCol>
          )}

          {isAdmin && (
            <>
              <CCol md={6}>
                <CFormSelect label="Status" name="status" value={form.status} onChange={onChange}>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                  <option value="unpublished">Unpublished</option>
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormSelect
                  label="Publish State"
                  name="published"
                  value={String(form.published)}
                  onChange={(e) => setForm((prev) => ({ ...prev, published: e.target.value === 'true' }))}
                >
                  <option value="false">Unpublished</option>
                  <option value="true">Published</option>
                </CFormSelect>
              </CCol>
            </>
          )}
        </CRow>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" variant="ghost" onClick={onClose}>Cancel</CButton>
        <CButton color="primary" onClick={onSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Update'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

const AnnouncementsHub = () => {
  const { role, user } = getRoleData()
  const isAdmin = role === 'admin'

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorForm, setEditorForm] = useState({ ...emptyForm })
  const [message, setMessage] = useState({ visible: false, color: 'success', text: '' })

  const load = async () => {
    setLoading(true)
    try {
      const data = isAdmin
        ? await listAnnouncementsForAdmin()
        : await listAnnouncementsForUser({ role, user })
      setItems(data)
    } catch {
      setMessage({ visible: true, color: 'danger', text: 'Failed to load announcements.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [isAdmin, role])

  const stats = useMemo(() => getAnnouncementStats(items), [items])

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !search ||
        `${item.title} ${item.description} ${item.offer_description}`
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter

      const bucket = getTimeBucket(item)
      const matchesStatus = statusFilter === 'all' || statusFilter === bucket

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [items, search, categoryFilter, statusFilter])

  const featured = filtered.slice(0, 8)

  const onCreate = () => {
    setEditorForm({ ...emptyForm })
    setEditorOpen(true)
  }

  const onEdit = (item) => {
    setEditorForm(fromItem(item))
    setEditorOpen(true)
  }

  const onSave = async () => {
    if (!editorForm.title) {
      setMessage({ visible: true, color: 'danger', text: 'Title is required.' })
      return
    }

    if (editorForm.expiry_date && editorForm.start_date && editorForm.expiry_date < editorForm.start_date) {
      setMessage({ visible: true, color: 'danger', text: 'Expiry date must be after start date.' })
      return
    }

    setSaving(true)
    try {
      const payload = toPayload(editorForm)
      if (editorForm.id) {
        await updateAnnouncement(editorForm.id, payload)
        setMessage({ visible: true, color: 'success', text: 'Announcement updated.' })
      } else {
        await createAnnouncement(payload)
        setMessage({ visible: true, color: 'success', text: 'Announcement created.' })
      }
      setEditorOpen(false)
      await load()
    } catch {
      setMessage({ visible: true, color: 'danger', text: 'Unable to save announcement.' })
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (id) => {
    try {
      await deleteAnnouncement(id)
      setMessage({ visible: true, color: 'success', text: 'Announcement deleted.' })
      await load()
    } catch {
      setMessage({ visible: true, color: 'danger', text: 'Delete failed.' })
    }
  }

  const onTogglePublish = async (item) => {
    try {
      if (item.published || item.status === 'published') {
        await unpublishAnnouncement(item.id)
        setMessage({ visible: true, color: 'warning', text: 'Announcement unpublished.' })
      } else {
        await publishAnnouncement(item.id)
        setMessage({ visible: true, color: 'success', text: 'Announcement published.' })
      }
      await load()
    } catch {
      setMessage({ visible: true, color: 'danger', text: 'Publish action failed.' })
    }
  }

  return (
    <CContainer fluid className="py-4">
      {message.visible && (
        <CAlert
          color={message.color}
          dismissible
          onClose={() => setMessage((prev) => ({ ...prev, visible: false }))}
        >
          {message.text}
        </CAlert>
      )}

      <CRow className="g-3 mb-3">
        <CCol md={3}>
          <CCard className="border-0 shadow-sm"><CCardBody><h6>Total</h6><h3>{stats.total}</h3></CCardBody></CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="border-0 shadow-sm"><CCardBody><h6>Active</h6><h3>{stats.active}</h3></CCardBody></CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="border-0 shadow-sm"><CCardBody><h6>Expired</h6><h3>{stats.expired}</h3></CCardBody></CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="border-0 shadow-sm"><CCardBody><h6>Engagement Index</h6><h3>{stats.engagementIndex}%</h3></CCardBody></CCard>
        </CCol>
      </CRow>

      <AnnouncementCarousel
        title={isAdmin ? 'Announcement Showcase' : 'Announcements & Updates'}
        items={featured}
      />

      <CCard className="border-0 shadow-sm mb-3">
        <CCardHeader className="d-flex gap-2 flex-wrap align-items-center justify-content-between">
          <div className="d-flex gap-2 flex-wrap" style={{ minWidth: 320 }}>
            <CFormInput placeholder="Search title or description" value={search} onChange={(e) => setSearch(e.target.value)} />
            <CFormSelect value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </CFormSelect>
            <CFormSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All States</option>
              <option value="active">Active Updates</option>
              <option value="scheduled">Scheduled Updates</option>
              <option value="expired">Expired Updates</option>
              <option value="draft">Draft</option>
            </CFormSelect>
          </div>
          {isAdmin && (
            <CButton color="primary" onClick={onCreate}>Create Update</CButton>
          )}
        </CCardHeader>
      </CCard>

      {loading ? (
        <div className="text-center py-5"><CSpinner /></div>
      ) : (
        <>
          {filtered.length === 0 ? (
            <CCard
              className="border-0 shadow mb-4"
              style={{
                borderRadius: 20,
                background: 'linear-gradient(130deg, #102a43 0%, #243b53 45%, #486581 100%)',
                color: '#fff',
              }}
            >
              <CCardBody style={{ minHeight: 280, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: 62, marginBottom: 10 }}>🏙️</div>
                  <h3 style={{ fontWeight: 800 }}>Stay Tuned!</h3>
                  <p className="mb-0" style={{ maxWidth: 720, margin: '0 auto', color: 'rgba(255,255,255,0.9)' }}>
                    New announcements and exciting opportunities will be available soon.
                  </p>
                </div>
              </CCardBody>
            </CCard>
          ) : (
            <CRow className="g-3 mb-4">
              {filtered.map((item) => (
                <CCol key={item.id} md={6} xl={4}>
                  <AnnouncementCard item={item} />
                  {isAdmin && (
                    <div className="d-flex gap-2 mt-2">
                      <CButton size="sm" color="info" variant="outline" onClick={() => onEdit(item)}>Edit</CButton>
                      <CButton size="sm" color="danger" variant="outline" onClick={() => onDelete(item.id)}>Delete</CButton>
                      <CButton size="sm" color={item.published ? 'warning' : 'success'} variant="outline" onClick={() => onTogglePublish(item)}>
                        {item.published ? 'Unpublish' : 'Publish'}
                      </CButton>
                    </div>
                  )}
                </CCol>
              ))}
            </CRow>
          )}

          {isAdmin && (
            <CCard className="border-0 shadow-sm">
              <CCardHeader>View Updates</CCardHeader>
              <CCardBody style={{ overflowX: 'auto' }}>
                <CTable hover responsive>
                  <CTableHead color="light">
                    <CTableRow>
                      <CTableHeaderCell>Title</CTableHeaderCell>
                      <CTableHeaderCell>Category</CTableHeaderCell>
                      <CTableHeaderCell>Visibility</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Start</CTableHeaderCell>
                      <CTableHeaderCell>Expiry</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {items.map((item) => (
                      <CTableRow key={`row_${item.id}`}>
                        <CTableDataCell>{item.title}</CTableDataCell>
                        <CTableDataCell>{getCategoryLabel(item.category)}</CTableDataCell>
                        <CTableDataCell>{item.visibility}</CTableDataCell>
                        <CTableDataCell>{item.status}</CTableDataCell>
                        <CTableDataCell>{item.start_date || '-'}</CTableDataCell>
                        <CTableDataCell>{item.expiry_date || '-'}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          )}
        </>
      )}

      <AnnouncementEditor
        visible={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={onSave}
        form={editorForm}
        setForm={setEditorForm}
        saving={saving}
        isAdmin={isAdmin}
      />
    </CContainer>
  )
}

export default AnnouncementsHub
