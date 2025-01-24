import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import StaffDashboard from '../pages/staff/StaffDashboard';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import InsuranceARDashboard from '../pages/admin/insurance/InsuranceARDashboard';
import HRDashboard from '../pages/admin/hr/HRDashboard';
import AdminLogin from '../pages/login/AdminLogin';
import StaffLogin from '../pages/login/StaffLogin';
import PatientLogin from '../pages/login/PatientLogin';
import PatientDashboard from '../pages/patient/PatientDashboard';
import MembershipPlans from '../pages/admin/MembershipPlans';
import Membership from '../pages/patient/Membership';
import AIPracticeConsultant from '../pages/admin/AIPracticeConsultant';
import Analytics from '../pages/admin/Analytics';
import Patients from '../pages/admin/Patients';
import SMSCampaigns from '../pages/admin/communications/SMSCampaigns';
import PasswordManager from '../pages/admin/settings/PasswordManager';
import VendorManagement from '../pages/admin/settings/VendorManagement';
import GeneralSettings from '../pages/admin/settings/GeneralSettings';
import Marketplace from '../pages/admin/marketplace/Marketplace';
import StaffManagement from '../pages/admin/hr/StaffManagement';
import EmailDashboard from '../pages/admin/communications/EmailDashboard';
import VoiceCampaigns from '../pages/admin/communications/VoiceCampaigns';
import SocialMediaDashboard from '../pages/admin/social/SocialMediaDashboard';
import LearningDashboard from '../pages/admin/learning/LearningDashboard';
import ResourcesDashboard from '../pages/admin/resources/ResourcesDashboard';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Login routes */}
      <Route path="/login" element={<Navigate to="/login/admin" replace />} />
      <Route path="/login/patient" element={<PatientLogin />} />
      <Route path="/login/staff" element={<StaffLogin />} />
      <Route path="/login/admin" element={<AdminLogin />} />

      {/* Admin routes */}
      <Route path="/admin-dashboard" element={<ProtectedRoute role="admin"><DashboardLayout role="admin" /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="ai-consultant" element={<AIPracticeConsultant />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="patients" element={<Patients />} />
        <Route path="insurance" element={<InsuranceARDashboard />} />
        <Route path="hr" element={<HRDashboard />} />
        <Route path="staff" element={<StaffManagement />} />
        <Route path="membership-plans" element={<MembershipPlans />} />
        <Route path="sms-campaigns" element={<SMSCampaigns />} />
        <Route path="email-dashboard" element={<EmailDashboard />} />
        <Route path="voice-campaigns" element={<VoiceCampaigns />} />
        <Route path="social-media" element={<SocialMediaDashboard />} />
        <Route path="learning" element={<LearningDashboard />} />
        <Route path="resources" element={<ResourcesDashboard />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="settings">
          <Route path="password" element={<PasswordManager />} />
          <Route path="vendors" element={<VendorManagement />} />
          <Route path="general" element={<GeneralSettings />} />
        </Route>
      </Route>

      {/* Staff routes */}
      <Route path="/staff-dashboard" element={<ProtectedRoute role="staff"><DashboardLayout role="staff" /></ProtectedRoute>}>
        <Route index element={<StaffDashboard />} />
      </Route>

      {/* Patient routes */}
      <Route path="/patient-dashboard" element={<ProtectedRoute role="patient"><DashboardLayout role="patient" /></ProtectedRoute>}>
        <Route index element={<PatientDashboard />} />
        <Route path="membership" element={<Membership />} />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};