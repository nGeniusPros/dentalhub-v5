import React from "react";
import {
  Clock,
  User,
  Phone,
  Mail,
  AlertCircle,
  FileText,
  DollarSign,
} from "lucide-react";
import type { SikkaAppointment } from "@/types/appointments";

interface AppointmentDetailsProps {
  appointment: SikkaAppointment;
  onClose: () => void;
  onStatusUpdate: (status: SikkaAppointment["status"]) => void;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  appointment,
  onClose,
  onStatusUpdate,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-light">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-navy">
                {appointment.patientName}
              </h2>
              <p className="text-gray-darker">{appointment.type}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-darker hover:text-navy"
            >
              ×
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">{/* Details implementation */}</div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
