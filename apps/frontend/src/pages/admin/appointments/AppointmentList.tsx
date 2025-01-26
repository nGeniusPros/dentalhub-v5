import { useState } from "react";
import AppointmentCard from "./AppointmentCard.js";
import type { SikkaAppointment } from "@/types/appointments";

interface AppointmentListProps {
  appointments: SikkaAppointment[];
  onAppointmentClick: (appointment: SikkaAppointment) => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  onAppointmentClick,
}) => {
  const [selectedAppointment, setSelectedAppointment] =
    useState<SikkaAppointment | null>(null);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          {...appointment}
          onClick={() => {
            onAppointmentClick(appointment);
            setSelectedAppointment(appointment);
          }}
        />
      ))}
    </div>
  );
};

export default AppointmentList;
