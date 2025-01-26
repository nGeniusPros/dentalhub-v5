import React from "react";
import { Clock, User, Phone } from "lucide-react";
import type { SikkaAppointment } from "@/types/appointments.js";

interface AppointmentCardProps
  extends Pick<
    SikkaAppointment,
    | "id"
    | "startTime"
    | "patientName"
    | "type"
    | "duration"
    | "phone"
    | "status"
    | "provider"
    | "operatory"
    | "insuranceInfo"
  > {
  onClick?: () => void;
}

const statusStyles = {
  scheduled: "bg-purple bg-opacity-10 text-purple",
  "in-progress": "bg-turquoise bg-opacity-10 text-turquoise",
  completed: "bg-green bg-opacity-10 text-green",
  cancelled: "bg-red-100 text-red-500",
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  startTime,
  patientName,
  type,
  duration,
  phone,
  status,
  provider,
  operatory,
  onClick,
  insuranceInfo,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-navy font-semibold">{startTime}</p>
          <p className="text-sm text-gray-darker">{duration}</p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-navy" />
          <p className="text-sm text-gray-darker">{patientName}</p>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-navy" />
          <p className="text-sm text-gray-darker">{type}</p>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-navy" />
          <p className="text-sm text-gray-darker">{phone}</p>
        </div>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-navy" />
          <p className="text-sm text-gray-darker">{provider}</p>
        </div>
      </div>

      {insuranceInfo && (
        <div className="mt-2 p-2 bg-gray-smoke rounded-lg">
          <p className="text-xs text-gray-darker">
            Insurance: {insuranceInfo.provider}
          </p>
          <p className="text-xs text-gray-darker">
            Status: {insuranceInfo.verificationStatus}
          </p>
          <p className="text-xs text-gray-darker">
            Copay: ${insuranceInfo.copay}
          </p>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button className="flex-1 px-3 py-1.5 text-sm text-navy border border-navy rounded-lg hover:bg-navy hover:text-white transition-colors">
          Reschedule
        </button>
        <button className="flex-1 px-3 py-1.5 text-sm text-white bg-navy rounded-lg hover:bg-navy-light transition-colors">
          Check In
        </button>
      </div>
    </div>
  );
};

export default AppointmentCard;
