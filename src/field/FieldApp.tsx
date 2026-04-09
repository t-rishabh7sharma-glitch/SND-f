import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import FieldAppWeb from './FieldAppWeb';
import FieldAppMobile from './FieldAppMobile';

/**
 * ASE field shell: web layout at `/field`, compact app-style shell at `/field/app`
 * (e.g. mobile browser, PWA, or embedded WebView).
 */
export default function FieldApp() {
  return (
    <Routes>
      <Route index element={<FieldAppWeb />} />
      <Route path="app" element={<FieldAppMobile />} />
      <Route path="*" element={<Navigate to="/field" replace />} />
    </Routes>
  );
}
