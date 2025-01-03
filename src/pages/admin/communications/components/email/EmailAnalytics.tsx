import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const EmailAnalytics = () => {
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [filters, setFilters] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Sample data - would come from API in production
  const emailData = [
    { date: 'Mon', sent: 1200, opened: 850, clicked: 320 },
    { date: 'Tue', sent: 980, opened: 720, clicked: 280 },
    { date: 'Wed', sent: 1100, opened: 800, clicked: 350 },
    { date: 'Thu', sent: 1300, opened: 950, clicked: 420 },
    { date: 'Fri', sent: 1150, opened: 820, clicked: 380 },
    { date: 'Sat', sent: 800, opened: 580, clicked: 220 },
    { date: 'Sun', sent: 750, opened: 520, clicked: 180 }
  ];

  const handleExport = (data: any[], filename: string) => {
    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleRefreshAnalysis = async () => {
    // In production, this would fetch fresh data from the API
    console.log('Refreshing analysis...');
  };

  const handleDateRangeChange = (range: { start: Date | null; end: Date | null }) => {
    setDateRange(range);
    // Filter data based on date range
  };

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    // Apply filters to data
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text">
          Email Analytics Dashboard
        </h2>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => setShowDatePicker(true)}
          >
            <Icons.Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
          <Button 
            variant="outline"
            onClick={() => setShowFilterDialog(true)}
          >
            <Icons.Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleExport(emailData, 'email-analytics')}
          >
            <Icons.Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button 
            onClick={handleRefreshAnalysis}
            className="bg-gradient-to-r from-navy to-purple text-white"
          >
            <Icons.RefreshCw className="w-4 h-4 mr-2" />
            Refresh Analysis
          </Button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main Chart - Spans 8 columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-12 lg:col-span-8 bg-gradient-to-br from-navy/5 via-white to-turquoise/5 rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={emailData}>
                <defs>
                  <linearGradient id="sentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B2B5B" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1B2B5B" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="openedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4BC5BD" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4BC5BD" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '8px',
                    border: '1px solid rgba(203, 213, 225, 0.5)',
                    backdropFilter: 'blur(8px)'
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="sent" 
                  stroke="#1B2B5B" 
                  fillOpacity={1}
                  fill="url(#sentGradient)"
                />
                <Area 
                  type="monotone" 
                  dataKey="opened" 
                  stroke="#4BC5BD" 
                  fillOpacity={1}
                  fill="url(#openedGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Engagement Metrics - Spans 4 columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-12 lg:col-span-4 bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Engagement Overview</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowDetailsDialog(true)}
            >
              <Icons.BarChart2 className="w-4 h-4 mr-2" />
              Details
            </Button>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Open Rate', value: '68%', trend: '+5%', icon: 'Eye' },
              { label: 'Click Rate', value: '42%', trend: '+3%', icon: 'MousePointer' },
              { label: 'Bounce Rate', value: '2.1%', trend: '-0.5%', icon: 'XCircle' },
              { label: 'Unsubscribe Rate', value: '0.8%', trend: '-0.2%', icon: 'UserMinus' }
            ].map((metric, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {React.createElement(Icons[metric.icon as keyof typeof Icons], {
                      className: "w-5 h-5 text-primary"
                    })}
                    <div>
                      <p className="text-sm text-gray-500">{metric.label}</p>
                      <p className="text-lg font-semibold">{metric.value}</p>
                    </div>
                  </div>
                  <span className={`text-sm ${
                    metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Dialogs */}
      {showDatePicker && (
        <DateRangePicker
          onClose={() => setShowDatePicker(false)}
          onSelect={handleDateRangeChange}
        />
      )}

      {showFilterDialog && (
        <FilterDialog
          onClose={() => setShowFilterDialog(false)}
          onApply={handleFilterChange}
        />
      )}

      {showDetailsDialog && (
        <DetailsDialog
          onClose={() => setShowDetailsDialog(false)}
          data={emailData}
        />
      )}
    </div>
  );
};

// Helper Components
const DateRangePicker = ({ onClose, onSelect }: any) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Select Date Range</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icons.X className="w-5 h-5" />
          </Button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => {
              onSelect({ start: startDate ? new Date(startDate) : null, end: endDate ? new Date(endDate) : null });
              onClose();
            }}>Apply</Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const FilterDialog = ({ onClose, onApply }: any) => {
  const [filters, setFilters] = useState({
    status: [] as string[],
    type: [] as string[],
    tags: [] as string[]
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Filter Results</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icons.X className="w-5 h-5" />
          </Button>
        </div>
        <div className="space-y-4">
          {/* Filter options */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <div className="space-y-2">
              {['Sent', 'Opened', 'Clicked', 'Bounced'].map((status) => (
                <label key={status} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.status.includes(status)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters(prev => ({
                          ...prev,
                          status: [...prev.status, status]
                        }));
                      } else {
                        setFilters(prev => ({
                          ...prev,
                          status: prev.status.filter(s => s !== status)
                        }));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm">{status}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => {
              onApply(filters);
              onClose();
            }}>Apply Filters</Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const DetailsDialog = ({ onClose, data }: any) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Detailed Analytics</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icons.X className="w-5 h-5" />
          </Button>
        </div>
        <div className="space-y-4">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Sent</th>
                <th className="px-4 py-2 text-left">Opened</th>
                <th className="px-4 py-2 text-left">Clicked</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row: any, index: number) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{row.date}</td>
                  <td className="px-4 py-2">{row.sent}</td>
                  <td className="px-4 py-2">{row.opened}</td>
                  <td className="px-4 py-2">{row.clicked}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end">
            <Button onClick={() => handleExport(data, 'detailed-analytics')}>
              <Icons.Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};