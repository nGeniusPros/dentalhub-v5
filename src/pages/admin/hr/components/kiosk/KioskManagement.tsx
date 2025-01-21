import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { KioskRegistration } from './KioskRegistration';
import { cn } from '../../../../../lib/utils';

interface Kiosk {
  id: string;
  name: string;
  location: string;
  department: string;
  ipAddress: string;
  macAddress: string;
  accessLevel: string;
  status: 'online' | 'offline' | 'maintenance';
  lastActive: string;
}

export const KioskManagement = () => {
  const [kiosks, setKiosks] = useState<Kiosk[]>([]);
  const [showRegistration, setShowRegistration] = useState(false);
  const [selectedKiosk, setSelectedKiosk] = useState<Kiosk | null>(null);

  const handleRegisterKiosk = (kioskData: any) => {
    const newKiosk: Kiosk = {
      id: `KIOSK-${Date.now()}`,
      ...kioskData,
      status: 'offline',
      lastActive: new Date().toISOString()
    };
    setKiosks([...kiosks, newKiosk]);
    setShowRegistration(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Kiosk Management</h2>
          <p className="text-sm text-gray-500">Manage and monitor kiosk devices</p>
        </div>
        <Button onClick={() => setShowRegistration(true)}>
          <Icons.Plus className="w-4 h-4 mr-2" />
          Register New Kiosk
        </Button>
      </div>

      <div className="space-y-4">
        {kiosks.map((kiosk) => (
          <div
            key={kiosk.id}
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Icons.Monitor className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{kiosk.name}</h3>
                  <p className="text-sm text-gray-500">{kiosk.location}</p>
                </div>
              </div>
              <span className={cn(
                "px-2 py-1 text-xs font-medium rounded-full",
                kiosk.status === 'online' && "bg-green-100 text-green-800",
                kiosk.status === 'offline' && "bg-gray-100 text-gray-800",
                kiosk.status === 'maintenance' && "bg-yellow-100 text-yellow-800"
              )}>
                {kiosk.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{kiosk.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Access Level</p>
                <p className="font-medium">{kiosk.accessLevel}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">IP Address</p>
                <p className="font-medium">{kiosk.ipAddress}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Active</p>
                <p className="font-medium">
                  {new Date(kiosk.lastActive).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm">
                <Icons.RefreshCw className="w-4 h-4 mr-2" />
                Restart
              </Button>
              <Button variant="outline" size="sm">
                <Icons.Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
              <Button variant="outline" size="sm">
                <Icons.FileText className="w-4 h-4 mr-2" />
                View Logs
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                <Icons.Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        ))}

        {kiosks.length === 0 && (
          <div className="text-center py-12">
            <Icons.Monitor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No kiosks registered yet</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setShowRegistration(true)}
            >
              Register Your First Kiosk
            </Button>
          </div>
        )}
      </div>

      <KioskRegistration
        isOpen={showRegistration}
        onClose={() => setShowRegistration(false)}
        onRegister={handleRegisterKiosk}
      />
    </motion.div>
  );
};