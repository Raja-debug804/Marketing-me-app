import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';            // ✅ Sidebar ko proper import
import ChatPanel from '../shared/ChatPanel';

interface LayoutProps {
  sidebarContent?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ sidebarContent }) => {
  return (
    <div className="layout">
      <Sidebar>{sidebarContent}</Sidebar>
      <div className="main-content">
        <div className="content-wrapper">
          <Outlet />
        </div>
        <ChatPanel />
      </div>
    </div>
  );
};

export default Layout;
