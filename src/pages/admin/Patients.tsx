import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../components/ui/button';
import supabase from '../../lib/supabase/client';

const Patients = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data, error } = await supabase
          .from('patients')
          .select(`
            *,
            appointments(
              id,
              start_time,
              status
            ),
            billing_records(
              id,
              amount,
              status
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching patients:', error);
        } else {
          const patientsWithMetrics = data.map((patient: any) => ({
            ...patient,
            nextAppointment: patient.appointments
              ?.filter((apt: any) => new Date(apt.start_time) > new Date())
              ?.sort((a: any, b: any) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())[0]?.start_time,
            balance: patient.billing_records
              ?.filter((record: any) => record.status === 'unpaid')
              ?.reduce((total: number, record: any) => total + record.amount, 0) || 0,
            lastVisit: patient.appointments
              ?.filter((apt: any) => new Date(apt.start_time) < new Date())
              ?.sort((a: any, b: any) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())[0]?.start_time,
          }));
          setPatients(patientsWithMetrics);
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, [supabase]);

  const filteredPatients = patients.filter(patient => 
    patient.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-500">View and manage patient records</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            {React.createElement((Icons as any).Upload, {
              className: "w-4 h-4 mr-2"
            })}
            Import
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            {React.createElement((Icons as any).UserPlus, {
              className: "w-4 h-4 mr-2"
            })}
            Add Patient
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                {React.createElement((Icons as any).Search, {
                  className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                })}
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            <Button variant="outline">
              {React.createElement((Icons as any).Filter, {
                className: "w-4 h-4 mr-2"
              })}
              Filters
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Appointment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {React.createElement((Icons as any).User, {
                            className: "w-5 h-5 text-primary"
                          })}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{patient.first_name} {patient.last_name}</div>
                        <div className="text-sm text-gray-500">Last visit: {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'No visits'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.email}</div>
                    <div className="text-sm text-gray-500">{patient.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.nextAppointment ? new Date(patient.nextAppointment).toLocaleDateString() : 'None scheduled'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {patient.status || 'active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${patient.balance.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" size="sm">
                      {React.createElement((Icons as any).MoreHorizontal, {
                        className: "w-4 h-4"
                      })}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Patients;