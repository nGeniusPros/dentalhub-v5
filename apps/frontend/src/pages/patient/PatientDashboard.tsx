import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Link } from '../../../components/ui/link';
import { cn } from '../../../lib/utils';
import { supabase } from '../../../lib/supabase/client';
import { syncManager } from '../../../lib/utils/sync';

interface PatientInfo {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  appointments: {
    id: string;
    appointment_date: string;
    type: string;
    status: string;
  }[];
}

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  nextAppointment?: string;
}

interface QuickAction {
  label: string;
  icon: keyof typeof Icons;
  path: string;
}

export const PatientDashboard = () => {
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  const quickActions: QuickAction[] = [
    { label: "Book Appointment", icon: "Calendar", path: "/patient/appointments" },
    { label: "Message Office", icon: "MessageSquare", path: "/patient/chat" },
    { label: "View Documents", icon: "FileText", path: "/patient/documents" },
    { label: "Make Payment", icon: "CreditCard", path: "/patient/billing" }
  ];

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const { data: patient, error } = await supabase
          .from('patients')
          .select('*, appointments(*)')
          .single();

        if (error) {
          console.error('Error fetching patient data:', error);
        } else {
          setPatientInfo(patient);
        }

        const { data: family, error: familyError } = await supabase
          .from('family_members')
          .select('*, related_patient:patients(*)')
          .eq('patient_id', patient.id);

        if (familyError) {
          console.error('Error fetching family members:', familyError);
        } else {
          setFamilyMembers(family.map((item: any) => ({
            id: item.related_patient.id,
            name: `${item.related_patient.first_name} ${item.related_patient.last_name}`,
            relation: item.relationship_type,
            nextAppointment: item.related_patient.appointments[0]?.appointment_date || 'None Scheduled'
          })));
        }
      } catch (error) {
        console.error('Error in fetchPatientData:', error);
      }
    };

    fetchPatientData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6"
    >
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {patientInfo?.first_name}!
        </h1>
        {patientInfo?.appointments[0] && (
          <p className="text-gray-600 dark:text-gray-300">
            Your next appointment is on{' '}
            {new Date(patientInfo.appointments[0].appointment_date).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => {
          const Icon = Icons[action.icon];
          return (
            <Link
              key={action.label}
              to={action.path}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <Icon className="h-6 w-6 mb-2 text-primary" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {action.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Family Members */}
      {familyMembers.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Family Members
          </h2>
          <div className="space-y-4">
            {familyMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{member.relation}</p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Next Appointment: {member.nextAppointment}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};