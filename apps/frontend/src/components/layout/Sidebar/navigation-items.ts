import type { NavSection } from "./types";

export const adminNavItems: NavSection[] = [
  {
    category: "Quick Access",
    items: [
      {
        icon: "DollarSign",
        label: "Revenue",
        path: "/admin-dashboard?metric=revenue",
      },
      {
        icon: "Users2",
        label: "Active Patients",
        path: "/admin-dashboard?metric=patients",
      },
      {
        icon: "Star",
        label: "Patient Satisfaction",
        path: "/admin-dashboard/satisfaction",
      },
      {
        icon: "Activity",
        label: "Treatment Success",
        path: "/admin-dashboard/success",
      },
      {
        icon: "PieChart",
        label: "Demographics",
        path: "/admin-dashboard?metric=demographics",
      },
      {
        icon: "FileBarChart",
        label: "Monthly Reports",
        path: "/admin-dashboard?metric=reports",
      },
    ],
  },
  {
    category: "Core",
    items: [
      { icon: "LayoutDashboard", label: "Dashboard", path: "/admin-dashboard" },
      {
        icon: "Brain",
        label: "AI Consultant",
        path: "/admin-dashboard/ai-consultant",
      },
      { icon: "Users2", label: "Patients", path: "/admin-dashboard/patients" },
      {
        icon: "CalendarCheck",
        label: "Appointments",
        path: "/admin-dashboard/appointments",
      },
      {
        icon: "BarChart3",
        label: "Analytics",
        path: "/admin-dashboard/analytics",
      },
      { icon: "UserCog", label: "Staff", path: "/admin-dashboard/staff" },
      { icon: "Users2", label: "HR", path: "/admin-dashboard/hr" },
      {
        icon: "Crown",
        label: "Membership Plans",
        path: "/admin-dashboard/membership-plans",
      },
    ],
  },
  {
    category: "Communications",
    items: [
      {
        icon: "MessageSquare",
        label: "SMS Campaigns",
        path: "/admin-dashboard/sms-campaigns",
      },
      {
        icon: "Mail",
        label: "Email Campaigns",
        path: "/admin-dashboard/email-campaigns",
      },
      {
        icon: "Phone",
        label: "Voice Campaigns",
        path: "/admin-dashboard/voice-campaigns",
      },
    ],
  },
  {
    category: "System",
    items: [
      {
        icon: "Building2",
        label: "Contact Manager",
        path: "/admin-dashboard/contact-manager",
      },
      {
        icon: "Store",
        label: "Marketplace",
        path: "/admin-dashboard/marketplace",
      },
      {
        icon: "Settings",
        label: "Settings",
        path: "/admin-dashboard/settings",
      },
    ],
  },
  {
    category: "Resources",
    items: [
      {
        id: "resources",
        label: "Resources",
        icon: "Files",
        path: "/admin-dashboard/resources",
      },
      {
        id: "learning",
        label: "Learning Center",
        icon: "GraduationCap",
        path: "/admin-dashboard/learning",
      },
      {
        id: "marketplace",
        label: "Marketplace",
        icon: "Store",
        path: "/admin-dashboard/marketplace",
      },
    ],
  },
];

export const staffNavItems: NavSection[] = [
  {
    category: "Quick Access",
    items: [
      { icon: "LayoutDashboard", label: "Dashboard", path: "/staff-dashboard" },
      { icon: "Users2", label: "Patients", path: "/staff-dashboard/patients" },
      {
        icon: "CalendarCheck",
        label: "Appointments",
        path: "/staff-dashboard/appointments",
      },
    ],
  },
  {
    category: "Clinical",
    items: [
      {
        icon: "Stethoscope",
        label: "Treatments",
        path: "/staff-dashboard/treatments",
      },
      {
        icon: "FileText",
        label: "Patient Records",
        path: "/staff-dashboard/records",
      },
    ],
  },
  {
    category: "Communications",
    items: [
      {
        icon: "MessageSquare",
        label: "Messages",
        path: "/staff-dashboard/messages",
      },
      {
        icon: "Phone",
        label: "Call Center",
        path: "/staff-dashboard/call-center",
      },
    ],
  },
  {
    category: "System",
    items: [
      {
        icon: "Settings",
        label: "Settings",
        path: "/staff-dashboard/settings",
      },
    ],
  },
];

export const patientNavItems: NavSection[] = [
  {
    category: "Main",
    items: [
      {
        icon: "LayoutDashboard",
        label: "Dashboard",
        path: "/patient-dashboard",
      },
      {
        icon: "CalendarCheck",
        label: "Appointments",
        path: "/patient-dashboard/appointments",
      },
      {
        icon: "Crown",
        label: "Membership",
        path: "/patient-dashboard/membership",
      },
    ],
  },
  {
    category: "Records",
    items: [
      {
        icon: "FileText",
        label: "Documents",
        path: "/patient-dashboard/documents",
      },
      {
        icon: "CreditCard",
        label: "Billing",
        path: "/patient-dashboard/billing",
      },
    ],
  },
  {
    category: "Communication",
    items: [
      {
        icon: "MessageSquare",
        label: "Messages",
        path: "/patient-dashboard/messages",
      },
      {
        icon: "Settings",
        label: "Settings",
        path: "/patient-dashboard/settings",
      },
    ],
  },
];
