import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { cn } from '../../utils/cn';

const FamilyMembers = () => {
  const familyMembers = [
    {
      name: "John Johnson",
      relation: "Spouse",
      dob: "1982-06-15",
      nextAppointment: "Mar 20, 2024",
      insurance: "Blue Cross Blue Shield",
      status: "Active"
    },
    {
      name: "Emily Johnson",
      relation: "Daughter",
      dob: "2015-03-10",
      nextAppointment: "Apr 5, 2024",
      insurance: "Blue Cross Blue Shield",
      status: "Active"
    },
    {
      name: "Michael Johnson",
      relation: "Son",
      dob: "2018-09-22",
      nextAppointment: "None Scheduled",
      insurance: "Blue Cross Blue Shield",
      status: "Active"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Family Members</h1>
          <p className="text-gray-500 mt-1">Manage family accounts and appointments</p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">
          Add Family Member
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {familyMembers.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <Icons.User className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-gray-500">{member.relation}</p>
                  </div>
                </div>
                <span className={cn(
                  "px-3 py-1 text-sm font-medium rounded-full",
                  member.status === 'Active' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                )}>
                  {member.status}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium text-gray-900">{member.dob}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Next Appointment</p>
                  <p className="font-medium text-gray-900">{member.nextAppointment}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Insurance</p>
                  <p className="font-medium text-gray-900">{member.insurance}</p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100">
                  View Records
                </button>
                <button className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100">
                  Schedule Appointment
                </button>
                <button className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100">
                  Update Info
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FamilyMembers;