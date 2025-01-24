import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './lib/constants/routes';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Auth Pages
import { AdminLogin } from './pages/auth/AdminLogin';
import { StaffLogin } from './pages/auth/StaffLogin';
import { PatientLogin } from './pages/auth/PatientLogin';

// Admin Portal
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminPatients } from './pages/admin/patients/AdminPatients';
import { AdminStaff } from './pages/admin/staff/AdminStaff';
import { PracticeAnalytics } from './pages/admin/analytics/components/PracticeAnalytics';
import { MembershipPlans } from './pages/admin/membership/MembershipPlans';
import { EmailCampaigns } from './pages/admin/communications/EmailCampaigns';
import { SMSCampaigns } from './pages/admin/communications/SMSCampaigns';
import { VoiceCampaigns } from './pages/admin/communications/VoiceCampaigns';
import { AIPracticeConsultant } from './pages/admin/ai-consultant/AIPracticeConsultant';
import { PracticeSettings } from './pages/admin/settings/PracticeSettings';

// Staff Portal
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { PatientManagement } from './pages/staff/patients/PatientManagement';
import { ScheduleControl } from './pages/staff/schedule/ScheduleControl';
import { TreatmentPlans } from './pages/staff/treatment/TreatmentPlans';

// Patient Portal
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { PatientAppointments } from './pages/patient/appointments/PatientAppointments';
import { MedicalRecords } from './pages/patient/records/MedicalRecords';
import { BillingHistory } from './pages/patient/billing/BillingHistory';

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
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route index element={<AdminDashboard />} />
        <Route path="patients/*" element={<AdminPatients />} />
        <Route path="staff/*" element={<AdminStaff />} />
        <Route path="analytics" element={<PracticeAnalytics />} />
        <Route path="membership" element={<MembershipPlans />} />
        <Route path="communications">
          <Route path="email" element={<EmailCampaigns />} />
          <Route path="sms" element={<SMSCampaigns />} />
          <Route path="voice" element={<VoiceCampaigns />} />
        </Route>
        <Route path="ai-consultant" element={<AIPracticeConsultant />} />
        <Route path="settings" element={<PracticeSettings />} />
      </Route>

      {/* Staff Portal */}
      <Route path="/staff" element={<ProtectedRoute allowedRoles={['staff']} />}>
        <Route index element={<StaffDashboard />} />
        <Route path="patients/*" element={<PatientManagement />} />
        <Route path="schedule" element={<ScheduleControl />} />
        <Route path="treatment-plans" element={<TreatmentPlans />} />
      </Route>

      {/* Patient Portal */}
      <Route path="/patient" element={<ProtectedRoute allowedRoles={['patient']} />}>
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
