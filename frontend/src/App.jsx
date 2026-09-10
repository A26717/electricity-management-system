import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import enUS from 'antd/locale/en_US';

// Layouts
import MainLayout from './layouts/MainLayout';
import ClientLayout from './layouts/ClientLayout';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import RoleManagement from './pages/admin/RoleManagement';
import AuditLogs from './pages/admin/AuditLogs';
import AdminSystemSettings from './pages/admin/AdminSystemSettings';
import AdminBackups from './pages/admin/AdminBackups';

// IT Manager Pages
import ITDashboard from './pages/it/ITDashboard';
import ITSecurityEvents from './pages/it/ITSecurityEvents';
import ITSystemHealth from './pages/it/ITSystemHealth';
import ITBackups from './pages/it/ITBackups';
import ITDeviceManagement from './pages/it/ITDeviceManagement';
import ITReports from './pages/it/ITReports';
import ITAuditLogs from './pages/it/ITAuditLogs';
import ITNotifications from './pages/it/ITNotifications';
import ITAlerts from './pages/it/ITAlerts';
import ITMeters from './pages/it/ITMeters';
import ITTokens from './pages/it/ITTokens';
import ITBills from './pages/it/ITBills';
import ITPayments from './pages/it/ITPayments';
import ITComplaints from './pages/it/ITComplaints';
import ITOutages from './pages/it/ITOutages';
import ITProfile from './pages/it/ITProfile';
import ITFraudIntelligence from './pages/it/ITFraudIntelligence';

// Client Pages
import ClientDashboard from './pages/client/ClientDashboard';
import ClientMeters from './pages/client/ClientMeters';
import ClientTokens from './pages/client/ClientTokens';
import ClientBills from './pages/client/ClientBills';
import ClientPayments from './pages/client/ClientPayments';
import ClientComplaints from './pages/client/ClientComplaints';
import ClientOutages from './pages/client/ClientOutages';
import ClientProfile from './pages/client/ClientProfile';
import ClientOutageMap from './pages/client/ClientOutageMap';
import ClientBuyCredit from './pages/client/ClientBuyCredit';

// Operations Pages
import OperationsDashboard from './pages/operations/OperationsDashboard';
import OperationsComplaints from './pages/operations/OperationsComplaints';
import OperationsApprovals from './pages/operations/OperationsApprovals';
import OperationsWorkOrders from './pages/operations/OperationsWorkOrders';
import OperationsReports from './pages/operations/OperationsReports';
import OperationsFieldOperations from './pages/operations/OperationsFieldOperations';
import OperationsProfile from './pages/operations/OperationsProfile';

// Executive Pages
import ExecutiveDashboard from './pages/executive/ExecutiveDashboard';
import ExecutiveRevenue from './pages/executive/ExecutiveRevenue';
import ExecutiveLosses from './pages/executive/ExecutiveLosses';
import ExecutiveFraudOverview from './pages/executive/ExecutiveFraudOverview';
import ExecutiveOutages from './pages/executive/ExecutiveOutages';
import ExecutiveStrategicReports from './pages/executive/ExecutiveStrategicReports';
import ExecutiveHighValueApprovals from './pages/executive/ExecutiveHighValueApprovals';
import ExecutiveProfile from './pages/executive/ExecutiveProfile';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffClientSearch from './pages/staff/StaffClientSearch';
import StaffAssignedMeters from './pages/staff/StaffAssignedMeters';
import StaffComplaints from './pages/staff/StaffComplaints';
import StaffWorkOrders from './pages/staff/StaffWorkOrders';
import StaffPaymentVerification from './pages/staff/StaffPaymentVerification';
import StaffExceptionRequests from './pages/staff/StaffExceptionRequests';
import StaffFieldVisits from './pages/staff/StaffFieldVisits';
import StaffNotifications from './pages/staff/StaffNotifications';
import StaffProfile from './pages/staff/StaffProfile';

// Auth Pages
import ClientLogin from './pages/auth/ClientLogin';
import ITLogin from './pages/auth/ITLogin';
import OperationsLogin from './pages/auth/OperationsLogin';
import ExecutiveLogin from './pages/auth/ExecutiveLogin';
import StaffLogin from './pages/auth/StaffLogin';
import AdminLogin from './pages/auth/AdminLogin';

// Error Pages
import NotFound from './pages/NotFound';

// Store and Context
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';

// Styles
import './App.css';

function App() {
  console.log('🚀 App rendering with full layout');

  return (
    <ConfigProvider
      locale={enUS}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif',
        },
        components: {
          Layout: {
            headerBg: '#001529',
            siderBg: '#001529',
          },
          Table: {
            headerBg: '#fafafa',
          },
        },
      }}
    >
      <AntApp>
        <AuthProvider>
          <ThemeProvider>
            <SocketProvider>
              <Router
                future={{
                  v7_startTransition: true,
                  v7_relativeSplatPath: true,
                }}
              >
                <Routes>
                  {/* Root Redirect */}
                  <Route path="/" element={<Navigate to="/login" replace />} />

                  {/* Auth Routes - All 6 Role-Specific Login Pages */}
                  <Route path="/login" element={<ClientLogin />} />
                  <Route path="/login/client" element={<ClientLogin />} />
                  <Route path="/login/it" element={<ITLogin />} />
                  <Route path="/login/operations" element={<OperationsLogin />} />
                  <Route path="/login/executive" element={<ExecutiveLogin />} />
                  <Route path="/login/staff" element={<StaffLogin />} />
                  <Route path="/login/admin" element={<AdminLogin />} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={<MainLayout />}>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="roles" element={<RoleManagement />} />
                    <Route path="audit-log" element={<AuditLogs />} />
                    <Route path="system-settings" element={<AdminSystemSettings />} />
                    <Route path="backups" element={<AdminBackups />} />
                    <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                  </Route>

                  {/* IT Manager Routes */}
                  <Route path="/it" element={<MainLayout />}>
                    <Route index element={<Navigate to="/it/dashboard" replace />} />
                    <Route path="dashboard" element={<ITDashboard />} />
                    <Route path="security-events" element={<ITSecurityEvents />} />
                    <Route path="system-health" element={<ITSystemHealth />} />
                    <Route path="backups" element={<ITBackups />} />
                    <Route path="device-management" element={<ITDeviceManagement />} />
                    <Route path="reports" element={<ITReports />} />
                    <Route path="audit-logs" element={<ITAuditLogs />} />
                    <Route path="notifications" element={<ITNotifications />} />
                    <Route path="alerts" element={<ITAlerts />} />
                    <Route path="meters" element={<ITMeters />} />
                    <Route path="tokens" element={<ITTokens />} />
                    <Route path="bills" element={<ITBills />} />
                    <Route path="payments" element={<ITPayments />} />
                    <Route path="complaints" element={<ITComplaints />} />
                    <Route path="outages" element={<ITOutages />} />
                    <Route path="fraud-intelligence" element={<ITFraudIntelligence />} />
                    <Route path="profile" element={<ITProfile />} />
                    <Route path="*" element={<Navigate to="/it/dashboard" replace />} />
                  </Route>

                  {/* Operations Manager Routes */}
                  <Route path="/operations" element={<MainLayout />}>
                    <Route index element={<Navigate to="/operations/dashboard" replace />} />
                    <Route path="dashboard" element={<OperationsDashboard />} />
                    <Route path="complaints" element={<OperationsComplaints />} />
                    <Route path="approvals" element={<OperationsApprovals />} />
                    <Route path="work-orders" element={<OperationsWorkOrders />} />
                    <Route path="reports" element={<OperationsReports />} />
                    <Route path="field-operations" element={<OperationsFieldOperations />} />
                    <Route path="profile" element={<OperationsProfile />} />
                    <Route path="*" element={<Navigate to="/operations/dashboard" replace />} />
                  </Route>

                  {/* Executive Routes */}
                  <Route path="/executive" element={<MainLayout />}>
                    <Route index element={<Navigate to="/executive/dashboard" replace />} />
                    <Route path="dashboard" element={<ExecutiveDashboard />} />
                    <Route path="revenue" element={<ExecutiveRevenue />} />
                    <Route path="losses" element={<ExecutiveLosses />} />
                    <Route path="fraud-overview" element={<ExecutiveFraudOverview />} />
                    <Route path="outages" element={<ExecutiveOutages />} />
                    <Route path="strategic-reports" element={<ExecutiveStrategicReports />} />
                    <Route path="high-value-approvals" element={<ExecutiveHighValueApprovals />} />
                    <Route path="profile" element={<ExecutiveProfile />} />
                    <Route path="*" element={<Navigate to="/executive/dashboard" replace />} />
                  </Route>

                  {/* Staff Routes */}
                  <Route path="/staff" element={<MainLayout />}>
                    <Route index element={<Navigate to="/staff/dashboard" replace />} />
                    <Route path="dashboard" element={<StaffDashboard />} />
                    <Route path="client-search" element={<StaffClientSearch />} />
                    <Route path="assigned-meters" element={<StaffAssignedMeters />} />
                    <Route path="complaints" element={<StaffComplaints />} />
                    <Route path="work-orders" element={<StaffWorkOrders />} />
                    <Route path="payment-verification" element={<StaffPaymentVerification />} />
                    <Route path="exception-requests" element={<StaffExceptionRequests />} />
                    <Route path="field-visits" element={<StaffFieldVisits />} />
                    <Route path="notifications" element={<StaffNotifications />} />
                    <Route path="profile" element={<StaffProfile />} />
                    <Route path="*" element={<Navigate to="/staff/dashboard" replace />} />
                  </Route>

                  {/* Client Routes */}
                  <Route path="/client" element={<ClientLayout />}>
                    <Route index element={<Navigate to="/client/dashboard" replace />} />
                    <Route path="dashboard" element={<ClientDashboard />} />
                    <Route path="meters" element={<ClientMeters />} />
                    <Route path="tokens" element={<ClientTokens />} />
                    <Route path="bills" element={<ClientBills />} />
                    <Route path="payments" element={<ClientPayments />} />
                    <Route path="complaints" element={<ClientComplaints />} />
                    <Route path="outages" element={<ClientOutages />} />
                    <Route path="outage-map" element={<ClientOutageMap />} />
                    <Route path="buy-credit" element={<ClientBuyCredit />} />
                    <Route path="profile" element={<ClientProfile />} />
                    <Route path="*" element={<Navigate to="/client/dashboard" replace />} />
                  </Route>

                  {/* 404 - Catch All */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Router>
            </SocketProvider>
          </ThemeProvider>
        </AuthProvider>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;