import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { dashboardService } from "../../../services/dashboard";
import { Skeleton } from "../../../components/ui/skeleton";

interface DashboardStats {
  monthlyRevenue: {
    value: number;
    change: number;
  };
  patientGrowth: {
    value: number;
    change: number;
  };
  treatmentAcceptance: {
    value: number;
    change: number;
  };
  appointmentFillRate: {
    value: number;
    change: number;
  };
  insuranceClaims: {
    value: number;
    change: number;
  };
  averageWaitTime: {
    value: number;
    change: number;
  };
  patientSatisfaction: {
    value: number;
    change: number;
  };
  staffProductivity: {
    value: number;
    change: number;
  };
}

const StatCard = ({
  icon,
  value,
  label,
  change,
  iconBgColor,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  change?: number;
  iconBgColor: string;
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm">
    <div className="flex items-start justify-between">
      <div className={`p-2 rounded-lg ${iconBgColor}`}>{icon}</div>
      {change !== undefined && (
        <span
          className={`text-sm font-medium ${change >= 0 ? "text-green-500" : "text-red-500"}`}
        >
          {change >= 0 ? "+" : ""}
          {change}%
        </span>
      )}
    </div>
    <div className="mt-4">
      <h3 className="text-2xl font-semibold">{value}</h3>
      <p className="text-gray-500 text-sm mt-1">{label}</p>
    </div>
  </div>
);

export const KPIOverview = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again later.");
        console.error("Dashboard stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="col-span-1">
            <Skeleton className="h-32 rounded-lg" />
          </div>
        ))}
      </>
    );
  }

  if (error) {
    return (
      <div className="col-span-4 p-4 text-red-500 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const statCards = [
    {
      icon: <Icons.DollarSign className="w-6 h-6 text-blue-600" />,
      value: formatCurrency(stats.monthlyRevenue.value),
      label: "Monthly Revenue",
      change: stats.monthlyRevenue.change,
      iconBgColor: "bg-blue-50",
    },
    {
      icon: <Icons.Users className="w-6 h-6 text-purple-600" />,
      value: stats.patientGrowth.value.toLocaleString(),
      label: "Patient Growth",
      change: stats.patientGrowth.change,
      iconBgColor: "bg-purple-50",
    },
    {
      icon: <Icons.CheckCircle className="w-6 h-6 text-green-600" />,
      value: `${stats.treatmentAcceptance.value}%`,
      label: "Treatment Acceptance",
      change: stats.treatmentAcceptance.change,
      iconBgColor: "bg-green-50",
    },
    {
      icon: <Icons.Calendar className="w-6 h-6 text-cyan-600" />,
      value: `${stats.appointmentFillRate.value}%`,
      label: "Appointment Fill Rate",
      change: stats.appointmentFillRate.change,
      iconBgColor: "bg-cyan-50",
    },
    {
      icon: <Icons.FileText className="w-6 h-6 text-indigo-600" />,
      value: stats.insuranceClaims.value.toString(),
      label: "Insurance Claims",
      change: stats.insuranceClaims.change,
      iconBgColor: "bg-indigo-50",
    },
    {
      icon: <Icons.Clock className="w-6 h-6 text-red-600" />,
      value: `${stats.averageWaitTime.value}min`,
      label: "Average Wait Time",
      change: stats.averageWaitTime.change,
      iconBgColor: "bg-red-50",
    },
    {
      icon: <Icons.Star className="w-6 h-6 text-yellow-600" />,
      value: stats.patientSatisfaction.value.toFixed(1),
      label: "Patient Satisfaction",
      change: stats.patientSatisfaction.change,
      iconBgColor: "bg-yellow-50",
    },
    {
      icon: <Icons.TrendingUp className="w-6 h-6 text-emerald-600" />,
      value: `${stats.staffProductivity.value}%`,
      label: "Staff Productivity",
      change: stats.staffProductivity.change,
      iconBgColor: "bg-emerald-50",
    },
  ];

  return (
    <>
      {statCards.map((card, index) => (
        <div key={index} className="col-span-1">
          <StatCard {...card} />
        </div>
      ))}
    </>
  );
};
