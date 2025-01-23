import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';

export const StaffPerformance = () => {
  const staffMetrics = [
    {
      name: 'Dr. Emily Parker',
      role: 'Lead Dentist',
      metrics: {
        patients: 45,
        satisfaction: 98,
        revenue: 52000
      }
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Dentist',
      metrics: {
        patients: 38,
        satisfaction: 96,
        revenue: 45000
      }
    },
    {
      name: 'Sarah Johnson',
      role: 'Hygienist',
      metrics: {
        patients: 42,
        satisfaction: 97,
        revenue: 28000
      }
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Staff Performance</h2>
          <p className="text-sm text-gray-500">Monthly staff metrics</p>
        </div>
        <Button variant="outline" size="sm">
          <Icons.Users className="w-4 h-4 mr-2" />
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {staffMetrics.map((staff, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icons.User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{staff.name}</p>
                  <p className="text-sm text-gray-500">{staff.role}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Patients</p>
                <p className="font-medium text-gray-900">{staff.metrics.patients}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Satisfaction</p>
                <p className="font-medium text-gray-900">{staff.metrics.satisfaction}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="font-medium text-gray-900">${staff.metrics.revenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};