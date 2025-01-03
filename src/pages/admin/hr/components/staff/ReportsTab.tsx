import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { cn } from '../../../../../lib/utils';
import { AddReportModal } from '../reports/AddReportModal';
import { ReportsFilter } from '../reports/ReportsFilter';
import { useNotifications } from '../../../../../contexts/NotificationContext';

export const ReportsTab = () => {
  const [showAddReport, setShowAddReport] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    type: [] as string[],
    frequency: [] as string[],
    status: [] as string[],
    dateRange: 'all',
    department: [] as string[],
    customDateRange: {
      start: '',
      end: ''
    }
  });
  const { dispatch: notifyDispatch } = useNotifications();
  
  const reports = [
    {
      id: '1',
      name: 'Staff Performance Report',
      description: 'Monthly performance metrics and KPIs',
      type: 'performance',
      frequency: 'Monthly',
      lastGenerated: '2024-03-01',
      nextGeneration: '2024-04-01'
    },
    {
      id: '2',
      name: 'Training Compliance Report',
      description: 'Staff training and certification status',
      type: 'compliance',
      frequency: 'Weekly',
      lastGenerated: '2024-03-08',
      nextGeneration: '2024-03-15'
    },
    {
      id: '3',
      name: 'Attendance Report',
      description: 'Staff attendance and time-off tracking',
      type: 'attendance',
      frequency: 'Daily',
      lastGenerated: '2024-03-14',
      nextGeneration: '2024-03-15'
    }
  ];

  const handleAddReport = (report: any) => {
    console.log('New report:', report);
    
    notifyDispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        type: 'message',
        title: 'Report Created',
        message: `${report.name} has been scheduled successfully`,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'medium'
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Reports & Analytics</h2>
          <p className="text-sm text-gray-500">Generate and manage staff reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Icons.Filter className="w-4 h-4 mr-2" />
            <span onClick={() => setShowFilter(true)}>Filter</span>
          </Button>
          <Button onClick={() => setShowAddReport(true)}>
            <Icons.Plus className="w-4 h-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reports
          .filter(report => {
            // Apply filters
            const matchesType = activeFilters.type.length === 0 || 
              activeFilters.type.includes(report.type);
            const matchesFrequency = activeFilters.frequency.length === 0 || 
              activeFilters.frequency.includes(report.frequency);
            const matchesStatus = activeFilters.status.length === 0 || 
              activeFilters.status.includes(report.status);
            const matchesDepartment = activeFilters.department.length === 0 || 
              activeFilters.department.some(dept => report.departments?.includes(dept));

            // Date range filtering
            let matchesDateRange = true;
            if (activeFilters.dateRange !== 'all') {
              const reportDate = new Date(report.lastGenerated);
              const now = new Date();

              switch (activeFilters.dateRange) {
                case 'today':
                  matchesDateRange = reportDate.toDateString() === now.toDateString();
                  break;
                case 'week':
                  const weekAgo = new Date(now.setDate(now.getDate() - 7));
                  matchesDateRange = reportDate >= weekAgo;
                  break;
                case 'month':
                  const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
                  matchesDateRange = reportDate >= monthAgo;
                  break;
                case 'custom':
                  if (activeFilters.customDateRange.start && activeFilters.customDateRange.end) {
                    const start = new Date(activeFilters.customDateRange.start);
                    const end = new Date(activeFilters.customDateRange.end);
                    matchesDateRange = reportDate >= start && reportDate <= end;
                  }
                  break;
              }
            }

            return matchesType && matchesFrequency && matchesStatus && 
                   matchesDepartment && matchesDateRange;
          })
          .map((report) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  report.type === 'performance' && "bg-blue-100 text-blue-600",
                  report.type === 'compliance' && "bg-green-100 text-green-600",
                  report.type === 'attendance' && "bg-purple-100 text-purple-600"
                )}>
                  <Icons.FileBarChart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{report.name}</h3>
                  <p className="text-sm text-gray-500">{report.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{report.frequency}</p>
                  <p className="text-xs text-gray-500">
                    Next: {report.nextGeneration}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Icons.Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Icons.RefreshCw className="w-4 h-4 mr-2" />
                    Generate
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Icons.MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AddReportModal
        isOpen={showAddReport}
        onClose={() => setShowAddReport(false)}
        onAdd={handleAddReport}
      />

      <ReportsFilter
        isOpen={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={(filters) => {
          setActiveFilters(filters);
          notifyDispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
              id: Date.now().toString(),
              type: 'message',
              title: 'Filters Applied',
              message: 'Report filters have been updated',
              timestamp: new Date().toISOString(),
              read: false,
              priority: 'low'
            }
          });
        }}
        currentFilters={activeFilters}
      />
    </div>
  );
};