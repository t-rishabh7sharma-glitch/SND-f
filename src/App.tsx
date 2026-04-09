import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SessionProvider, getBoPrefix, useSession } from './context/SessionContext';
import { BoDataProvider } from './context/BoDataContext';
import LoginPage from './pages/LoginPage';
import FieldApp from './field/FieldApp';
import BoLayout from './bo/BoLayout';
import { boChildRouteElements } from './bo/boChildRoutes';

function ProtectedField({ children }: { children: React.ReactNode }) {
  const { user } = useSession();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'ASE') return <Navigate to={`/bo/${getBoPrefix(user.role)}/dashboard`} replace />;
  return <>{children}</>;
}

function ProtectedBo({ children }: { children: React.ReactNode }) {
  const { user } = useSession();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ASE') return <Navigate to="/field" replace />;
  return <>{children}</>;
}

function HomeRedirect() {
  const { user } = useSession();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ASE') return <Navigate to="/field" replace />;
  return <Navigate to={`/bo/${getBoPrefix(user.role)}/dashboard`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/field/*"
            element={
              <ProtectedField>
                <FieldApp />
              </ProtectedField>
            }
          />
          <Route
            path="/bo"
            element={
              <ProtectedBo>
                <BoDataProvider>
                  <BoLayout />
                </BoDataProvider>
              </ProtectedBo>
            }
          >
            {boChildRouteElements}
          </Route>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  );
}
