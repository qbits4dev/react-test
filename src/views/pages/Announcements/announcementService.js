const STORAGE_KEY = 'crm_announcements_v2'

const CATEGORY = {
  VENTURE: 'venture_launch',
  OFFER: 'target_offer',
  PAYMENT: 'payment_reminder',
  GENERAL: 'general_announcement',
}

const VISIBILITY = {
  CLIENTS: 'clients',
  AGENTS: 'agents',
  BOTH: 'both',
  SPECIFIC_CLIENT: 'specific_client',
  SPECIFIC_TEAM: 'specific_team',
  SELECTED_DESIGNATIONS: 'selected_designations',
}

const PRIORITY_WEIGHT = {
  high: 3,
  medium: 2,
  low: 1,
}

const DUMMY_ANNOUNCEMENTS = [
  {
    id: 'ann_demo_venture_1',
    category: CATEGORY.VENTURE,
    title: 'Green Valley Premium Villas Launch',
    venture_name: 'Green Valley Premium Villas',
    banner_image: 'https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?auto=format&fit=crop&w=1600&q=80',
    description: 'Experience luxury living with premium gated community villas surrounded by nature and modern amenities.',
    launch_date: '2026-08-15',
    location: 'Hyderabad',
    cta_text: 'Book Site Visit',
    cta_url: '#/bookvisit',
    start_date: '2026-06-01',
    expiry_date: '2026-09-30',
    visibility: VISIBILITY.BOTH,
    status: 'published',
    published: true,
    reminder_priority: 'high',
    created_at: '2026-07-20T09:00:00.000Z',
    updated_at: '2026-07-20T09:00:00.000Z',
  },
  {
    id: 'ann_demo_offer_1',
    category: CATEGORY.OFFER,
    title: 'Achieve Rs.50 Lakhs Sales & Win an iPhone',
    description: 'Agents achieving sales of Rs.50 Lakhs during this quarter will receive an iPhone and additional performance bonus.',
    offer_description: 'Agents achieving sales of Rs.50 Lakhs during this quarter will receive an iPhone and additional performance bonus.',
    target_required: 'Rs.50 Lakhs',
    reward_details: 'iPhone + Cash Bonus',
    banner_image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80',
    start_date: '2026-06-01',
    expiry_date: '2026-12-31',
    visibility: VISIBILITY.BOTH,
    status: 'published',
    published: true,
    reminder_priority: 'high',
    created_at: '2026-07-01T10:30:00.000Z',
    updated_at: '2026-07-01T10:30:00.000Z',
  },
  {
    id: 'ann_demo_payment_1',
    category: CATEGORY.PAYMENT,
    title: 'Payment Reminder',
    description: 'Your next installment is due soon. Please ensure sufficient funds are available before the due date.',
    client_name: 'Sample Client',
    project: 'Green Valley Phase 2',
    plot_number: 'A-102',
    payment_amount: 'Rs.1,50,000',
    payment_due_date: '2026-08-15',
    deducting_bank: 'HDFC Bank',
    banner_image: 'https://images.unsplash.com/photo-1565514020179-026b92b4a2f8?auto=format&fit=crop&w=1600&q=80',
    start_date: '2026-06-10',
    expiry_date: '2026-08-20',
    visibility: VISIBILITY.BOTH,
    status: 'published',
    published: true,
    reminder_priority: 'high',
    created_at: '2026-08-01T07:20:00.000Z',
    updated_at: '2026-08-01T07:20:00.000Z',
  },
  {
    id: 'ann_demo_general_1',
    category: CATEGORY.GENERAL,
    title: 'Independence Day Special Booking Offer',
    description: 'Book any plot during the Independence Day campaign and receive exclusive registration benefits.',
    banner_image: 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?auto=format&fit=crop&w=1600&q=80',
    start_date: '2026-06-01',
    expiry_date: '2026-08-20',
    visibility: VISIBILITY.BOTH,
    status: 'published',
    published: true,
    reminder_priority: 'medium',
    created_at: '2026-08-01T06:00:00.000Z',
    updated_at: '2026-08-01T06:00:00.000Z',
  },
  {
    id: 'ann_demo_team_1',
    category: CATEGORY.OFFER,
    title: 'Team Challenge - South Zone Sprint',
    offer_description: 'Top team in South Zone gets quarterly recognition and team retreat sponsorship.',
    target_required: '30 combined bookings',
    reward_details: 'Team retreat sponsorship',
    start_date: '2026-06-20',
    expiry_date: '2026-09-10',
    visibility: VISIBILITY.SPECIFIC_TEAM,
    selected_teams: ['Sales Team A', 'Marketing Team'],
    status: 'scheduled',
    published: true,
    reminder_priority: 'medium',
    created_at: '2026-06-15T08:30:00.000Z',
    updated_at: '2026-06-15T08:30:00.000Z',
  },
  {
    id: 'ann_demo_expired_1',
    category: CATEGORY.GENERAL,
    title: 'Financial Year Policy Update (Archived)',
    description: 'Policy update published for FY closing and now archived for audit history.',
    start_date: '2026-04-01',
    expiry_date: '2026-05-01',
    visibility: VISIBILITY.BOTH,
    status: 'published',
    published: true,
    reminder_priority: 'low',
    created_at: '2026-03-31T06:00:00.000Z',
    updated_at: '2026-05-01T06:00:00.000Z',
  },
]

const safeJson = async (res) => {
  try {
    return await res.json()
  } catch {
    return null
  }
}

const nowIso = () => new Date().toISOString()

const uid = () => `ann_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`

const readLocal = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const writeLocal = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

const normalize = (item) => ({
  id: item.id || uid(),
  category: item.category || CATEGORY.GENERAL,
  title: item.title || '',
  description: item.description || '',
  banner_image: item.banner_image || '',
  venture_name: item.venture_name || '',
  launch_date: item.launch_date || '',
  location: item.location || '',
  cta_text: item.cta_text || '',
  cta_url: item.cta_url || '',
  offer_description: item.offer_description || '',
  target_required: item.target_required || '',
  reward_details: item.reward_details || '',
  client_id: item.client_id || '',
  client_name: item.client_name || '',
  project: item.project || '',
  plot_number: item.plot_number || '',
  payment_amount: item.payment_amount || '',
  payment_due_date: item.payment_due_date || '',
  deducting_bank: item.deducting_bank || '',
  reminder_priority: String(item.reminder_priority || 'medium').toLowerCase(),
  visibility: item.visibility || VISIBILITY.BOTH,
  selected_teams: Array.isArray(item.selected_teams) ? item.selected_teams : [],
  selected_designations: Array.isArray(item.selected_designations) ? item.selected_designations : [],
  selected_client: item.selected_client || '',
  start_date: item.start_date || '',
  expiry_date: item.expiry_date || '',
  status: item.status || 'draft',
  published: Boolean(item.published),
  created_at: item.created_at || nowIso(),
  updated_at: item.updated_at || nowIso(),
})

const sortByPriorityAndDate = (items) =>
  [...items].sort((a, b) => {
    const pa = PRIORITY_WEIGHT[a.reminder_priority] || 0
    const pb = PRIORITY_WEIGHT[b.reminder_priority] || 0
    if (pa !== pb) return pb - pa
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  })

const isActiveWindow = (item, at = new Date()) => {
  if (!item.start_date && !item.expiry_date) return true
  const now = at.getTime()
  const from = item.start_date ? new Date(item.start_date).getTime() : Number.MIN_SAFE_INTEGER
  const to = item.expiry_date ? new Date(item.expiry_date).getTime() : Number.MAX_SAFE_INTEGER
  return now >= from && now <= to
}

const isExpired = (item, at = new Date()) => {
  if (!item.expiry_date) return false
  return new Date(item.expiry_date).getTime() < at.getTime()
}

const roleMatchesVisibility = (item, role, user) => {
  const normalizedRole = String(role || '').toLowerCase()
  const userTeam = String(user?.agent_team || '').toLowerCase()
  const userDesignation = String(user?.designation || '').toLowerCase()
  const uidValue = String(user?.u_id || '').toLowerCase()

  if (item.visibility === VISIBILITY.BOTH) return true
  if (item.visibility === VISIBILITY.CLIENTS) return normalizedRole === 'customer'
  if (item.visibility === VISIBILITY.AGENTS) return normalizedRole === 'agent'

  if (item.visibility === VISIBILITY.SPECIFIC_CLIENT) {
    return normalizedRole === 'customer' && uidValue === String(item.selected_client || '').toLowerCase()
  }

  if (item.visibility === VISIBILITY.SPECIFIC_TEAM) {
    if (normalizedRole !== 'agent') return false
    return item.selected_teams.map((v) => String(v).toLowerCase()).includes(userTeam)
  }

  if (item.visibility === VISIBILITY.SELECTED_DESIGNATIONS) {
    if (normalizedRole !== 'agent') return false
    return item.selected_designations
      .map((v) => String(v).toLowerCase())
      .includes(userDesignation)
  }

  return false
}

const upsertLocal = (record) => {
  const items = readLocal()
  const idx = items.findIndex((i) => i.id === record.id)
  if (idx >= 0) items[idx] = record
  else items.unshift(record)
  writeLocal(items)
  return record
}

const removeLocal = (id) => {
  const items = readLocal().filter((item) => item.id !== id)
  writeLocal(items)
}

const ensureSeedData = () => {
  const existing = readLocal()
  if (existing.length > 0) return existing
  const seed = DUMMY_ANNOUNCEMENTS.map(normalize)
  writeLocal(seed)
  return seed
}

const endpoint = () => `${globalThis.apiBaseUrl}/announcements`

export const AnnouncementCategory = CATEGORY
export const AnnouncementVisibility = VISIBILITY

export const listAnnouncementsForAdmin = async () => {
  try {
    const res = await fetch(endpoint())
    if (res.ok) {
      const data = await safeJson(res)
      const list = Array.isArray(data) ? data : data?.items || []
      if (list.length > 0) {
        return sortByPriorityAndDate(list.map(normalize))
      }
    }
  } catch {
    // local fallback
  }
  return sortByPriorityAndDate(ensureSeedData().map(normalize))
}

export const listAnnouncementsForUser = async ({ role, user }) => {
  const all = await listAnnouncementsForAdmin()
  return all.filter((item) => {
    if (!item.published && item.status !== 'published') return false
    if (!isActiveWindow(item)) return false
    return roleMatchesVisibility(item, role, user)
  })
}

export const createAnnouncement = async (payload) => {
  const record = normalize({
    ...payload,
    id: uid(),
    created_at: nowIso(),
    updated_at: nowIso(),
    status: payload.status || 'draft',
    published: Boolean(payload.published),
  })

  try {
    const res = await fetch(endpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    })
    if (res.ok) {
      const data = await safeJson(res)
      return normalize(data || record)
    }
  } catch {
    // local fallback
  }

  return upsertLocal(record)
}

export const updateAnnouncement = async (id, payload) => {
  const existing = readLocal().find((item) => item.id === id) || { id }
  const record = normalize({ ...existing, ...payload, id, updated_at: nowIso() })

  try {
    const res = await fetch(`${endpoint()}/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    })
    if (res.ok) {
      const data = await safeJson(res)
      return normalize(data || record)
    }
  } catch {
    // local fallback
  }

  return upsertLocal(record)
}

export const deleteAnnouncement = async (id) => {
  try {
    const res = await fetch(`${endpoint()}/${encodeURIComponent(id)}`, { method: 'DELETE' })
    if (res.ok) return true
  } catch {
    // local fallback
  }
  removeLocal(id)
  return true
}

export const publishAnnouncement = async (id) =>
  updateAnnouncement(id, { status: 'published', published: true, updated_at: nowIso() })

export const unpublishAnnouncement = async (id) =>
  updateAnnouncement(id, { status: 'unpublished', published: false, updated_at: nowIso() })

export const getAnnouncementStats = (items) => {
  const list = Array.isArray(items) ? items : []
  const activeCount = list.filter((item) => isActiveWindow(item)).length
  const expiredCount = list.filter((item) => isExpired(item)).length
  const scheduledCount = list.filter((item) => item.start_date && new Date(item.start_date) > new Date()).length
  const publishedCount = list.filter((item) => item.published || item.status === 'published').length

  return {
    total: list.length,
    active: activeCount,
    expired: expiredCount,
    scheduled: scheduledCount,
    published: publishedCount,
    engagementIndex: Math.min(100, Math.round((publishedCount * 30 + activeCount * 20) / Math.max(1, list.length))),
  }
}

export const getCategoryLabel = (category) => {
  switch (category) {
    case CATEGORY.VENTURE:
      return 'New Venture Launch'
    case CATEGORY.OFFER:
      return 'Target Achievement Offer'
    case CATEGORY.PAYMENT:
      return 'Payment Reminder'
    case CATEGORY.GENERAL:
    default:
      return 'General Announcement'
  }
}

export const getCountdownLabel = (item) => {
  if (!item?.expiry_date) return 'No expiry'
  const now = new Date().getTime()
  const expiry = new Date(item.expiry_date).getTime()
  const diff = expiry - now
  if (diff <= 0) return 'Expired'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  if (days > 0) return `${days}d ${hours}h left`

  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  return `${hours}h ${minutes}m left`
}

export const getTimeBucket = (item) => {
  if (isExpired(item)) return 'expired'
  if (item.start_date && new Date(item.start_date) > new Date()) return 'scheduled'
  if (isActiveWindow(item)) return 'active'
  return 'draft'
}
