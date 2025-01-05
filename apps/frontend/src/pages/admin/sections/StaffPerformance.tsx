import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { dashboardService } from '../../../services/dashboard';

export const StaffPerformance = () => {
  const [staffMetrics, setStaffMetrics] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaffMetrics = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await dashboardService.getStaffMetrics();
        setStaffMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch staff metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchStaffMetrics();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
        {staffMetrics?.map((staff, index) => (
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
                <p className="font-medium text-gray-900">{staff.metrics.appointmentsCompleted}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Satisfaction</p>
                <p className="font-medium text-gray-900">{staff.metrics.patientSatisfaction}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="font-medium text-gray-900">${staff.metrics.revenue?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};