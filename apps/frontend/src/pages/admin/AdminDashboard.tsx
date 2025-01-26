import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Users,
  CheckCircle,
  Calendar,
  FileText,
  Clock,
  Star,
  TrendingUp,
} from "lucide-react";
import { KPIOverview } from "./components/KPIOverview";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { PatientMetricsChart } from "@/components/charts/PatientMetricsChart";
import { StaffPerformance } from "@/components/staff/StaffPerformance";
import { AppointmentOverview } from "@/components/appointments/AppointmentOverview";

// Sample data - Replace with actual data from your API
const revenueData = [
  { name: "Jan", revenue: 65000, expenses: 45000, profit: 20000 },
  { name: "Feb", revenue: 75000, expenses: 48000, profit: 27000 },
  { name: "Mar", revenue: 85000, expenses: 52000, profit: 33000 },
  { name: "Apr", revenue: 95000, expenses: 55000, profit: 40000 },
  { name: "May", revenue: 105000, expenses: 58000, profit: 47000 },
  { name: "Jun", revenue: 115000, expenses: 62000, profit: 53000 },
];

const patientData = [
  { name: "Jan", newPatients: 45, returningPatients: 65, referrals: 20 },
  { name: "Feb", newPatients: 50, returningPatients: 70, referrals: 25 },
  { name: "Mar", newPatients: 55, returningPatients: 75, referrals: 30 },
  { name: "Apr", newPatients: 60, returningPatients: 80, referrals: 35 },
  { name: "May", newPatients: 65, returningPatients: 85, referrals: 40 },
  { name: "Jun", newPatients: 70, returningPatients: 90, referrals: 45 },
];

const staffData = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    role: "Lead Dentist",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    metrics: {
      patientsSeen: 128,
      satisfaction: 98,
      efficiency: 95,
    },
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    role: "Orthodontist",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    metrics: {
      patientsSeen: 96,
      satisfaction: 96,
      efficiency: 92,
    },
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    role: "Pediatric Dentist",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    metrics: {
      patientsSeen: 112,
      satisfaction: 99,
      efficiency: 94,
    },
  },
];

const appointments = [
  {
    id: "1",
    patientName: "John Smith",
    date: "2025-01-25",
    time: "09:00 AM",
    type: "Cleaning",
    status: "scheduled" as const,
  },
  {
    id: "2",
    patientName: "Sarah Johnson",
    date: "2025-01-25",
    time: "10:30 AM",
    type: "Check-up",
    status: "completed" as const,
  },
  {
    id: "3",
    patientName: "Michael Brown",
    date: "2025-01-25",
    time: "02:00 PM",
    type: "Root Canal",
    status: "scheduled" as const,
  },
];

// Types
interface KPICardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  change: number;
  iconBgColor: string;
}

// Components
const KPICard: React.FC<KPICardProps> = ({
  icon,
  title,
  value,
  change,
  iconBgColor,
}) => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <div className={`${iconBgColor} p-3 rounded-lg`}>{icon}</div>
      <span
        className={`text-sm ${change >= 0 ? "text-green-500" : "text-red-500"}`}
      >
        {change >= 0 ? "+" : ""}
        {change}%
      </span>
    </div>
    <div className="mt-4">
      <h3 className="text-3xl font-semibold">{value}</h3>
      <p className="text-gray-500 text-sm mt-1">{title}</p>
    </div>
  </div>
);

export const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Practice Overview
          </h1>
          <p className="text-gray-600">Welcome back, Admin</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Generate Report
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            AI Insights
          </Button>
          <Button className="flex items-center gap-2">Add Staff</Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          icon={<DollarSign className="w-6 h-6 text-blue-600" />}
          title="Monthly Revenue"
          value="$145,678"
          change={8}
          iconBgColor="bg-blue-100"
        />
        <KPICard
          icon={<Users className="w-6 h-6 text-purple-600" />}
          title="Patient Growth"
          value="3,456"
          change={12}
          iconBgColor="bg-purple-100"
        />
        <KPICard
          icon={<CheckCircle className="w-6 h-6 text-amber-600" />}
          title="Treatment Acceptance"
          value="78%"
          change={5}
          iconBgColor="bg-amber-100"
        />
        <KPICard
          icon={<Calendar className="w-6 h-6 text-teal-600" />}
          title="Appointment Fill Rate"
          value="92%"
          change={3}
          iconBgColor="bg-teal-100"
        />
      </div>

      {/* Secondary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          icon={<FileText className="w-6 h-6 text-blue-600" />}
          title="Insurance Claims"
          value="245"
          change={7}
          iconBgColor="bg-blue-100"
        />
        <KPICard
          icon={<Clock className="w-6 h-6 text-purple-600" />}
          title="Average Wait Time"
          value="12min"
          change={-4}
          iconBgColor="bg-purple-100"
        />
        <KPICard
          icon={<Star className="w-6 h-6 text-amber-600" />}
          title="Patient Satisfaction"
          value="4.8"
          change={2}
          iconBgColor="bg-amber-100"
        />
        <KPICard
          icon={<TrendingUp className="w-6 h-6 text-teal-600" />}
          title="Staff Productivity"
          value="94%"
          change={6}
          iconBgColor="bg-teal-100"
        />
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Analytics */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold">Revenue Analytics</h2>
              <p className="text-sm text-gray-500">
                Financial performance overview
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Export
              </Button>
              <Button variant="outline" size="sm">
                Filter
              </Button>
            </div>
          </div>
          <RevenueChart data={revenueData} />
        </div>

        {/* Staff Performance */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold">Staff Performance</h2>
              <p className="text-sm text-gray-500">Monthly staff metrics</p>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <StaffPerformance data={staffData} />
        </div>
      </div>
    </div>
  );
};
