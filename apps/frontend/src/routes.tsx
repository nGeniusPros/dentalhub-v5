import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./lib/constants/routes";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Auth Pages
import { AdminLogin } from "./pages/auth/AdminLogin";
import { StaffLogin } from "./pages/auth/StaffLogin";
import { PatientLogin } from "./pages/auth/PatientLogin";

// Admin Portal
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminPatients } from "./pages/admin/patients/AdminPatients";
import { AdminStaff } from "./pages/admin/staff/AdminStaff";
import { AdminRevenue } from "./pages/admin/revenue/AdminRevenue";
import { AdminSatisfaction } from "./pages/admin/satisfaction/AdminSatisfaction";
import { AdminTreatments } from "./pages/admin/treatments/AdminTreatments";
import { AdminDemographics } from "./pages/admin/demographics/AdminDemographics";
import { AdminReports } from "./pages/admin/reports/AdminReports";
import { AdminAI } from "./pages/admin/ai/AdminAI";
import { AdminAppointments } from "./pages/admin/appointments/AdminAppointments";
import { AdminAnalytics } from "./pages/admin/analytics/AdminAnalytics";
import { AdminHR } from "./pages/admin/hr/AdminHR";
import { AdminPlans } from "./pages/admin/plans/AdminPlans";
import { AdminSMS } from "./pages/admin/communications/AdminSMS";
import { AdminEmail } from "./pages/admin/communications/AdminEmail";
import { AdminVoice } from "./pages/admin/communications/AdminVoice";
import { AdminContacts } from "./pages/admin/contacts/AdminContacts";
import { AdminMarketplace } from "./pages/admin/marketplace/AdminMarketplace";
import { AdminSettings } from "./pages/admin/settings/AdminSettings";
import { AdminResources } from "./pages/admin/resources/AdminResources";

// Staff Portal
import { StaffDashboard } from "./pages/staff/StaffDashboard";
import { PatientManagement } from "./pages/staff/patients/PatientManagement";
import { ScheduleControl } from "./pages/staff/schedule/ScheduleControl";
import { TreatmentPlans } from "./pages/staff/treatment/TreatmentPlans";

// Patient Portal
import { PatientDashboard } from "./pages/patient/PatientDashboard";
import { PatientAppointments } from "./pages/patient/appointments/PatientAppointments";
import { MedicalRecords } from "./pages/patient/records/MedicalRecords";
import { BillingHistory } from "./pages/patient/billing/BillingHistory";

const RedirectAuthedUsers = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : <Outlet />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Auth Routes */}
      <Route path="/login" element={<Navigate to="/admin/login" />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/staff/login" element={<StaffLogin />} />
      <Route path="/patient/login" element={<PatientLogin />} />

      {/* Admin Portal */}
      <Route
        path="/admin"
        element={<ProtectedRoute allowedRoles={["admin"]} />}
      >
        {/* Child routes */}
        {/* Quick Access */}
        <Route index element={<AdminDashboard />} />
        <Route path="revenue" element={<AdminRevenue />} />
        <Route path="patients" element={<AdminPatients />} />
        <Route path="satisfaction" element={<AdminSatisfaction />} />
        <Route path="treatments" element={<AdminTreatments />} />
        <Route path="demographics" element={<AdminDemographics />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="ai" element={<AdminAI />} />

        {/* Core */}
        <Route path="patients-list" element={<AdminPatients />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="staff" element={<AdminStaff />} />
        <Route path="hr" element={<AdminHR />} />
        <Route path="plans" element={<AdminPlans />} />

        {/* Communications */}
        <Route path="sms" element={<AdminSMS />} />
        <Route path="email" element={<AdminEmail />} />
        <Route path="voice" element={<AdminVoice />} />

        {/* System */}
        <Route path="contacts" element={<AdminContacts />} />
        <Route path="marketplace" element={<AdminMarketplace />} />
        <Route path="settings" element={<AdminSettings />} />

        {/* Resources */}
        <Route path="resources" element={<AdminResources />} />
      </Route>

      {/* Staff Portal */}
      <Route
        path="/staff"
        element={<ProtectedRoute allowedRoles={["staff"]} />}
      >
        <Route index element={<StaffDashboard />} />
        <Route path="patients/*" element={<PatientManagement />} />
        <Route path="schedule" element={<ScheduleControl />} />
        <Route path="treatment-plans" element={<TreatmentPlans />} />
      </Route>

      {/* Patient Portal */}
      <Route
        path="/patient"
        element={<ProtectedRoute allowedRoles={["patient"]} />}
      >
        <Route index element={<PatientDashboard />} />
        <Route path="appointments" element={<PatientAppointments />} />
        <Route path="records" element={<MedicalRecords />} />
        <Route path="billing" element={<BillingHistory />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};
