import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

const PendingTreatment = () => {
  const treatments = [
    {
      id: 1,
      type: 'Root Canal',
      tooth: '16',
      priority: 'High',
      estimatedCost: 1200.00,
      insuranceCoverage: 800.00,
      recommendedDate: '2024-04-15',
      status: 'Pending Approval'
    },
    {
      id: 2,
      type: 'Crown',
      tooth: '17',
      priority: 'Medium',
      estimatedCost: 950.00,
      insuranceCoverage: 600.00,
      recommendedDate: '2024-05-01',
      status: 'Scheduled'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Pending Treatments</h1>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          Schedule Treatment
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {treatments.map((treatment) => (
          <motion.div
            key={treatment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-50 rounded-lg">
                  <Icons.Stethoscope className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{treatment.type}</h3>
                  <p className="text-gray-500">Tooth #{treatment.tooth}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                treatment.priority === 'High' 
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {treatment.priority} Priority
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Estimated Cost</p>
                <p className="font-medium">${treatment.estimatedCost.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Insurance Coverage</p>
                <p className="font-medium">${treatment.insuranceCoverage.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Your Cost</p>
                <p className="font-medium">
                  ${(treatment.estimatedCost - treatment.insuranceCoverage).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Recommended Date</p>
                <p className="font-medium">{treatment.recommendedDate}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {treatment.status}
              </span>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-sm text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50">
                  View Details
                </button>
                <button className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  Schedule Now
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PendingTreatment;