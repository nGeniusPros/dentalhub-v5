import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

const Settings = () => {
  const patientInfo = {
    personal: {
      name: "Sarah Johnson",
      dob: "1985-04-15",
      email: "sarah.johnson@email.com",
      phone: "(555) 123-4567",
      address: "123 Main St, Anytown, ST 12345"
    },
    insurance: {
      provider: "Blue Cross Blue Shield",
      policyNumber: "BC123456789",
      groupNumber: "GRP987654321",
      primary: true
    },
    emergency: {
      name: "John Smith",
      relationship: "Spouse",
      phone: "(555) 987-6543"
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ngenius-black">Account Settings</h1>
          <p className="text-ngenius-gray-500 mt-1">Manage your profile and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-ngenius-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold bg-gradient-navy text-transparent bg-clip-text">
              Personal Information
            </h2>
            <button className="px-4 py-2 text-sm font-medium text-ngenius-primary bg-white border border-ngenius-primary rounded-lg hover:bg-ngenius-gray-50">
              Edit
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ngenius-gray-500">Full Name</label>
                <p className="mt-1 text-ngenius-gray-900">{patientInfo.personal.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-ngenius-gray-500">Date of Birth</label>
                <p className="mt-1 text-ngenius-gray-900">{patientInfo.personal.dob}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-ngenius-gray-500">Email</label>
                <p className="mt-1 text-ngenius-gray-900">{patientInfo.personal.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ngenius-gray-500">Phone</label>
                <p className="mt-1 text-ngenius-gray-900">{patientInfo.personal.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-ngenius-gray-500">Address</label>
                <p className="mt-1 text-ngenius-gray-900">{patientInfo.personal.address}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Insurance Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-ngenius-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold bg-gradient-navy text-transparent bg-clip-text">
              Insurance Information
            </h2>
            <div className="flex gap-3">
              <button className="px-4 py-2 text-sm font-medium text-ngenius-primary bg-white border border-ngenius-primary rounded-lg hover:bg-ngenius-gray-50">
                Upload Card
              </button>
              <button className="px-4 py-2 text-sm font-medium text-ngenius-primary bg-white border border-ngenius-primary rounded-lg hover:bg-ngenius-gray-50">
                Edit
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ngenius-gray-500">Provider</label>
                <p className="mt-1 text-ngenius-gray-900">{patientInfo.insurance.provider}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-ngenius-gray-500">Policy Number</label>
                <p className="mt-1 text-ngenius-gray-900">{patientInfo.insurance.policyNumber}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ngenius-gray-500">Group Number</label>
                <p className="mt-1 text-ngenius-gray-900">{patientInfo.insurance.groupNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-ngenius-gray-500">Status</label>
                <span className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Primary Insurance
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Emergency Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-ngenius-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold bg-gradient-navy text-transparent bg-clip-text">
              Emergency Contact
            </h2>
            <button className="px-4 py-2 text-sm font-medium text-ngenius-primary bg-white border border-ngenius-primary rounded-lg hover:bg-ngenius-gray-50">
              Edit
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ngenius-gray-500">Name</label>
                <p className="mt-1 text-ngenius-gray-900">{patientInfo.emergency.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-ngenius-gray-500">Relationship</label>
                <p className="mt-1 text-ngenius-gray-900">{patientInfo.emergency.relationship}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ngenius-gray-500">Phone</label>
                <p className="mt-1 text-ngenius-gray-900">{patientInfo.emergency.phone}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;