import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { DateRangePicker } from './filters/DateRangePicker';
import { FilterDialog } from './filters/FilterDialog';
import { DetailsDialog } from './filters/DetailsDialog';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const VoiceAnalytics = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: string | null; end: string | null }>({ start: null, end: null });
  const [filters, setFilters] = useState<Record<string, any>>({});

  const handleExport = (chartName: string, data: any[]) => {
    if (!data || data.length === 0) {
      console.warn('No data available to export');
      return;
    }

    const csvContent = [
      // Add headers
      Object.keys(data[0]).join(','),
      // Add data rows
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chartName}-${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Sample data - would come from API in production
  const callTrendData = [
    { date: 'Mon', completed: 45, failed: 5, answered: 35 },
    { date: 'Tue', completed: 52, failed: 3, answered: 42 },
    { date: 'Wed', completed: 48, failed: 7, answered: 38 },
    { date: 'Thu', completed: 61, failed: 4, answered: 51 },
    { date: 'Fri', completed: 55, failed: 6, answered: 45 },
    { date: 'Sat', completed: 38, failed: 2, answered: 32 },
    { date: 'Sun', completed: 42, failed: 4, answered: 35 }
  ];

  const callOutcomeData = [
    { name: 'Appointment Scheduled', value: 35, color: '#4BC5BD' },
    { name: 'Call Back Later', value: 25, color: '#6B4C9A' },
    { name: 'Not Interested', value: 15, color: '#C5A572' },
    { name: 'Voicemail', value: 25, color: '#1B2B5B' }
  ];

  const timeOfDayData = [
    { time: '8am', calls: 25 },
    { time: '10am', calls: 45 },
    { time: '12pm', calls: 35 },
    { time: '2pm', calls: 50 },
    { time: '4pm', calls: 40 },
    { time: '6pm', calls: 30 }
  ];

  const campaignPerformanceData = [
    { name: 'Recall', success: 85, response: 65 },
    { name: 'Reactivation', success: 75, response: 55 },
    { name: 'Appointment', success: 90, response: 70 },
    { name: 'Treatment', success: 80, response: 60 },
    { name: 'Event', success: 70, response: 50 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Call Volume Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Call Volume Trends</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              if (callTrendData && callTrendData.length > 0) {
                handleExport('call-volume', callTrendData);
              } else {
                alert('No call volume data available to export');
              }
            }}
          >
            <Icons.Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={callTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="completed" stackId="1" stroke="#4BC5BD" fill="#4BC5BD" />
              <Area type="monotone" dataKey="failed" stackId="1" stroke="#C5A572" fill="#C5A572" />
              <Area type="monotone" dataKey="answered" stackId="1" stroke="#6B4C9A" fill="#6B4C9A" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Call Outcomes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Call Outcomes</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilter(true)}
          >
            <Icons.Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={callOutcomeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {callOutcomeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Best Time to Call */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Best Time to Call</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDatePicker(true)}
          >
            <Icons.Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeOfDayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="calls" fill="#1B2B5B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Campaign Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Campaign Performance</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDetails(true)}
          >
            <Icons.BarChart2 className="w-4 h-4 mr-2" />
            Details
          </Button>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={campaignPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="success" stroke="#4BC5BD" strokeWidth={2} />
              <Line type="monotone" dataKey="response" stroke="#6B4C9A" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Dialogs */}
      <DateRangePicker
        open={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelect={setDateRange}
      />
      
      <FilterDialog
        open={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={setFilters}
      />
      
      <DetailsDialog
        open={showDetails}
        onClose={() => setShowDetails(false)}
        data={campaignPerformanceData}
      />
    </div>
  );
};