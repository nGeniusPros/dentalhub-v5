import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { ShiftCalendar } from './calendar/ShiftCalendar';
import { AddShiftModal } from './calendar/AddShiftModal';
import { ViewShiftModal } from './calendar/ViewShiftModal';
import { cn } from '../../../../lib/utils';
import supabase from '../../../../lib/supabase/client';

interface Shift {
  id: string;
  employeeName: string;
  role: string;
  startTime: string;
  endTime: string;
  date: string;
  status: 'scheduled' | 'checked-in' | 'checked-out' | 'absent';
}

export const StaffSchedule = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [shifts, setShifts] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);

  useEffect(() => {
    const fetchStaffSchedules = async () => {
      try {
        const { data, error } = await supabase
          .from('staff_schedules')
          .select(`
            *,
            staff:staff_profiles!inner(
              id,
              user:auth.users!user_id(
                id,
                email,
                raw_user_meta_data
              ),
              role
            )
          `)
          .order('start_time', { ascending: true });

        if (error) {
          console.error('Error fetching staff schedules:', error);
        } else {
          setShifts(data);
          const groupedSchedules = data.reduce((acc: any, shift: any) => {
            const shiftTime = new Date(shift.start_time).getHours() < 12 ? 'Morning' : 'Afternoon';
            const existingShift = acc.find((s: any) => s.shift === shiftTime);
            if (existingShift) {
              existingShift.staff.push({
                name: shift.staff.user.raw_user_meta_data.full_name,
                role: shift.staff.role,
                status: shift.status,
              });
            } else {
              acc.push({
                shift: shiftTime,
                time: `${new Date(shift.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(shift.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                staff: [{
                  name: shift.staff.user.raw_user_meta_data.full_name,
                  role: shift.staff.role,
                  status: shift.status,
                }]
              });
            }
            return acc;
          }, []);
          setSchedule(groupedSchedules);
        }
      } catch (error) {
        console.error('Error fetching staff schedules:', error);
      }
    };

    fetchStaffSchedules();
  }, [supabase]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Today's Schedule</h2>
          <p className="text-sm text-gray-500">
            {showCalendar ? 'Monthly calendar view' : 'Staff shifts and attendance'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            {React.createElement((Icons as any).Calendar, {
              className: "w-4 h-4 mr-2"
            })}
            {showCalendar ? 'Hide Calendar' : 'View Calendar'}
          </Button>
        </div>
      </div>

      {showCalendar && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6"
        >
          <ShiftCalendar />
        </motion.div>
      )}

      {!showCalendar && <div className="space-y-6">
        {schedule.map((shift, index) => (
          <div key={index} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <h3 className="font-medium text-gray-900">{shift.shift} Shift</h3>
              <span className="text-sm text-gray-500">({shift.time})</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {shift.staff.map((member: any, idx: number) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      member.status === 'checked-in' ? 'bg-green-100 text-green-800' :
                      member.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {member.status}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      {React.createElement((Icons as any).MessageSquare, {
                        className: "w-4 h-4 mr-2"
                      })}
                      Message
                    </Button>
                    {member.status === 'pending' && (
                      <Button size="sm" variant="outline" className="flex-1">
                        {React.createElement((Icons as any).Clock, {
                          className: "w-4 h-4 mr-2"
                        })}
                        Remind
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>}
    </motion.div>
  );
};