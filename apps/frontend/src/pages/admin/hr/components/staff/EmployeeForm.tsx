import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { useNotifications } from '../../../../../contexts/NotificationContext';

interface EmployeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employee: any) => void;
  employee?: any;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  employee
}) => {
  const [formData, setFormData] = useState(employee || {
    personalInfo: {
      firstName: '',
      lastName: '',
      dob: '',
      ssn: '',
      gender: '',
      maritalStatus: '',
      address: {
        street: '',
        city: '',
        state: '',
        zip: ''
      },
      email: '',
      phone: '',
      alternatePhone: ''
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: '',
      address: {
        street: '',
        city: '',
        state: '',
        zip: ''
      }
    },
    employmentDetails: {
      employeeId: '',
      startDate: '',
      department: '',
      position: '',
      status: 'active',
      type: 'full-time',
      supervisor: '',
      workLocation: '',
      compensation: {
        salary: '',
        payFrequency: 'bi-weekly',
        lastReviewDate: '',
        nextReviewDate: ''
      }
    },
    credentials: {
      licenses: [{
        type: '',
        number: '',
        state: '',
        expirationDate: ''
      }],
      certifications: [{
        name: '',
        issuedBy: '',
        expirationDate: ''
      }]
    },
    healthInfo: {
      bloodType: '',
      allergies: '',
      medicalConditions: '',
      medications: '',
      immunizations: [{
        type: '',
        date: '',
        expirationDate: ''
      }]
    },
    documents: []
  });

  const { dispatch: notifyDispatch } = useNotifications();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    
    // Schedule annual information update reminder
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    
    notifyDispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        type: 'reminder',
        title: 'Employee Information Update Required',
        message: `Annual information update required for ${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`,
        timestamp: nextYear.toISOString(),
        read: false,
        priority: 'medium'
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {employee ? 'Edit Employee' : 'Add New Employee'}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Personal Information */}
          <section>
            <h3 className="text-lg font-medium mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.firstName}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, firstName: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.lastName}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, lastName: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.personalInfo.dob}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, dob: e.target.value }
                  })}
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
                  value={formData.personalInfo.ssn}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, ssn: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="XXX-XX-XXXX"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={formData.personalInfo.gender}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, gender: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  required
                >
                  <option value="">Select gender...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marital Status
                </label>
                <select
                  value={formData.personalInfo.maritalStatus}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, maritalStatus: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  required
                >
                  <option value="">Select status...</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.address.street}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      address: { ...formData.personalInfo.address, street: e.target.value }
                    }
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
                  value={formData.personalInfo.address.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      address: { ...formData.personalInfo.address, city: e.target.value }
                    }
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
                  value={formData.personalInfo.address.state}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      address: { ...formData.personalInfo.address, state: e.target.value }
                    }
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
                  value={formData.personalInfo.address.zip}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      address: { ...formData.personalInfo.address, zip: e.target.value }
                    }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, email: e.target.value }
                  })}
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
                  value={formData.personalInfo.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, phone: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alternate Phone
                </label>
                <input
                  type="tel"
                  value={formData.personalInfo.alternatePhone}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, alternatePhone: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
            </div>
          </section>

          {/* Emergency Contact */}
          <section className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-medium mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  value={formData.emergencyContact.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship
                </label>
                <input
                  type="text"
                  value={formData.emergencyContact.relationship}
                  onChange={(e) => setFormData({
                    ...formData,
                    emergencyContact: { ...formData.emergencyContact, relationship: e.target.value }
                  })}
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
                  value={formData.emergencyContact.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>
            </div>
          </section>

          {/* Employment Details */}
          <section className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-medium mb-4">Employment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee ID
                </label>
                <input
                  type="text"
                  value={formData.employmentDetails.employeeId}
                  onChange={(e) => setFormData({
                    ...formData,
                    employmentDetails: { ...formData.employmentDetails, employeeId: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.employmentDetails.startDate}
                  onChange={(e) => setFormData({
                    ...formData,
                    employmentDetails: { ...formData.employmentDetails, startDate: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={formData.employmentDetails.department}
                  onChange={(e) => setFormData({
                    ...formData,
                    employmentDetails: { ...formData.employmentDetails, department: e.target.value }
                  })}
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
                  Position
                </label>
                <select
                  value={formData.employmentDetails.position}
                  onChange={(e) => setFormData({
                    ...formData,
                    employmentDetails: { ...formData.employmentDetails, position: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  required
                >
                  <option value="">Select position...</option>
                  <option value="Dentist">Dentist</option>
                  <option value="Hygienist">Hygienist</option>
                  <option value="Dental Assistant">Dental Assistant</option>
                  <option value="Front Desk">Front Desk</option>
                  <option value="Office Manager">Office Manager</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Type
                </label>
                <select
                  value={formData.employmentDetails.type}
                  onChange={(e) => setFormData({
                    ...formData,
                    employmentDetails: { ...formData.employmentDetails, type: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  required
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="temporary">Temporary</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.employmentDetails.status}
                  onChange={(e) => setFormData({
                    ...formData,
                    employmentDetails: { ...formData.employmentDetails, status: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  required
                >
                  <option value="active">Active</option>
                  <option value="on-leave">On Leave</option>
                  <option value="terminated">Terminated</option>
                </select>
              </div>
            </div>

            {/* Compensation */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary/Rate
                </label>
                <input
                  type="text"
                  value={formData.employmentDetails.compensation.salary}
                  onChange={(e) => setFormData({
                    ...formData,
                    employmentDetails: {
                      ...formData.employmentDetails,
                      compensation: {
                        ...formData.employmentDetails.compensation,
                        salary: e.target.value
                      }
                    }
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
                  value={formData.employmentDetails.compensation.payFrequency}
                  onChange={(e) => setFormData({
                    ...formData,
                    employmentDetails: {
                      ...formData.employmentDetails,
                      compensation: {
                        ...formData.employmentDetails.compensation,
                        payFrequency: e.target.value
                      }
                    }
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
                  value={formData.employmentDetails.compensation.lastReviewDate}
                  onChange={(e) => setFormData({
                    ...formData,
                    employmentDetails: {
                      ...formData.employmentDetails,
                      compensation: {
                        ...formData.employmentDetails.compensation,
                        lastReviewDate: e.target.value
                      }
                    }
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
                  value={formData.employmentDetails.compensation.nextReviewDate}
                  onChange={(e) => setFormData({
                    ...formData,
                    employmentDetails: {
                      ...formData.employmentDetails,
                      compensation: {
                        ...formData.employmentDetails.compensation,
                        nextReviewDate: e.target.value
                      }
                    }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
            </div>
          </section>

          {/* Credentials & Licenses */}
          <section className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-medium mb-4">Credentials & Licenses</h3>
            {formData.credentials.licenses.map((license, index) => (
              <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      License Type
                    </label>
                    <input
                      type="text"
                      value={license.type}
                      onChange={(e) => {
                        const newLicenses = [...formData.credentials.licenses];
                        newLicenses[index] = { ...license, type: e.target.value };
                        setFormData({
                          ...formData,
                          credentials: { ...formData.credentials, licenses: newLicenses }
                        });
                      }}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      License Number
                    </label>
                    <input
                      type="text"
                      value={license.number}
                      onChange={(e) => {
                        const newLicenses = [...formData.credentials.licenses];
                        newLicenses[index] = { ...license, number: e.target.value };
                        setFormData({
                          ...formData,
                          credentials: { ...formData.credentials, licenses: newLicenses }
                        });
                      }}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={license.state}
                      onChange={(e) => {
                        const newLicenses = [...formData.credentials.licenses];
                        newLicenses[index] = { ...license, state: e.target.value };
                        setFormData({
                          ...formData,
                          credentials: { ...formData.credentials, licenses: newLicenses }
                        });
                      }}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiration Date
                    </label>
                    <input
                      type="date"
                      value={license.expirationDate}
                      onChange={(e) => {
                        const newLicenses = [...formData.credentials.licenses];
                        newLicenses[index] = { ...license, expirationDate: e.target.value };
                        setFormData({
                          ...formData,
                          credentials: { ...formData.credentials, licenses: newLicenses }
                        });
                      }}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  ...formData,
                  credentials: {
                    ...formData.credentials,
                    licenses: [
                      ...formData.credentials.licenses,
                      { type: '', number: '', state: '', expirationDate: '' }
                    ]
                  }
                });
              }}
            >
              <Icons.Plus className="w-4 h-4 mr-2" />
              Add License
            </Button>
          </section>

          {/* Health Information */}
          <section className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-medium mb-4">Health Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Type
                </label>
                <select
                  value={formData.healthInfo.bloodType}
                  onChange={(e) => setFormData({
                    ...formData,
                    healthInfo: { ...formData.healthInfo, bloodType: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="">Select blood type...</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allergies
                </label>
                <input
                  type="text"
                  value={formData.healthInfo.allergies}
                  onChange={(e) => setFormData({
                    ...formData,
                    healthInfo: { ...formData.healthInfo, allergies: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="List any allergies..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medical Conditions
                </label>
                <textarea
                  value={formData.healthInfo.medicalConditions}
                  onChange={(e) => setFormData({
                    ...formData,
                    healthInfo: { ...formData.healthInfo, medicalConditions: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  rows={3}
                  placeholder="List any medical conditions..."
                />
              </div>
            </div>

            {/* Immunizations */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Immunizations</h4>
              {formData.healthInfo.immunizations.map((immunization, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <input
                        type="text"
                        value={immunization.type}
                        onChange={(e) => {
                          const newImmunizations = [...formData.healthInfo.immunizations];
                          newImmunizations[index] = { ...immunization, type: e.target.value };
                          setFormData({
                            ...formData,
                            healthInfo: { ...formData.healthInfo, immunizations: newImmunizations }
                          });
                        }}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label Continuing the EmployeeForm.tsx content exactly where it left off:

                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date Received
                      </label>
                      <input
                        type="date"
                        value={immunization.date}
                        onChange={(e) => {
                          const newImmunizations = [...formData.healthInfo.immunizations];
                          newImmunizations[index] = { ...immunization, date: e.target.value };
                          setFormData({
                            ...formData,
                            healthInfo: { ...formData.healthInfo, immunizations: newImmunizations }
                          });
                        }}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiration Date
                      </label>
                      <input
                        type="date"
                        value={immunization.expirationDate}
                        onChange={(e) => {
                          const newImmunizations = [...formData.healthInfo.immunizations];
                          newImmunizations[index] = { ...immunization, expirationDate: e.target.value };
                          setFormData({
                            ...formData,
                            healthInfo: { ...formData.healthInfo, immunizations: newImmunizations }
                          });
                        }}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    ...formData,
                    healthInfo: {
                      ...formData.healthInfo,
                      immunizations: [
                        ...formData.healthInfo.immunizations,
                        { type: '', date: '', expirationDate: '' }
                      ]
                    }
                  });
                }}
              >
                <Icons.Plus className="w-4 h-4 mr-2" />
                Add Immunization
              </Button>
            </div>
          </section>

          {/* Document Upload */}
          <section className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-medium mb-4">Documents</h3>
            <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg">
              <div className="flex flex-col items-center">
                <Icons.Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">
                  Drag and drop files here, or click to browse
                </p>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setFormData({
                      ...formData,
                      documents: [
                        ...formData.documents,
                        ...files.map(file => ({
                          name: file.name,
                          type: file.type,
                          size: file.size,
                          uploadDate: new Date().toISOString()
                        }))
                      ]
                    });
                  }}
                />
                <Button type="button" variant="outline">Browse Files</Button>
              </div>
            </div>

            {formData.documents.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icons.FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{doc.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          documents: formData.documents.filter((_, i) => i !== index)
                        });
                      }}
                    >
                      <Icons.X className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {employee ? 'Update Employee' : 'Add Employee'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};