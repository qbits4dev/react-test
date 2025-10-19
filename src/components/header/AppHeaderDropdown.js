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
  globalThis.apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  useEffect(() => {
    // Replace with your actual API endpoint
    fetch('${globalThis.apiBaseUrl}/photo?u_id=' + localStorage.getItem('user_id'))
      .then(res => res.json())
      .then(data => {
        if (data.photo_base64) {
          setProfilePhoto(`data:image/png;base64,${data.photo_base64}`);
        }
      })
      .catch(() => {
        setProfilePhoto(null);
      });
  }, []);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={profilePhoto} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem href="#">
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown