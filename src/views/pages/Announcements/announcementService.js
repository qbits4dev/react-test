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

const safeJson = async (res) => {
  try {
    return await res.json()
  } catch {
    return null
  }
}

const nowIso = () => new Date().toISOString()

const uid = () => `ann_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`

const normalize = (item) => {
  const details = item.category_details || {}
  return {
    id: item.id || uid(),
    category: item.category || CATEGORY.GENERAL,
    title: item.title || '',
    description: item.description || '',
    banner_image: item.banner_image || '',
    venture_name: item.venture_name || details.venture_name || '',
    launch_date: item.launch_date || details.launch_date || '',
    location: item.location || details.location || '',
    cta_text: item.cta_text || details.cta_text || '',
    cta_url: item.cta_url || details.cta_url || '',
    offer_description: item.offer_description || details.offer_description || '',
    target_required: item.target_required || details.target_required || '',
    reward_details: item.reward_details || details.reward_details || '',
    client_id: item.client_id || details.client_id || '',
    client_name: item.client_name || details.client_name || '',
    project: item.project || details.project || '',
    plot_number: item.plot_number || details.plot_number || '',
    payment_amount: item.payment_amount || details.payment_amount || '',
    payment_due_date: item.payment_due_date || details.payment_due_date || '',
    deducting_bank: item.deducting_bank || details.deducting_bank || '',
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
  }
}

const serialize = (item) => {
  const serialized = {
    category: item.category,
    title: item.title,
    description: item.description,
    banner_image: item.banner_image || null,
    reminder_priority: item.reminder_priority,
    visibility: item.visibility,
    selected_client: item.selected_client || null,
    selected_teams: item.selected_teams || [],
    selected_designations: item.selected_designations || [],
    start_date: item.start_date,
    expiry_date: item.expiry_date,
    status: item.status,
    category_details: {},
  }

  if (item.category === CATEGORY.VENTURE) {
    serialized.category_details = {
      venture_name: item.venture_name || '',
      launch_date: item.launch_date || '',
      location: item.location || '',
      cta_text: item.cta_text || '',
      cta_url: item.cta_url || '',
    }
  } else if (item.category === CATEGORY.OFFER) {
    serialized.category_details = {
      offer_description: item.offer_description || '',
      target_required: item.target_required || '',
      reward_details: item.reward_details || '',
    }
  } else if (item.category === CATEGORY.PAYMENT) {
    serialized.category_details = {
      client_name: item.client_name || '',
      project: item.project || '',
      plot_number: item.plot_number || '',
      payment_amount: item.payment_amount || '',
      payment_due_date: item.payment_due_date || '',
      deducting_bank: item.deducting_bank || '',
    }
  }

  return serialized
}

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

const endpoint = () => `${globalThis.apiBaseUrl}/announcements/`

export const AnnouncementCategory = CATEGORY
export const AnnouncementVisibility = VISIBILITY

export const listAnnouncementsForAdmin = async () => {
  try {
    const res = await fetch(endpoint())
    if (res.ok) {
      const data = await safeJson(res)
      const list = Array.isArray(data) ? data : data?.items || []
      return sortByPriorityAndDate(list.map(normalize))
    }
  } catch (err) {
    console.error('Error fetching announcements:', err)
  }
  return []
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

  const res = await fetch(endpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(serialize(record)),
  })
  if (res.ok) {
    const data = await safeJson(res)
    return normalize(data || record)
  }
  throw new Error('Failed to create announcement')
}

export const updateAnnouncement = async (id, payload) => {
  const record = normalize({ ...payload, id, updated_at: nowIso() })

  const res = await fetch(`${globalThis.apiBaseUrl}/announcements/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(serialize(record)),
  })
  if (res.ok) {
    const data = await safeJson(res)
    return normalize(data || record)
  }
  throw new Error('Failed to update announcement')
}

export const deleteAnnouncement = async (id) => {
  const res = await fetch(`${globalThis.apiBaseUrl}/announcements/${encodeURIComponent(id)}`, { method: 'DELETE' })
  if (res.ok) return true
  throw new Error('Failed to delete announcement')
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
