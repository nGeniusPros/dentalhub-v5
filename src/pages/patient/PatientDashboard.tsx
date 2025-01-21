import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Link,  } from 'react-router-dom';
import { cn } from '../../utils/cn';
import supabase from '../../lib/supabase/client';
import { syncManager } from '../../lib/utils/sync';

const PatientDashboard = () => {
  const [patientInfo, setPatientInfo] = useState<any>(null);
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);

  const quickActions = [
    { label: "Book Appointment", icon: "Calendar", path: "/patient-dashboard/appointments" },
    { label: "Message Office", icon: "MessageSquare", path: "/patient-dashboard/chat" },
    { label: "View Documents", icon: "FileText", path: "/patient-dashboard/documents" },
    { label: "Make Payment", icon: "CreditCard", path: "/patient-dashboard/billing" }
  ];

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const { data: patient, error: patientError } = await supabase
          .from('patients')
          .select(`
            *,
            appointments (
              id,
              appointment_date,
              type,
              status
            )
          `)
          .eq('id', 'user-id-1') // Replace with actual user ID
          .single();

        if (patientError) {
          console.error('Error fetching patient data:', patientError);
        } else {
          setPatientInfo(patient);
        }

        const { data: family, error: familyError } = await supabase
          .from('family_relationships')
          .select(`
            related_patient:patients!related_patient_id (
              id,
              first_name,
              last_name,
              appointments (
                id,
                appointment_date,
                type,
                status
              )
            ),
            relationship_type
          `)
          .eq('patient_id', 'user-id-1'); // Replace with actual user ID

        if (familyError) {
          console.error('Error fetching family members:', familyError);
        } else {
          setFamilyMembers(family.map((item: any) => ({
            name: `${item.related_patient.first_name} ${item.related_patient.last_name}`,
            relation: item.relationship_type,
            nextAppointment: item.related_patient.appointments[0]?.appointment_date || 'None Scheduled'
          })));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPatientData();

    syncManager.subscribeToTable('patients', (payload) => {
      console.log('Patient data sync update:', payload);
      fetchPatientData();
    });

    syncManager.subscribeToTable('family_relationships', (payload) => {
      console.log('Family relationships sync update:', payload);
      fetchPatientData();
    });

    return () => {
      syncManager.unsubscribeFromTable('patients');
      syncManager.unsubscribeFromTable('family_relationships');
    };
  }, [supabase, syncManager]);

  return (
    <div className="space-y-6">
      {/* Patient Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
            <Icons.User className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{patientInfo?.first_name} {patientInfo?.last_name}</h2>
            <p className="text-gray-500">DOB: {patientInfo?.date_of_birth}</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={action.path}
              className="block p-4 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                {React.createElement((Icons as any)[action.icon], {
                  className: "w-6 h-6 text-primary-600 mb-2"
                })}
                <span className="text-sm font-medium text-gray-900">{action.label}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Family Members Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Family Members</h3>
          <Link
            to="/patient-dashboard/family"
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            View All
          </Link>
        </div>
        <div className="space-y-4">
          {familyMembers.map((member, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <Icons.User className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.relation}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Next Appointment</p>
                <p className="text-sm font-medium text-gray-900">{member.nextAppointment}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Cleaning</p>
              <p className="text-sm text-gray-500">Mar 15, 2024 - 10:00 AM</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Documents</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Treatment Plan</p>
              <p className="text-sm text-gray-500">Updated Feb 28, 2024</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientDashboard;