import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { formatTime } from '../../../lib/utils/date';
import supabase from '../../../lib/supabase/client';

export const RecentActivitySection = () => {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data: appointments, error: appointmentsError } = await supabase
          .from('appointments')
          .select(`
            *,
            patient:patients!inner(id, first_name, last_name)
          `)
          .order('created_at', { ascending: false })
          .limit(3);

        if (appointmentsError) {
          console.error('Error fetching appointments:', appointmentsError);
        }

        const { data: treatmentPlans, error: treatmentError } = await supabase
          .from('treatment_plans')
          .select(`
            *,
            patient:patients!inner(id, first_name, last_name)
          `)
          .order('created_at', { ascending: false })
          .limit(3);

        if (treatmentError) {
          console.error('Error fetching treatment plans:', treatmentError);
        }

        const { data: messages, error: messageError } = await supabase
          .from('messages_notifications')
          .select(`
            *,
            recipient:patients!inner(id, first_name, last_name)
          `)
          .order('created_at', { ascending: false })
          .limit(3);

        if (messageError) {
          console.error('Error fetching messages:', messageError);
        }

        const combinedActivities = [
          ...(appointments || []).map((apt: any) => ({
            type: 'appointment',
            message: 'New appointment scheduled',
            patient: `${apt.patient?.first_name} ${apt.patient?.last_name}`,
            time: apt.start_time,
            icon: 'Calendar'
          })),
          ...(treatmentPlans || []).map((plan: any) => ({
            type: 'treatment',
            message: 'Treatment plan updated',
            patient: `${plan.patient?.first_name} ${plan.patient?.last_name}`,
            time: plan.created_at,
            icon: 'FileText'
          })),
          ...(messages || []).map((msg: any) => ({
            type: 'message',
            message: 'Message sent to patient',
            patient: `${msg.recipient?.first_name} ${msg.recipient?.last_name}`,
            time: msg.created_at,
            icon: 'MessageSquare'
          }))
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 3);

        setActivities(combinedActivities);
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      }
    };

    fetchActivities();
  }, [supabase]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
    >
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className={`p-2 rounded-lg ${
              activity.type === 'appointment' ? 'bg-blue-100 text-blue-600' :
              activity.type === 'treatment' ? 'bg-purple-100 text-purple-600' :
              'bg-green-100 text-green-600'
            }`}>
              {React.createElement((Icons as any)[activity.icon], {
                className: 'w-5 h-5'
              })}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{activity.message}</p>
              <p className="text-sm text-gray-500">Patient: {activity.patient}</p>
              <p className="text-sm text-gray-500">{formatTime(activity.time)}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};