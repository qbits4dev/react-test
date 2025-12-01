
import React, { Suspense, useEffect } from 'react';
import { IonApp, IonContent, IonPage } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Routes, Navigate, useLocation, matchPath } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CSpinner, useColorModes } from '@coreui/react';
import './scss/style.scss';
import './scss/examples.scss';

// routes config
import routes from './routes';

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));
const Verification = React.lazy(() => import('./views/pages/verification'));
globalThis.apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
console.log('API Base URL:', globalThis.apiBaseUrl);

const AgentRegistration = React.lazy(() => import('./views/pages/register/register_agent'));
const ClientRegister = React.lazy(() => import('./views/pages/register/cilent_register'));

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('user');
  const userData = JSON.parse(token);
  const currentUserRole = userData?.role?.toLowerCase();

  const matchedRoute = routes.find((route) => matchPath(route.path, location.pathname));

  if (matchedRoute) {
    const allowedRoles = matchedRoute.meta?.allowedRoles || [];
    if (allowedRoles.length > 0 && !allowedRoles.includes(currentUserRole)) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

const App = () => {
  const { setColorMode } = useColorModes('coreui-free-react-admin-template-theme');

  useEffect(() => {
    setColorMode('light');
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <Suspense
          fallback={
            <IonPage>
              <IonContent className="pt-3 text-center">
                <CSpinner color="primary" variant="grow" />
              </IonContent>
            </IonPage>
          }
        >
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to="login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/404" element={<Page404 />} />
            <Route path="/500" element={<Page500 />} />
            <Route path="/verification" element={<Verification />} />
            {/* Protected routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <DefaultLayout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;