import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/utils/date";
import { AppointmentActions } from "@/components/appointments/AppointmentActions";
import { supabase } from "@/lib/supabase/client";

export const ScheduleSection = () => {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data, error } = await supabase
          .from("appointments")
          .select(
            `
            *,
            patient:patients!inner(id, first_name, last_name, email, phone)
          `,
          )
          .order("start_time", { ascending: true })
          .limit(5);

        if (error) {
          console.error("Error fetching appointments:", error);
        } else {
          setAppointments(data);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [supabase]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Today's Schedule
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary-600 hover:text-primary-700"
        >
          <Icons.Calendar className="w-4 h-4 mr-2" />
          View Full Schedule
        </Button>
      </div>
      <div className="space-y-4">
        {appointments.map((apt, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-900">
                {formatTime(apt.start_time)}
              </span>
              <span
                className={cn(
                  "px-2 py-1 text-xs rounded-full",
                  apt.status === "Confirmed"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800",
                )}
              >
                {apt.status}
              </span>
            </div>
            <p className="text-gray-900">
              {apt.patient?.first_name} {apt.patient?.last_name}
            </p>
            <p className="text-sm text-gray-500">{apt.type}</p>
            <div className="mt-2">
              <AppointmentActions
                patient={`${apt.patient?.first_name} ${apt.patient?.last_name}`}
                time={apt.start_time}
                type={apt.type}
                status={apt.status}
                id={apt.id}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
