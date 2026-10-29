import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { CustomerHome } from './pages/CustomerHome';
import { CustomerRequest } from './pages/CustomerRequest';
import { ArtisanHome } from './pages/ArtisanHome';
import { ArtisanBrief } from './pages/ArtisanBrief';
import { ArtisanUpload } from './pages/ArtisanUpload';
import { ArtisanReport } from './pages/ArtisanReport';
import { NotFound } from './pages/NotFound';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { RoleRoute } from './components/layout/RoleRoute';

// Lazy-load Model Forge chunk per Section 3.5: "route-level code splitting (Forge and charts lazy-loaded)"
const Forge = lazy(() => import('./pages/Forge').then(m => ({ default: m.Forge })));

const FORGE_SLUG = import.meta.env.VITE_FORGE_SLUG || 'forge-secret-8931';

export const AppRoutes: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-bg text-tx font-mono text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-teal animate-ping" />
            <span>Loading Studio Module...</span>
          </div>
        </div>
      }
    >
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Customer Routes */}
        <Route path="/customer" element={<CustomerHome />} />
        <Route path="/customer/new" element={<CustomerRequest />} />
        <Route path="/customer/requests/:id" element={<CustomerRequest />} />

        {/* Artisan Routes */}
        <Route path="/artisan" element={<ArtisanHome />} />
        <Route path="/artisan/requests/:id/brief" element={<ArtisanBrief />} />
        <Route path="/artisan/requests/:id/upload" element={<ArtisanUpload />} />
        <Route path="/artisan/requests/:id/report" element={<ArtisanReport />} />

        {/* Model Forge Developer Route: slug comes from VITE_FORGE_SLUG, role developer required */}
        <Route
          path={`/${FORGE_SLUG}`}
          element={
            <RoleRoute allowedRoles={['developer']} render404OnDeny>
              <Forge />
            </RoleRoute>
          }
        />

        {/* Direct /forge helper redirect to secret slug if developer role is active */}
        <Route
          path="/forge"
          element={
            <RoleRoute allowedRoles={['developer']} render404OnDeny>
              <Navigate to={`/${FORGE_SLUG}`} replace />
            </RoleRoute>
          }
        />

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
