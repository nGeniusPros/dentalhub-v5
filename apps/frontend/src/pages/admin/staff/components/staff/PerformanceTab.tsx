import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { cn } from '../../../../../lib/utils';

export const PerformanceTab = () => {
  const performanceData = [
    {
      name: 'Dr. Sarah Wilson',
      role: 'Lead Dentist',
      metrics: {
        patientSatisfaction: 95,
        productivity: 88,
        attendance: 98,
        qualityScore: 92
      },
      recentAchievements: [
        'Completed Advanced Implant Training',
        'Perfect Patient Satisfaction Score'
      ]
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Dentist',
      metrics: {
        patientSatisfaction: 92,
        productivity: 85,
        attendance: 95,
        qualityScore: 90
      },
      recentAchievements: [
        'Highest Treatment Acceptance Rate',
        'Excellence in Patient Care Award'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Staff Performance</h2>
          <p className="text-sm text-gray-500">Performance metrics and achievements</p>
        </div>
        <Button variant="outline">
          <Icons.Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="space-y-6">
        {performanceData.map((staff, index) => (
          <div
            key={index}
            className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icons.User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{staff.name}</h3>
                  <p className="text-sm text-gray-500">{staff.role}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Patient Satisfaction</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">{staff.metrics.patientSatisfaction}%</span>
                  <Icons.TrendingUp className="w-4 h-4 text-green-500" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Productivity</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">{staff.metrics.productivity}%</span>
                  <Icons.TrendingUp className="w-4 h-4 text-green-500" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Attendance</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">{staff.metrics.attendance}%</span>
                  <Icons.TrendingUp className="w-4 h-4 text-green-500" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Quality Score</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">{staff.metrics.qualityScore}%</span>
                  <Icons.TrendingUp className="w-4 h-4 text-green-500" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Achievements</h4>
              <div className="space-y-2">
                {staff.recentAchievements.map((achievement, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Icons.Award className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};