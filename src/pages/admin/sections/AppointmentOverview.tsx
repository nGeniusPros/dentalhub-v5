import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { AppointmentsChart } from '../../../components/dashboard/charts/AppointmentsChart';

export const AppointmentOverview = () => {
  const data = [
    { month: 'Jan', appointments: 420, completed: 395 },
    { month: 'Feb', appointments: 380, completed: 360 },
    { month: 'Mar', appointments: 450, completed: 430 },
    { month: 'Apr', appointments: 460, completed: 445 },
    { month: 'May', appointments: 440, completed: 420 },
    { month: 'Jun', appointments: 480, completed: 465 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Appointment Overview</h2>
          <p className="text-sm text-gray-500">Monthly appointment statistics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Icons.Calendar className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          <Button variant="outline" size="sm">
            <Icons.Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="h-[300px]">
        <AppointmentsChart data={data} />
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6">
        {[
          { label: 'Total Appointments', value: '480', trend: '+5%', icon: 'Calendar' },
          { label: 'Completed', value: '465', trend: '+4%', icon: 'CheckCircle' },
          { label: 'Cancellations', value: '15', trend: '-2%', icon: 'XCircle' },
          { label: 'Fill Rate', value: '97%', trend: '+1%', icon: 'BarChart' }
        ].map((metric, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {React.createElement(Icons[metric.icon as keyof typeof Icons], {
                className: "w-4 h-4 text-primary"
              })}
              <span className="text-sm text-gray-500">{metric.label}</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">{metric.value}</p>
            <span className={`text-sm ${
              metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
            } flex items-center gap-1`}>
              {metric.trend.startsWith('+') ? (
                <Icons.TrendingUp className="w-4 h-4" />
              ) : (
                <Icons.TrendingDown className="w-4 h-4" />
              )}
              {metric.trend}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};