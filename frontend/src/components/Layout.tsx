import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';            // ✅ Sidebar ko proper import
import ChatPanel from '../shared/ChatPanel';

interface LayoutProps {
  sidebarContent?: React.ReactNode;
  requireAuth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ sidebarContent, requireAuth = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (requireAuth && !localStorage.getItem('token')) {
      // Store the current location for redirect after login
      localStorage.setItem('redirectAfterLogin', location.pathname + location.search)

      // Redirect to login, but for tenant routes we need tenant login
      if (location.pathname.startsWith('/tenant/')) {
        const tenantSlug = location.pathname.split('/')[2] // Extract tenant slug
        navigate(`/login?tenant=${tenantSlug}`);
      } else {
        navigate('/platform/login');
      }
    }
  }, [requireAuth, navigate, location.pathname, location.search]);

  // Don't render if auth is required but not present
  if (requireAuth && !localStorage.getItem('token')) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <div className="layout">
      <Sidebar>{sidebarContent}</Sidebar>
      <div className="main-content">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
