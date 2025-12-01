
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonButton } from '@ionic/react';
import logo from '/src/assets/brand/logo.jpeg';
import navigationConfig, { getNavigationForRole } from '../mod_nav';


const AppSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sidebarShow = useSelector((state) => state.sidebarShow);

  // Get filtered navigation based on user role from local storage
  const navigation = React.useMemo(() => getNavigationForRole(), []);

  const handleBrandClick = () => {
    const userRoleString = localStorage.getItem('user');
    let userRole = null;

    if (userRoleString) {
      try {
        const userData = JSON.parse(userRoleString);
        userRole = userData?.role?.toLowerCase();
      } catch {
        userRole = null;
      }
    }

    if (userRole === 'admin') {
      navigate('/AdminDashboard');
    } else if (userRole === 'agent') {
      navigate('/AgentDashboard');
    } else if (userRole === 'client') {
      navigate('/ClientDashboard');
    } else {
      navigate('/dashboard'); // fallback
    }
  };

  return (
    <IonMenu contentId="main">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle style={{ cursor: 'pointer' }} onClick={handleBrandClick}>
            <img src={logo} alt="AdityaDevelopers" height={30} style={{ verticalAlign: 'middle', marginRight: 8 }} />
            Sri Aditya Developers
          </IonTitle>
          <IonButton slot="end" onClick={() => dispatch({ type: 'set', sidebarShow: false })}>
            Close
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {navigation.map((item, idx) => (
            <IonItem button key={idx} onClick={() => navigate(item.to)}>
              {item.name}
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default React.memo(AppSidebar);
