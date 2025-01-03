import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { SettingsToggle } from './SettingsToggle';

interface SecuritySettings {
  twoFactorAuth: boolean;
  passwordExpiration: number;
  loginAttempts: number;
  sessionTimeout: number;
  ipWhitelist: string[];
}

export const SecuritySettings = () => {
  const [settings, setSettings] = React.useState<SecuritySettings>({
    twoFactorAuth: true,
    passwordExpiration: 90,
    loginAttempts: 3,
    sessionTimeout: 30,
    ipWhitelist: []
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
      
      <div className="space-y-6">
        <SettingsToggle
          section="security"
          setting="twoFactorAuth"
          title="Two-Factor Authentication"
          description="Require 2FA for all staff logins"
        />

        <SettingsToggle
          section="security"
          setting="enforcePasswordPolicy"
          title="Password Policy"
          description="Enforce strong password requirements"
        />

        <SettingsToggle
          section="security"
          setting="ipWhitelistEnabled"
          title="IP Whitelist"
          description="Restrict access to specific IP addresses"
        />

        <SettingsToggle
          section="security"
          setting="auditLogging"
          title="Audit Logging"
          description="Track all system activities and changes"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password Expiration (days)
            </label>
            <input
              type="number"
              value={settings.passwordExpiration}
              onChange={(e) => setSettings(prev => ({ ...prev, passwordExpiration: parseInt(e.target.value) }))}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Failed Login Attempts
            </label>
            <input
              type="number"
              value={settings.loginAttempts}
              onChange={(e) => setSettings(prev => ({ ...prev, loginAttempts: parseInt(e.target.value) }))}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Session Timeout (minutes)
          </label>
          <select
            value={settings.sessionTimeout}
            onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
            <option value={120}>2 hours</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            IP Whitelist
          </label>
          <div className="space-y-2">
            {settings.ipWhitelist.map((ip, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={ip}
                  onChange={(e) => {
                    const newList = [...settings.ipWhitelist];
                    newList[index] = e.target.value;
                    setSettings(prev => ({ ...prev, ipWhitelist: newList }));
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="Enter IP address"
                />
                <Button
                  variant="ghost"
                  onClick={() => {
                    const newList = settings.ipWhitelist.filter((_, i) => i !== index);
                    setSettings(prev => ({ ...prev, ipWhitelist: newList }));
                  }}
                >
                  <Icons.X className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => setSettings(prev => ({ 
                ...prev, 
                ipWhitelist: [...prev.ipWhitelist, ''] 
              }))}
            >
              <Icons.Plus className="w-4 h-4 mr-2" />
              Add IP Address
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};