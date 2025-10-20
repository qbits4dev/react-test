import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
  CSpinner,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/blankprofile.png'

const AppHeaderDropdown = () => {
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    // Try to use cached photo from localStorage (per-user key) to avoid repeated API calls
    const userId = JSON.parse(localStorage.getItem('user') || '{}').u_id || '';
    const storageKey = `profile_photo`;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        // stored may be either a raw base64 string or a full data URL
        if (stored.startsWith('data:')) {
          setProfilePhoto(stored);
        } else {
          setProfilePhoto(`data:image/png;base64,${stored}`);
        }
        return; // don't fetch if we have a cached image
      }
    } catch (e) {
      console.warn('Unable to read profile photo from localStorage:', e);
    }

    // No cached photo, fetch from API and cache the base64 payload
    const photoEndpoint = `${globalThis.apiBaseUrl}/photo?u_id=${userId}`;
    fetch(photoEndpoint)
      .then((res) => res.json())
      .then((data) => {
        if (data.photo_base64) {
          const dataUrl = `data:image/png;base64,${data.photo_base64}`;
          setProfilePhoto(dataUrl);
          try {
            // Save raw base64 to localStorage under a user-scoped key
            localStorage.setItem(storageKey, data.photo_base64);
          } catch (e) {
            console.warn('Failed to save profile photo to localStorage:', e);
          }
        }
      })
      .catch(() => {
        setProfilePhoto(null);
      });
  }, []);

  // Modal & logout state
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);
  const [logoutError, setLogoutError] = React.useState('');

  const handleProfileClick = () => {
    navigate('/profile');
  };

  // Open logout confirmation modal
  const handleLogoutClick = () => {
    setLogoutError('');
    setShowLogoutModal(true);
  };

  // Perform logout: call API, wait for success, then clear storage and redirect
  const confirmLogout = async () => {
    setLoggingOut(true);
    setLogoutError('');
    try {
      const apiUrl = globalThis.apiBaseUrl;
      const accessToken = localStorage.getItem('access_token') || ''
      const refreshToken = localStorage.getItem('refresh_token') || ''

      const resp = await fetch(`${apiUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      if (!resp.ok) {
        // Try to parse server message
        let data = null
        try { data = await resp.json(); } catch (e) { /* ignore */ }
        const msg = (data && (data.message || data.error)) || `Logout failed: ${resp.status} ${resp.statusText}`
        setLogoutError(msg)
        setLoggingOut(false)
        return
      }

      // Success from server: clear storage and caches
      try { localStorage.clear(); } catch (e) { console.warn('localStorage.clear() failed:', e); }
      try { sessionStorage && sessionStorage.clear && sessionStorage.clear(); } catch (e) { /* ignore */ }

      if (typeof caches !== 'undefined' && caches.keys) {
        try {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map((name) => caches.delete(name)));
        } catch (e) {
          console.warn('Failed to clear caches during logout:', e);
        }
      }

      if (navigator && navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
        try {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.unregister()));
        } catch (e) {
          console.warn('Failed to unregister service workers during logout:', e);
        }
      }

      // Close modal before redirecting (so UI isn't stuck in an open modal on navigation)
      try { setShowLogoutModal(false); } catch (e) { /* ignore */ }
      setLoggingOut(false);

      // Redirect to login and reload
      try { navigate('/login'); } catch (e) { /* ignore */ }
      try { window.location.reload(); } catch (e) { /* ignore */ }
    } catch (err) {
      console.error('Network error during logout:', err)
      setLogoutError('Unable to contact server. Please try again.')
      setLoggingOut(false)
    }
  };

  const cancelLogout = () => {
    setLogoutError('')
    setShowLogoutModal(false)
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={profilePhoto || avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem onClick={handleLogoutClick} style={{ cursor: 'pointer' }}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
        {/* Logout confirmation modal */}
        <CModal visible={showLogoutModal} onClose={cancelLogout} backdrop="static" alignment="center">
          <CModalHeader>
            <CModalTitle>Confirm Logout</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <p>Are you sure you want to log out?</p>
            {logoutError && <p className="text-danger">{logoutError}</p>}
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={cancelLogout} disabled={loggingOut}>Cancel</CButton>
            <CButton color="danger" onClick={confirmLogout} disabled={loggingOut}>
              {loggingOut ? (
                <><CSpinner size="sm" className="me-2" />Logging out...</>
              ) : (
                'Logout'
              )}
            </CButton>
          </CModalFooter>
        </CModal>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
