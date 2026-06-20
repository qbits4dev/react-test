export const sanitizeSingleSpaced = (value = '') =>
  String(value)
    .replace(/\s+/g, ' ')
    .replace(/^\s+/g, '')

export const sanitizeName = (value = '', maxLength = 60) =>
  sanitizeSingleSpaced(value)
    .replace(/[^A-Za-z ]/g, '')
    .slice(0, maxLength)

export const sanitizeUsername = (value = '', maxLength = 30) =>
  String(value)
    .replace(/\s+/g, '')
    .replace(/[^A-Za-z0-9._]/g, '')
    .slice(0, maxLength)

export const sanitizeNumeric = (value = '', maxLength = 20) =>
  String(value)
    .replace(/[^0-9]/g, '')
    .slice(0, maxLength)

export const sanitizeAlphaNumericBasic = (value = '', maxLength = 80) =>
  sanitizeSingleSpaced(value)
    .replace(/[^A-Za-z0-9 &\-]/g, '')
    .slice(0, maxLength)

export const sanitizeText = (value = '', maxLength = 500) =>
  sanitizeSingleSpaced(value)
    .replace(/[<>]/g, '')
    .replace(/(script|select|insert|update|delete|drop|truncate)/gi, '')
    .slice(0, maxLength)

export const validateEmail = (value = '') =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim())

export const validateIndianMobile = (value = '') =>
  /^[6-9][0-9]{9}$/.test(String(value).trim())

export const validateStrongPassword = (value = '') => {
  const pwd = String(value)
  if (pwd.length < 8) return 'Password must be at least 8 characters.'
  if (pwd.length > 32) return 'Password must not exceed 32 characters.'
  if (!/[A-Z]/.test(pwd)) return 'Password must contain at least one uppercase letter.'
  if (!/[a-z]/.test(pwd)) return 'Password must contain at least one lowercase letter.'
  if (!/[0-9]/.test(pwd)) return 'Password must contain at least one number.'
  return ''
}

export const getPasswordStrength = (value = '') => {
  const pwd = String(value)
  let score = 0
  if (pwd.length >= 8) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[a-z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++

  if (score <= 2) return { label: 'Weak', color: 'danger', value: 25 }
  if (score <= 3) return { label: 'Fair', color: 'warning', value: 50 }
  if (score <= 4) return { label: 'Good', color: 'info', value: 75 }
  return { label: 'Strong', color: 'success', value: 100 }
}

export const validateAgeRangeFromDob = (dob, minAge = 18, maxAge = 80) => {
  if (!dob) return false
  const birthDate = new Date(dob)
  if (Number.isNaN(birthDate.getTime())) return false
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
  return age >= minAge && age <= maxAge
}

export const sanitizeRestrictedText = (value = '', maxLength = 120) =>
  String(value)
    .replace(/[^A-Za-z0-9 .\-]/g, '')
    .slice(0, maxLength)

export const sanitizeAddress = (value = '', maxLength = 150) =>
  String(value)
    .replace(/[^A-Za-z0-9 .,\-()/#]/g, '')
    .slice(0, maxLength)
