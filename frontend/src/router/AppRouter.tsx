import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Overview from '../pages/Overview'
import Login from '../pages/Login'
import PlatformTenants from '../pages/PlatformTenants'
import Insights from '../pages/Insights'
import NotifySubscriptions from '../pages/NotifySubscriptions'
import Templates from '../pages/Templates'
import Rules from '../pages/Rules'
import ShopifySettings from '../pages/ShopifySettings'
import GA4Settings from '../pages/GA4Settings'
import Users from '../pages/Users'
import PublicSnippet from '../pages/PublicSnippet'

const Sidebar = () => (
  <div className="sidebar">
    <h3>NotifyInsights</h3>
    <Link to="/app/overview">Overview</Link>
    <Link to="/app/notify/subscriptions">Notify Subscriptions</Link>
    <Link to="/app/notify/templates">Templates</Link>
    <Link to="/app/notify/rules">Rules</Link>
    <Link to="/app/insights">Insights</Link>
    <Link to="/app/settings/integrations/shopify">Shopify</Link>
    <Link to="/app/settings/integrations/ga4">GA4</Link>
    <Link to="/app/settings/users">Users</Link>
    <Link to="/platform/tenants">Platform Tenants</Link>
    <Link to="/public/snippet">Embed Snippet</Link>
  </div>
)

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="layout">
    <Sidebar />
    <div className="content">{children}</div>
  </div>
)

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/platform/login" element={<Login platform />} />
      <Route
        path="/app/*"
        element={
          <AppLayout>
            <Routes>
              <Route path="overview" element={<Overview />} />
              <Route path="notify/subscriptions" element={<NotifySubscriptions />} />
              <Route path="notify/templates" element={<Templates />} />
              <Route path="notify/rules" element={<Rules />} />
              <Route path="insights" element={<Insights />} />
              <Route path="settings/integrations/shopify" element={<ShopifySettings />} />
              <Route path="settings/integrations/ga4" element={<GA4Settings />} />
              <Route path="settings/users" element={<Users />} />
            </Routes>
          </AppLayout>
        }
      />
      <Route path="/platform/tenants" element={<AppLayout><PlatformTenants /></AppLayout>} />
      <Route path="/public/snippet" element={<PublicSnippet />} />
      <Route path="*" element={<Navigate to="/app/overview" replace />} />
    </Routes>
  )
}
