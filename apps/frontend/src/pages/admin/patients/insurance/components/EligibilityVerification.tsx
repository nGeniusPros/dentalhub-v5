import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { fetchEligibility } from '../../../../lib/api/dentalxchange';

export const EligibilityVerification = () => {
  const [patientId, setPatientId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const eligibility = await fetchEligibility(patientId);
      // Handle eligibility response
    } catch (error) {
      console.error('Error verifying eligibility:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Eligibility Verification</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Patient ID
          </label>
          <input
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="Enter patient ID"
          />
        </div>

        <Button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-white"
        >
          {loading ? (
            <Icons.Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Icons.Search className="w-4 h-4 mr-2" />
          )}
          Verify Eligibility
        </Button>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Recent Verifications</h3>
          <div className="space-y-2">
            {[
              { patient: 'John Smith', date: '2024-03-10', status: 'Active' },
              { patient: 'Sarah Johnson', date: '2024-03-09', status: 'Active' }
            ].map((verification, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{verification.patient}</p>
                    <p className="text-xs text-gray-500">{verification.date}</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    {verification.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};