import React, { useEffect } from 'react'

const DeleteAccountStatic = () => {
  useEffect(() => {
    // Redirect to the static delete-account.html page in the project root
    window.location.href = '/delete-account.html'
  }, [])

  return (
    <div className="text-center p-4">
      <h3>Redirecting to Delete Account page...</h3>
      <p>If you are not redirected automatically, <a href="/delete-account.html">click here</a>.</p>
    </div>
  )
}

export default DeleteAccountStatic
