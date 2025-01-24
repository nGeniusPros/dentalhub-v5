import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useNotifications } from '../../../contexts/NotificationContext';

interface Patient {
  id: string;
  name: string;
  age: number;
  lastVisit: string;
  nextAppointment: string | null;
  status: 'active' | 'inactive';
  insuranceStatus: 'verified' | 'pending' | 'expired';
}

export const PatientManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { dispatch: notifyDispatch } = useNotifications();

  const [patients] = useState<Patient[]>([
    {
      id: '1',
      name: 'John Smith',
      age: 45,
      lastVisit: '2025-01-15',
      nextAppointment: '2025-02-15',
      status: 'active',
      insuranceStatus: 'verified',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      age: 32,
      lastVisit: '2025-01-10',
      nextAppointment: null,
      status: 'active',
      insuranceStatus: 'pending',
    },
  ]);

  const handleAddPatient = () => {
    notifyDispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        type: 'info',
        title: 'Add Patient',
        message: 'Opening new patient form...',
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'medium',
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Patient Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            View and manage patient information
          </p>
        </div>
        <Button onClick={handleAddPatient}>
          <Icons.UserPlus className="h-4 w-4 mr-2" />
          Add New Patient
        </Button>
      </div>

      {/* Patient Filters */}
      <div className="mb-6">
        <div className="flex space-x-4">
          {[
            { id: 'all', label: 'All Patients' },
            { id: 'active', label: 'Active' },
            { id: 'pending', label: 'Pending Review' },
            { id: 'inactive', label: 'Inactive' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-4 py-2 rounded-md ${
                activeTab === id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Last Visit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Next Appointment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Insurance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {patients.map((patient) => (
                <motion.tr
                  key={patient.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {patient.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {patient.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {patient.age}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {patient.lastVisit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {patient.nextAppointment || 'Not Scheduled'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        patient.insuranceStatus === 'verified'
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                          : patient.insuranceStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                          : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                      }`}
                    >
                      {patient.insuranceStatus.charAt(0).toUpperCase() + patient.insuranceStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button variant="ghost" size="sm" className="mr-2">
                      <Icons.Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Icons.MoreVertical className="h-4 w-4" />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
