import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Link } from '@/components/ui/link';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import { syncManager } from '@/lib/utils/sync';
import { Button } from '@/components/ui/button';

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

interface QuickAction {
  label: string;
  icon: keyof typeof Icons;
  path: string;
}

export const PatientDashboard: React.FC = () => {
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const quickActions: QuickAction[] = [
    {
      label: 'Book Appointment',
      icon: 'Calendar',
      path: '/patient/appointments/book'
    },
    {
      label: 'View Records',
      icon: 'FileText',
      path: '/patient/records'
    },
    {
      label: 'Billing',
      icon: 'CreditCard',
      path: '/patient/billing'
    },
    {
      label: 'Messages',
      icon: 'MessageSquare',
      path: '/patient/messages'
    }
  ];

  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        const { data, error } = await supabase
          .from('patients')
          .select(`
            id,
            first_name,
            last_name,
            date_of_birth,
            appointments (
              id,
              appointment_date,
              type,
              status
            )
          `)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setPatientInfo(data);
      } catch (error) {
        console.error('Error fetching patient info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientInfo();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icons.Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6"
    >
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {patientInfo?.first_name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Here's an overview of your dental health and upcoming appointments.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => {
          const Icon = Icons[action.icon];
          return (
            <Link
              key={action.label}
              href={action.path}
              className={cn(
                'flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg',
                'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
              )}
            >
              <Icon className="h-6 w-6 text-primary mr-3" />
              <span className="font-medium">{action.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
        <div className="space-y-4">
          {patientInfo?.appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <Icons.Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{appointment.type}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {new Date(appointment.appointment_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};