import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { cn } from '../../../lib/utils';
import { formatCurrency } from '../../../lib/utils/currency';
import { GenerateReportDialog } from '../../../components/reports/GenerateReportDialog';

const InsuranceARDashboard = () => {
  const [showReport, setShowReport] = useState(false);

  // A/R Aging Data
  const agingData = [
    { range: 'Current', amount: 45000 },
    { range: '1-30 Days', amount: 35000 },
    { range: '31-60 Days', amount: 25000 },
    { range: '61-90 Days', amount: 15000 },
    { range: '90+ Days', amount: 10000 }
  ];

  // Claims Status Data
  const claimsData = [
    { status: 'Paid', value: 65, color: '#4BC5BD' },
    { status: 'Pending', value: 20, color: '#6B4C9A' },
    { status: 'Denied', value: 10, color: '#EF4444' },
    { status: 'In Process', value: 5, color: '#6366F1' }
  ];

  // Monthly Claims Trend
  const claimsTrend = [
    { month: 'Jan', submitted: 450, paid: 380, denied: 45 },
    { month: 'Feb', submitted: 420, paid: 360, denied: 35 },
    { month: 'Mar', submitted: 480, paid: 410, denied: 42 },
    { month: 'Apr', submitted: 520, paid: 445, denied: 38 },
    { month: 'May', submitted: 490, paid: 420, denied: 41 },
    { month: 'Jun', submitted: 510, paid: 440, denied: 36 }
  ];

  // Insurance Verification Data
  const verificationData = [
    { month: 'Jan', verified: 92, failed: 8 },
    { month: 'Feb', verified: 94, failed: 6 },
    { month: 'Mar', verified: 91, failed: 9 },
    { month: 'Apr', verified: 95, failed: 5 },
    { month: 'May', verified: 93, failed: 7 },
    { month: 'Jun', verified: 96, failed: 4 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text">
            Insurance & A/R Analytics
          </h2>
          <p className="text-gray-500">Comprehensive insurance and accounts receivable insights</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => setShowReport(true)}
          >
            <Icons.FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline">
            <Icons.Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total A/R', value: formatCurrency(130000), change: '-8%', icon: 'DollarSign', trend: 'down' },
          { label: 'Claims Pending', value: '245', change: '+12%', icon: 'FileText', trend: 'up' },
          { label: 'Avg Days in A/R', value: '32', change: '-5%', icon: 'Clock', trend: 'down' },
          { label: 'Collection Rate', value: '94%', change: '+2%', icon: 'TrendingUp', trend: 'up' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              {React.createElement(Icons[stat.icon as keyof typeof Icons], {
                className: "w-5 h-5 text-primary"
              })}
              <span className={cn(
                "text-sm font-medium",
                stat.trend === 'up' ? "text-green-600" : "text-red-600"
              )}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* A/R Aging and Claims Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-4">A/R Aging</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="amount" fill="#4BC5BD" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-4">Claims Status Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={claimsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {claimsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Claims Trend and Insurance Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-4">Claims Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={claimsTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="submitted" stroke="#4BC5BD" strokeWidth={2} />
                <Line type="monotone" dataKey="paid" stroke="#6B4C9A" strokeWidth={2} />
                <Line type="monotone" dataKey="denied" stroke="#EF4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-4">Insurance Verification Success Rate</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={verificationData}>
                <defs>
                  <linearGradient id="verifiedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4BC5BD" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4BC5BD" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="verified" stroke="#4BC5BD" fill="url(#verifiedGradient)" />
                <Area type="monotone" dataKey="failed" stroke="#EF4444" fill="#FEE2E2" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Insurance Carriers Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
      >
        <h3 className="text-lg font-semibold mb-4">Insurance Carriers Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carrier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claims Volume</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Processing Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approval Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reimbursement Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { carrier: 'Blue Cross', volume: 156, processingTime: '12 days', approvalRate: '94%', reimbursementRate: '85%' },
                { carrier: 'Delta Dental', volume: 142, processingTime: '15 days', approvalRate: '92%', reimbursementRate: '82%' },
                { carrier: 'Cigna', volume: 98, processingTime: '14 days', approvalRate: '91%', reimbursementRate: '83%' },
                { carrier: 'Aetna', volume: 87, processingTime: '13 days', approvalRate: '93%', reimbursementRate: '84%' }
              ].map((carrier, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {carrier.carrier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {carrier.volume}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {carrier.processingTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {carrier.approvalRate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {carrier.reimbursementRate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Report Generation Dialog */}
      <GenerateReportDialog
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        data={{
          agingData,
          claimsData,
          claimsTrend,
          verificationData
        }}
      />
    </div>
  );
};

export default InsuranceARDashboard;