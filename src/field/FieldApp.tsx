import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import FieldAppWeb from './FieldAppWeb';
import FieldAppMobile from './FieldAppMobile';

const MOBILE_MQ = '(max-width: 1023px)';

/**
 * `/field` on a phone should open the tab-bar shell (`/field/app`). The web layout has no bottom nav on small screens.
 */
function FieldIndex() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_MQ).matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  if (isMobile) {
    return <Navigate to="/field/app" replace />;
  }
  return <FieldAppWeb />;
}

/**
 * ASE field shell: web layout at `/field` (desktop), compact app with bottom tabs at `/field/app` (phones / narrow viewports auto-redirect from `/field`).
 */
export default function FieldApp() {
  return (
    <Routes>
      <Route index element={<FieldIndex />} />
      <Route path="app" element={<FieldAppMobile />} />
      <Route path="*" element={<Navigate to="/field" replace />} />
    </Routes>
  );
}
