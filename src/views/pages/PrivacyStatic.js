import React, { useEffect } from 'react'

const PrivacyStatic = () => {
  useEffect(() => {
    // Redirect to the static privacy.html page in the project public output root
    const basePath = window.location.pathname.replace(/\/$/, '')
    const target = `${window.location.origin}${basePath}/privacy.html`
    window.location.href = target
  }, [])

  return (
    <div className="text-center p-4">
      <h3>Redirecting to Privacy Policy...</h3>
      <p>
        If you are not redirected automatically,{' '}
        <a href={`${window.location.pathname.replace(/\/$/, '')}/privacy.html`}>
          click here
        </a>
      </p>
    </div>
  )
}

export default PrivacyStatic
