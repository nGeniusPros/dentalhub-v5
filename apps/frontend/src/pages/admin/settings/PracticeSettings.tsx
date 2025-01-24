import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useNotifications } from '../../../contexts/NotificationContext';

interface PracticeInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  businessHours: {
    [key: string]: { open: string; close: string };
  };
}

export const PracticeSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { dispatch: notifyDispatch } = useNotifications();

  const [practiceInfo, setPracticeInfo] = useState<PracticeInfo>({
    name: 'DentalHub Clinic',
    address: '123 Medical Center Blvd, Suite 100',
    phone: '(555) 123-4567',
    email: 'info@dentalhubclinic.com',
    website: 'www.dentalhubclinic.com',
    businessHours: {
      monday: { open: '09:00', close: '17:00' },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '16:00' },
      saturday: { open: '10:00', close: '14:00' },
      sunday: { open: '', close: '' },
    },
  });

  const handleSave = () => {
    notifyDispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        type: 'success',
        title: 'Settings Saved',
        message: 'Practice settings have been updated successfully.',
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'high',
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Practice Settings</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your practice information and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {[
              { id: 'general', label: 'General', icon: Icons.Settings },
              { id: 'hours', label: 'Business Hours', icon: Icons.Clock },
              { id: 'notifications', label: 'Notifications', icon: Icons.Bell },
              { id: 'integrations', label: 'Integrations', icon: Icons.Link },
              { id: 'security', label: 'Security', icon: Icons.Shield },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === id
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Practice Name
                  </label>
                  <input
                    type="text"
                    value={practiceInfo.name}
                    onChange={(e) =>
                      setPracticeInfo({ ...practiceInfo, name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Address
                  </label>
                  <input
                    type="text"
                    value={practiceInfo.address}
                    onChange={(e) =>
                      setPracticeInfo({ ...practiceInfo, address: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={practiceInfo.phone}
                      onChange={(e) =>
                        setPracticeInfo({ ...practiceInfo, phone: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      value={practiceInfo.email}
                      onChange={(e) =>
                        setPracticeInfo({ ...practiceInfo, email: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Website
                  </label>
                  <input
                    type="url"
                    value={practiceInfo.website}
                    onChange={(e) =>
                      setPracticeInfo({ ...practiceInfo, website: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                <div className="pt-5">
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSave}
                      className="ml-3 inline-flex justify-center"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hours' && (
              <div className="space-y-6">
                {Object.entries(practiceInfo.businessHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center space-x-4">
                    <div className="w-32">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {day}
                      </label>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) =>
                          setPracticeInfo({
                            ...practiceInfo,
                            businessHours: {
                              ...practiceInfo.businessHours,
                              [day]: { ...hours, open: e.target.value },
                            },
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) =>
                          setPracticeInfo({
                            ...practiceInfo,
                            businessHours: {
                              ...practiceInfo.businessHours,
                              [day]: { ...hours, close: e.target.value },
                            },
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                  </div>
                ))}
                <div className="pt-5">
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSave}
                      className="ml-3 inline-flex justify-center"
                    >
                      Save Hours
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
