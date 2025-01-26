import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";

export const SMSAnalytics = () => {
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const handleExport = (data: any[], filename: string) => {
    const csvContent = [
      Object.keys(data[0]).join(","),
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}-${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Sample data
  const deliveryData = [
    { time: "00:00", delivered: 85, failed: 15 },
    { time: "04:00", delivered: 88, failed: 12 },
    { time: "08:00", delivered: 92, failed: 8 },
    { time: "12:00", delivered: 95, failed: 5 },
    { time: "16:00", delivered: 90, failed: 10 },
    { time: "20:00", delivered: 87, failed: 13 },
  ];

  const responseData = [
    { name: "Confirmed", value: 45, fill: "#4BC5BD" },
    { name: "Rescheduled", value: 25, fill: "#6B4C9A" },
    { name: "Cancelled", value: 15, fill: "#C5A572" },
    { name: "No Response", value: 15, fill: "#1B2B5B" },
  ];

  const engagementData = [
    { name: "Link Clicks", value: 65, fill: "#4BC5BD" },
    { name: "Replies", value: 45, fill: "#6B4C9A" },
    { name: "Opt-outs", value: 15, fill: "#C5A572" },
  ];

  const timeData = [
    { name: "8AM", value: 45 },
    { name: "10AM", value: 75 },
    { name: "12PM", value: 65 },
    { name: "2PM", value: 85 },
    { name: "4PM", value: 55 },
    { name: "6PM", value: 45 },
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => setShowDatePicker(true)}>
          <Icons.Calendar className="w-4 h-4 mr-2" />
          Date Range
        </Button>
        <Button variant="outline" onClick={() => setShowFilterDialog(true)}>
          <Icons.Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const allData = [...deliveryData, ...responseData, ...timeData];
            handleExport(allData, "sms-analytics");
          }}
        >
          <Icons.Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold mb-6">Delivery Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deliveryData} stackOffset="expand">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(203, 213, 225, 0.3)"
                />
                <XAxis dataKey="time" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="delivered"
                  stackId="a"
                  fill="#4BC5BD"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="failed"
                  stackId="a"
                  fill="#C5A572"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Response Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold mb-6">Response Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="30%"
                outerRadius="100%"
                data={responseData}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar
                  minAngle={15}
                  background
                  clockWise={true}
                  dataKey="value"
                  cornerRadius={10}
                />
                <Legend
                  iconSize={10}
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Engagement Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold mb-6">Engagement Metrics</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={engagementData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {engagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Best Time to Send */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold mb-6">Best Time to Send</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(203, 213, 225, 0.3)"
                />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#6B4C9A"
                  strokeWidth={2}
                  dot={{ fill: "#6B4C9A", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 8, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
