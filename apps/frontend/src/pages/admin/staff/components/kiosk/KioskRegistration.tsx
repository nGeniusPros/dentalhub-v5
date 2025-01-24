import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { useNotifications } from '../../../../../contexts/NotificationContext';
import QRCode from 'qrcode.react';

interface KioskRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (kioskData: any) => void;
}

export const KioskRegistration: React.FC<KioskRegistrationProps> = ({
  isOpen,
  onClose,
  onRegister
}) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    department: '',
    ipAddress: '',
    macAddress: '',
    accessLevel: 'standard'
  });

  const [qrCode, setQrCode] = useState<string | null>(null);
  const { dispatch: notifyDispatch } = useNotifications();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate unique kiosk ID
    const kioskId = `KIOSK-${Date.now()}`;
    
    // Generate QR code data
    const qrData = JSON.stringify({
      kioskId,
      ...formData,
      registrationDate: new Date().toISOString()
    });
    
    setQrCode(qrData);
    
    notifyDispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        type: 'message',
        title: 'Kiosk Registered',
        message: `New kiosk "${formData.name}" has been registered successfully`,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'medium'
      }
    });

    onRegister({ ...formData, kioskId });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Register New Kiosk</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kiosk Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              >
                <option value="">Select department...</option>
                <option value="Clinical">Clinical</option>
                <option value="Administrative">Administrative</option>
                <option value="HR">Human Resources</option>
                <option value="Reception">Reception</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Access Level
              </label>
              <select
                value={formData.accessLevel}
                onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              >
                <option value="standard">Standard</option>
                <option value="restricted">Restricted</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IP Address
              </label>
              <input
                type="text"
                value={formData.ipAddress}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                placeholder="192.168.1.100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                MAC Address
              </label>
              <input
                type="text"
                value={formData.macAddress}
                onChange={(e) => setFormData({ ...formData, macAddress: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                placeholder="00:00:00:00:00:00"
              />
            </div>
          </div>

          {qrCode && (
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <QRCode value={qrCode} size={200} level="H" />
              <p className="mt-2 text-sm text-gray-500">
                Scan this QR code to configure the kiosk
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-2"
                onClick={() => {
                  // In production, implement proper QR code download
                  const canvas = document.querySelector('canvas');
                  if (canvas) {
                    const url = canvas.toDataURL('image/png');
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `kiosk-${formData.name}-qr.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }
                }}
              >
                <Icons.Download className="w-4 h-4 mr-2" />
                Download QR Code
              </Button>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Register Kiosk
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};