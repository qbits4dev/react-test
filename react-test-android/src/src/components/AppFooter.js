
import React from 'react';
import { IonFooter, IonToolbar, IonText } from '@ionic/react';

const AppFooter = () => {
  return (
    <IonFooter>
      <IonToolbar color="light" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0' }}>
        <IonText className="ion-text-center">
          <a href="https://www.sriadityadevelopers.com/" target="_blank" rel="noopener noreferrer">
            AdityaDevelopers
          </a>
          <span style={{ marginLeft: 8 }}>&copy; 2025 QBITS4DEV.</span>
        </IonText>
        <IonText className="ion-text-center" style={{ marginTop: 8 }}>
          <span style={{ marginRight: 8 }}>Powered by</span>
          <a href="https://qbits4dev.com/" target="_blank" rel="noopener noreferrer">
            QBITS4DEVELOPERS PVT LTD
          </a>
        </IonText>
      </IonToolbar>
    </IonFooter>
  );
};

export default React.memo(AppFooter);
