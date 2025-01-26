import React from "react";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  metrics: {
    patients: number;
    satisfaction: number;
    revenue: string;
  };
}

interface StaffPerformanceProps {
  data?: StaffMember[];
}

export const StaffPerformance: React.FC<StaffPerformanceProps> = ({
  data = [],
}) => {
  return (
    <div className="space-y-4">
      {data.map((staff) => (
        <div
          key={staff.id}
          className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900">{staff.name}</span>
              <span className="text-sm text-gray-500">{staff.role}</span>
            </div>
          </div>
          <div className="flex items-center gap-12">
            <div className="text-right">
              <span className="block text-sm text-gray-500">Patients</span>
              <span className="font-semibold">{staff.metrics.patients}</span>
            </div>
            <div className="text-right">
              <span className="block text-sm text-gray-500">Satisfaction</span>
              <span className="font-semibold">
                {staff.metrics.satisfaction}%
              </span>
            </div>
            <div className="text-right">
              <span className="block text-sm text-gray-500">Revenue</span>
              <span className="font-semibold">{staff.metrics.revenue}</span>
            </div>
          </div>
        </div>
      ))}
      {data.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          No staff performance data available
        </div>
      )}
    </div>
  );
};
