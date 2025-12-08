import { Routes, Route, Navigate } from 'react-router-dom'
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
import TenantAI from '../pages/TenantAI'
import ChatPanel from '../shared/ChatPanel'
import Layout from '../components/Layout'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/platform/login" element={<Login platform />} />

      {/* Platform routes */}
      <Route path="/platform" element={<Layout />}>
        <Route path="tenants" element={<PlatformTenants />} />
      </Route>

      {/* Tenant workspace routes */}
      <Route path="/tenant/:tenantSlug/app" element={<Layout requireAuth />}>
        <Route path="overview" element={<Overview />} />
        <Route path="subscriptions" element={<NotifySubscriptions />} />
        <Route path="templates" element={<Templates />} />
        <Route path="rules" element={<Rules />} />
        <Route path="insights" element={<Insights />} />
        <Route path="shopify" element={<ShopifySettings />} />
        <Route path="ga4" element={<GA4Settings />} />
        <Route path="users" element={<Users />} />
        <Route path="ai" element={<TenantAI />} />
        <Route path="embed-snippet" element={<PublicSnippet />} />
      </Route>

      {/* Legacy app routes - redirect to platform/tenants */}
      <Route path="/app" element={<Layout requireAuth />}>
        <Route path="overview" element={<Overview />} />
        <Route path="notify/subscriptions" element={<NotifySubscriptions />} />
        <Route path="notify/templates" element={<Templates />} />
        <Route path="notify/rules" element={<Rules />} />
        <Route path="insights" element={<Insights />} />
        <Route path="settings/integrations/shopify" element={<ShopifySettings />} />
        <Route path="settings/integrations/ga4" element={<GA4Settings />} />
        <Route path="settings/users" element={<Users />} />
      </Route>

      <Route path="/public/snippet" element={<PublicSnippet />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/platform/tenants" replace />} />
    </Routes>
  )
}
