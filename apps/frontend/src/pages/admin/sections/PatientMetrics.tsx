import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { dashboardService } from "../../../services/dashboard";
import { Button } from "../../../components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PatientData {
  patientGrowth: {
    months: string[];
    values: number[];
  };
  demographics: {
    ageGroup: string;
    percentage: number;
  }[];
}

export const PatientMetrics = () => {
  const [data, setData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await dashboardService.getPatientMetrics();
        setData(response);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch patient data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) return null;

  const growthData = data.patientGrowth.months.map((month, index) => ({
    month,
    patients: data.patientGrowth.values[index],
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Patient Analytics
          </h2>
          <p className="text-sm text-gray-500">
            Patient growth and satisfaction metrics
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Icons.Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="space-y-6">
        <div className="h-[300px]">
          <h3 className="text-sm font-medium mb-4">Patient Growth</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="month"
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis stroke="#6B7280" fontSize={12} tickLine={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="patients"
                stroke="#40E0D0"
                strokeWidth={2}
                dot={false}
                name="New Patients"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-4">Patient Demographics</h3>
          <div className="space-y-2">
            {data.demographics.map((group, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{group.ageGroup}</span>
                <div className="flex items-center gap-2 flex-1 mx-4">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 rounded-full"
                      style={{ width: `${group.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12">
                    {group.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
