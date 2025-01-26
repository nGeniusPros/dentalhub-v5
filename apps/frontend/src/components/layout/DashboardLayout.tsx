import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "./Header";
import { AdminSidebar } from "./AdminSidebar";
import { ROUTES } from "@/lib/constants/routes";

interface NavItem {
  label: string;
  icon: keyof typeof Icons;
  path: string;
  roles?: string[];
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const { user } = useAuth();
  const location = useLocation();
  const userRole = user?.user_metadata?.role || "patient";

  const getDashboardPath = () => {
    switch (userRole) {
      case "admin":
        return ROUTES.DASHBOARD.ADMIN;
      case "staff":
        return ROUTES.DASHBOARD.STAFF;
      default:
        return ROUTES.DASHBOARD.PATIENT;
    }
  };

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      icon: "Home",
      path: getDashboardPath(),
      roles: ["admin", "staff", "patient"],
    },
    {
      label: "Appointments",
      icon: "Calendar",
      path: `${getDashboardPath()}/appointments`,
      roles: ["admin", "staff", "patient"],
    },
    {
      label: "Patients",
      icon: "Users",
      path: `${getDashboardPath()}/patients`,
      roles: ["admin", "staff"],
    },
    {
      label: "Staff",
      icon: "UserPlus",
      path: `${getDashboardPath()}/staff`,
      roles: ["admin"],
    },
    {
      label: "Analytics",
      icon: "BarChart2",
      path: `${getDashboardPath()}/analytics`,
      roles: ["admin"],
    },
    {
      label: "Settings",
      icon: "Settings",
      path: `${getDashboardPath()}/settings`,
      roles: ["admin", "staff", "patient"],
    },
    {
      label: "Resources",
      icon: "BookOpen",
      path: ROUTES.DASHBOARD.RESOURCES,
      roles: ["admin"],
    },
  ];

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(userRole),
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Header />
      {/* Sidebar */}
      <AdminSidebar
        navItems={filteredNavItems}
        location={location}
        Icons={Icons}
      />

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 overflow-auto"
      >
        {children}
      </motion.main>
    </div>
  );
};
