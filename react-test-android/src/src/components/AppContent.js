
import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { IonContent, IonSpinner } from '@ionic/react';
import routes from '../routes';
import ProtectedRoute from './ProtectedRoute';

const AppContent = () => {
  return (
    <IonContent id="main" className="ion-padding">
      <Suspense fallback={<IonSpinner name="crescent" color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={
                    route.roles && Array.isArray(route.roles) && route.roles.length > 0 ? (
                      <ProtectedRoute allowedRoles={route.roles}>
                        <route.element />
                      </ProtectedRoute>
                    ) : (
                      <route.element />
                    )
                  }
                />
              )
            );
          })}
          <Route path="/" element={<Navigate to="login" replace />} />
        </Routes>
      </Suspense>
    </IonContent>
  );
};

export default React.memo(AppContent);
