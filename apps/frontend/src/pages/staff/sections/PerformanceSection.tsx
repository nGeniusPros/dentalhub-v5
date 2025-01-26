import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Card } from '../../../components/ui/card';
import { useStaffPerformance } from '../../../hooks/useStaffPerformance';

export const PerformanceSection = () => {
  const {
    performanceData,
    patientSatisfaction,
    appointmentMetrics,
    treatmentEfficiency,
    isLoading,
    error,
    dateRange,
    setDateRange
  } = useStaffPerformance();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icons.Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error loading performance data</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Performance Analytics</h2>
        <div className="flex gap-2">
          <Button
            variant={dateRange === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateRange('week')}
          >
            Week
          </Button>
          <Button
            variant={dateRange === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateRange('month')}
          >
            Month
          </Button>
          <Button
            variant={dateRange === 'quarter' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateRange('quarter')}
          >
            Quarter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="satisfaction">Patient Satisfaction</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="treatments">Treatment Efficiency</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icons.TrendingUp className="w-5 h-5 text-green-500" />
                <h3 className="font-medium">Performance Score</h3>
              </div>
              <p className="text-2xl font-bold">{performanceData.score}</p>
              <p className="text-sm text-gray-500">
                {performanceData.trend > 0 ? '+' : ''}{performanceData.trend}% vs last period
              </p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icons.Users className="w-5 h-5 text-blue-500" />
                <h3 className="font-medium">Patients Treated</h3>
              </div>
              <p className="text-2xl font-bold">{performanceData.patientsTreated}</p>
              <p className="text-sm text-gray-500">Total this period</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icons.Clock className="w-5 h-5 text-purple-500" />
                <h3 className="font-medium">Avg Treatment Time</h3>
              </div>
              <p className="text-2xl font-bold">{performanceData.avgTreatmentTime}m</p>
              <p className="text-sm text-gray-500">Per patient</p>
            </Card>
          </div>

          <Card className="p-4">
            <h3 className="font-medium mb-4">Performance Trend</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData.trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#6366f1" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="satisfaction" className="space-y-4">
          <Card className="p-4">
            <h3 className="font-medium mb-4">Patient Satisfaction Ratings</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patientSatisfaction}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="rating" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="font-medium mb-2">On-Time Rate</h3>
              <p className="text-2xl font-bold">{appointmentMetrics.onTimeRate}%</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-medium mb-2">Completion Rate</h3>
              <p className="text-2xl font-bold">{appointmentMetrics.completionRate}%</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-medium mb-2">Rescheduling Rate</h3>
              <p className="text-2xl font-bold">{appointmentMetrics.reschedulingRate}%</p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="treatments" className="space-y-4">
          <Card className="p-4">
            <h3 className="font-medium mb-4">Treatment Success Rate by Type</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={treatmentEfficiency}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="successRate" fill="#6366f1" name="Success Rate" />
                  <Bar dataKey="efficiency" fill="#22c55e" name="Efficiency" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};
