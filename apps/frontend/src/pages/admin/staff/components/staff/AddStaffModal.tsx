import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { useNotifications } from '../../../../../contexts/NotificationContext';
import { BonusStructureSection } from '../../../../../components/staff/BonusStructureSection';
import { NotesSection } from '../../../../../components/staff/NotesSection';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (staffMember: any) => void;
}

export const AddStaffModal: React.FC<AddStaffModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    },
    department: '',
    email: '',
    phone: '',
    ssn: '',
    rdaLicense: '',
    rdaExpiration: '',
    startDate: '',
    terminationDate: '',
    payrollInfo: {
      salary: '',
      payFrequency: 'bi-weekly',
      lastReviewDate: '',
      nextReviewDate: ''
    },
    training: {
      completedCourses: [],
      requiredCourses: [],
      certifications: []
    },
    status: 'active',
    credentials: {
      username: '',
      password: ''
    },
    bonusStructure: {
      enrolled: false,
      type: 'production',
      frequency: 'monthly',
      targets: [],
      customPayoutDates: [],
      notes: ''
    },
    notes: []
  });

  const { dispatch: notifyDispatch } = useNotifications();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create welcome notification for new staff member
    notifyDispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        type: 'message',
        title: 'Welcome New Staff Member',
        message: `${formData.name} has joined the team as ${formData.role}`,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'medium'
      }
    });

    onAdd(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Add New Staff Member</h2>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                onClick={() => navigate('/admin-dashboard/hr/staff/new')}
              >
                <Icons.Maximize2 className="w-4 h-4 mr-2" />
                Open Full Page
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <Icons.X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  required
                >
                  <option value="">Select role...</option>
                  <option value="Dentist">Dentist</option>
                  <option value="Hygienist">Hygienist</option>
                  <option value="Dental Assistant">Dental Assistant</option>
                  <option value="Front Desk">Front Desk</option>
                  <option value="Office Manager">Office Manager</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  required
                >
                  <option value="">Select department...</option>
                  <option value="Clinical">Clinical</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Management">Management</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SSN
                </label>
                <input
                  type="password"
                  value={formData.ssn}
                  onChange={(e) => setFormData({ ...formData, ssn: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="XXX-XX-XXXX"
                  required
                />
              </div>

              {formData.role === 'Dental Assistant' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RDA License Number
                    </label>
                    <input
                      type="text"
                      value={formData.rdaLicense}
                      onChange={(e) => setFormData({ ...formData, rdaLicense: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RDA License Expiration
                    </label>
                    <input
                      type="date"
                      value={formData.rdaExpiration}
                      onChange={(e) => setFormData({ ...formData, rdaExpiration: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium mb-4">Address Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, street: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, state: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={formData.address.zip}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, zip: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payroll Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium mb-4">Payroll Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary/Hourly Rate
                  </label>
                  <input
                    type="text"
                    value={formData.payrollInfo.salary}
                    onChange={(e) => setFormData({
                      ...formData,
                      payrollInfo: { ...formData.payrollInfo, salary: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pay Frequency
                  </label>
                  <select
                    value={formData.payrollInfo.payFrequency}
                    onChange={(e) => setFormData({
                      ...formData,
                      payrollInfo: { ...formData.payrollInfo, payFrequency: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    required
                  >
                    <option value="weekly">Weekly</option>
                    <option value="bi-weekly">Bi-Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Review Date
                  </label>
                  <input
                    type="date"
                    value={formData.payrollInfo.lastReviewDate}
                    onChange={(e) => setFormData({
                      ...formData,
                      payrollInfo: { ...formData.payrollInfo, lastReviewDate: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Next Review Date
                  </label>
                  <input
                    type="date"
                    value={formData.payrollInfo.nextReviewDate}
                    onChange={(e) => setFormData({
                      ...formData,
                      payrollInfo: { ...formData.payrollInfo, nextReviewDate: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Training Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium mb-4">Training & Certifications</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Training Documents
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      className="flex-1"
                      multiple
                      accept=".pdf,.doc,.docx"
                    />
                    <Button type="button">
                      Upload
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Termination Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium mb-4">Termination Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Termination Date
                </label>
                <input
                  type="date"
                  value={formData.terminationDate}
                  onChange={(e) => setFormData({
                    ...formData,
                    terminationDate: e.target.value
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium mb-4">System Access</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.credentials.username}
                    onChange={(e) => setFormData({
                      ...formData,
                      credentials: { ...formData.credentials, username: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Initial Password
                  </label>
                  <input
                    type="password"
                    value={formData.credentials.password}
                    onChange={(e) => setFormData({
                      ...formData,
                      credentials: { ...formData.credentials, password: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Bonus Structure */}
            <BonusStructureSection
              value={formData.bonusStructure}
              onChange={(bonusStructure) => setFormData({
                ...formData,
                bonusStructure
              })}
            />

            {/* Staff Notes */}
            <NotesSection
              notes={formData.notes}
              onAddNote={(note) => {
                const newNote = {
                  ...note,
                  id: Date.now().toString(),
                  date: new Date().toISOString()
                };
                setFormData({
                  ...formData,
                  notes: [...formData.notes, newNote]
                });
              }}
              onDeleteNote={(id) => {
                setFormData({
                  ...formData,
                  notes: formData.notes.filter(note => note.id !== id)
                });
              }}
            />

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Add Staff Member
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};