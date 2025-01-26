import AppointmentFilters from "./AppointmentFilters";
import AppointmentList from "./AppointmentList";
import AppointmentDetails from "./AppointmentDetails";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { AppointmentUIFilters } from "@/types/appointments";
import {
  fetchAppointments,
  updateAppointmentStatus,
} from "@/services/sikkaAppointmentService";
import type { SikkaAppointment } from "@/types/appointments";
import { useState } from "react";

const AppointmentDashboard = () => {
  const [selectedAppointment, setSelectedAppointment] =
    useState<SikkaAppointment | null>(null);
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 20,
    status: "",
    provider: "",
    search: "",
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["appointments", filters],
    queryFn: () => fetchAppointments(filters),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateAppointmentStatus(id, status),
    onSuccess: () => refetch(),
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Appointment Management
      </h1>
      <AppointmentFilters
        onFilterChange={(uiFilters: AppointmentUIFilters) =>
          setFilters((prev) => ({
            ...prev,
            ...uiFilters,
            page: 1, // Reset to first page on filter change
          }))
        }
      />

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          Error loading appointments: {(error as Error).message}
        </div>
      )}

      {data && (
        <AppointmentList
          appointments={data.results}
          onAppointmentClick={setSelectedAppointment}
        />
      )}

      {selectedAppointment && (
        <AppointmentDetails
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onStatusUpdate={(status: SikkaAppointment["status"]) =>
            statusMutation.mutate({ id: selectedAppointment.id, status })
          }
        />
      )}
    </div>
  );
};

export default AppointmentDashboard;
