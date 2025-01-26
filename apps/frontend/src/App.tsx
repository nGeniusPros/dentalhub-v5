import React from "react";
import { Routes, Route } from "react-router-dom";
import { EmailProvider } from "./contexts/EmailContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { LearningProvider } from "./contexts/LearningContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Toaster } from "@/components/ui/toaster";

// Admin Routes
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminStaff } from "@/pages/admin/staff/AdminStaff";
import { AdminPatients } from "@/pages/admin/patients/AdminPatients";
import { EmailCampaigns } from "@/pages/admin/communications/EmailCampaigns";
import { SMSCampaigns } from "@/pages/admin/communications/SMSCampaigns";
import { VoiceCampaigns } from "@/pages/admin/communications/VoiceCampaigns";

// Auth Routes
import { AdminLogin } from "@/pages/auth/AdminLogin";
import { StaffLogin } from "@/pages/auth/StaffLogin";
import { PatientLogin } from "@/pages/auth/PatientLogin";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <LearningProvider>
            <SettingsProvider>
              <EmailProvider>
                <div className="min-h-screen bg-gray-50">
                  <Routes>
                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/staff" element={<AdminStaff />} />
                    <Route path="/admin/patients" element={<AdminPatients />} />
                    <Route
                      path="/admin/communications/email"
                      element={<EmailCampaigns />}
                    />
                    <Route
                      path="/admin/communications/sms"
                      element={<SMSCampaigns />}
                    />
                    <Route
                      path="/admin/communications/voice"
                      element={<VoiceCampaigns />}
                    />

                    {/* Auth Routes */}
                    <Route path="/auth/admin/login" element={<AdminLogin />} />
                    <Route path="/auth/staff/login" element={<StaffLogin />} />
                    <Route
                      path="/auth/patient/login"
                      element={<PatientLogin />}
                    />

                    {/* Default redirect */}
                    <Route path="*" element={<AdminLogin />} />
                  </Routes>
                  <Toaster />
                </div>
              </EmailProvider>
            </SettingsProvider>
          </LearningProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
