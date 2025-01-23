import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { formatCurrency } from '../lib/utils/currency';
import { dashboardService } from '../services/dashboard';
import { useAuthContext } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface DashboardStats {
  appointments: {
    total: number;
    upcoming: number;
    completed: number;
    cancelled: number;
  };
  patients: {
    total: number;
    active: number;
    new: number;
  };
  revenue: {
    total: number;
    pending: number;
    collected: number;
  };
  performance: {
    appointmentCompletionRate: number;
    patientSatisfactionRate: number;
    collectionRate: number;
  };
}

const Dashboard = () => {
  const { user } = useAuthContext();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkServerStatus = async () => {
    try {
      const response = await fetch('http://localhost:5173/');
      return response.ok;
    } catch (err) {
      console.error('Server is not running:', err);
      return false;
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      const serverRunning = await checkServerStatus();
      if (!serverRunning) {
        setError('Server is not reachable. Please check the server status.');
        setLoading(false);
        return;
      }
      try {
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text">
            Practice Analytics
          </h2>
          <p className="text-gray-500">Comprehensive practice performance insights</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            {React.createElement((Icons as any).FileText, {
              className: "w-4 h-4 mr-2"
            })}
            Generate Report
          </Button>
          <Button variant="outline">
            {React.createElement((Icons as any).Calendar, {
              className: "w-4 h-4 mr-2"
            })}
            Date Range
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats && [
          { label: 'Monthly Revenue', value: formatCurrency(stats.revenue.total), change: '+8%', icon: 'DollarSign' },
          { label: 'Active Patients', value: stats.patients.active, change: '+12%', icon: 'Users' },
          { label: 'Treatment Acceptance', value: '78%', change: '+5%', icon: 'CheckCircle' },
          { label: 'Patient Satisfaction', value: '4.9', change: '+0.2', icon: 'Star' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              {React.createElement((Icons as any)[stat.icon as keyof typeof Icons], {
                className: "w-5 h-5 text-primary"
              })}
              <span className="text-sm text-green-600 font-medium">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[]}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4BC5BD" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4BC5BD" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#4BC5BD" fillOpacity={1} fill="url(#revenueGradient)" />
                <Line type="monotone" dataKey="profit" stroke="#6B4C9A" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-4">Treatment Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[]}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Patient Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-4">Patient Growth</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="newPatients" stroke="#4BC5BD" strokeWidth={2} />
                <Line type="monotone" dataKey="retentionRate" stroke="#6B4C9A" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-4">Staff Performance</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#4BC5BD" />
                <YAxis yAxisId="right" orientation="right" stroke="#6B4C9A" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="patients" fill="#4BC5BD" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="efficiency" fill="#6B4C9A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-4">Insurance Claims</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Submitted</span>
              <span className="font-medium">245</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending</span>
              <span className="font-medium">32</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Approved</span>
              <span className="font-medium">198</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Denied</span>
              <span className="font-medium">15</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-4">Appointment Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Fill Rate</span>
              <span className="font-medium">92%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">No-Shows</span>
              <span className="font-medium">3.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cancellations</span>
              <span className="font-medium">4.8%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Rescheduled</span>
              <span className="font-medium">8.5%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-4">Marketing ROI</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Social Media</span>
              <span className="font-medium">385%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Email Campaigns</span>
              <span className="font-medium">425%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Referral Program</span>
              <span className="font-medium">520%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Local Advertising</span>
              <span className="font-medium">290%</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;