import React from "react";

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  type: string;
  status: "scheduled" | "completed" | "cancelled";
}

interface AppointmentOverviewProps {
  appointments: Appointment[];
}

export const AppointmentOverview: React.FC<AppointmentOverviewProps> = ({
  appointments,
}) => {
  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-semibold mb-4">Today's Appointments</h3>
      <div className="space-y-3">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
          >
            <div>
              <h4 className="font-medium">{appointment.patientName}</h4>
              <p className="text-sm text-gray-500">
                {appointment.time} - {appointment.type}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                appointment.status,
              )}`}
            >
              {appointment.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
