import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useNotifications } from "../../../contexts/NotificationContext";

interface Appointment {
  id: string;
  patientName: string;
  time: string;
  duration: number;
  type: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
}

export const ScheduleControl: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { dispatch: notifyDispatch } = useNotifications();

  const [appointments] = useState<Appointment[]>([
    {
      id: "1",
      patientName: "John Smith",
      time: "09:00",
      duration: 30,
      type: "Check-up",
      status: "scheduled",
    },
    {
      id: "2",
      patientName: "Sarah Johnson",
      time: "10:00",
      duration: 60,
      type: "Cleaning",
      status: "in-progress",
    },
  ]);

  const handleAddAppointment = () => {
    notifyDispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: Date.now().toString(),
        type: "info",
        title: "New Appointment",
        message: "Opening appointment scheduler...",
        timestamp: new Date().toISOString(),
        read: false,
        priority: "medium",
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Schedule Control
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage appointments and schedules
          </p>
        </div>
        <Button onClick={handleAddAppointment}>
          <Icons.CalendarPlus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Navigation */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <Icons.ChevronLeft className="h-5 w-5" />
            </button>
            <span className="font-semibold">
              {selectedDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <Icons.ChevronRight className="h-5 w-5" />
            </button>
          </div>
          {/* Mini Calendar would go here */}
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {appointments.map((appointment) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {appointment.time} - {appointment.patientName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {appointment.type} ({appointment.duration} mins)
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          appointment.status === "scheduled"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                            : appointment.status === "in-progress"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                              : appointment.status === "completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                                : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                        }`}
                      >
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </span>
                      <Button variant="ghost" size="sm">
                        <Icons.MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
