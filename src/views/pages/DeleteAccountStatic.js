import React, { useEffect } from 'react'

const DeleteAccountStatic = () => {
  useEffect(() => {
    // Redirect to the static delete-account.html page in the project public output root
    const basePath = window.location.pathname.replace(/\/$/, '')
    const target = `${window.location.origin}${basePath}/delete-account.html`
    window.location.href = target
  }, [])

  return (
    <div className="text-center p-4">
      <h3>Redirecting to Delete Account page...</h3>
      <p>
        If you are not redirected automatically,{' '}
        <a href={`${window.location.pathname.replace(/\/$/, '')}/delete-account.html`}>
          click here
        </a>
      </p>
    </div>
  )
}

export default DeleteAccountStatic
