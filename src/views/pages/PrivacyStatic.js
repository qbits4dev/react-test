import React, { useEffect } from 'react'

const PrivacyStatic = () => {
  useEffect(() => {
    // Redirect to the static privacy.html page in the project root
    window.location.href = '/privacy.html'
  }, [])

  return (
    <div className="text-center p-4">
      <h3>Redirecting to Privacy Policy...</h3>
      <p>If you are not redirected automatically, <a href="/privacy.html">click here</a>.</p>
    </div>
  )
}

export default PrivacyStatic
