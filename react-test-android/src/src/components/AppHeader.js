
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonMenuButton, IonIcon } from '@ionic/react';
import { sunny, moon, contrast, menu, notifications } from 'ionicons/icons';
import { AppBreadcrumb } from './index';
import { AppHeaderDropdown } from './header/index';


const AppHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sidebarShow = useSelector((state) => state.sidebarShow);

  const handleDashboardClick = () => {
    const userRole = localStorage.getItem('user_role');
    if (userRole === 'admin') {
      navigate('/AdminDashboard');
    } else if (userRole === 'agent') {
      navigate('/AgentDashboard');
    } else if (userRole === 'customer') {
      navigate('/ClientDashboard');
    } else {
      navigate('/dashboard'); // Fallback route
    }
  };

  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonMenuButton onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })} />
        </IonButtons>
        <IonTitle onClick={handleDashboardClick} style={{ cursor: 'pointer' }}>
          Dashboard
        </IonTitle>
        <IonButtons slot="end">
          <IonButton>
            <IonIcon icon={notifications} />
          </IonButton>
          <AppHeaderDropdown />
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default AppHeader;
