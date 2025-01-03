import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface Password {
  id: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  category: string;
  lastUpdated: string;
}

const PasswordManager = () => {
  const [passwords, setPasswords] = useState<Password[]>([
    {
      id: '1',
      title: 'Practice Management System',
      username: 'admin@practice.com',
      password: '••••••••••••',
      url: 'pms.practice.com',
      category: 'Software',
      lastUpdated: '2024-03-01'
    },
    {
      id: '2',
      title: 'Insurance Portal',
      username: 'practice_admin',
      password: '••••••••••••',
      url: 'portal.insurance.com',
      category: 'Insurance',
      lastUpdated: '2024-02-15'
    }
  ]);

  const [showPassword, setShowPassword] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text">
            Password Manager
          </h1>
          <p className="text-gray-600">Securely store and manage practice passwords</p>
        </div>
        <Button className="bg-gradient-to-r from-navy via-purple to-turquoise text-white">
          <Icons.Plus className="w-4 h-4 mr-2" />
          Add Password
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {passwords.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border border-gray-light p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-navy to-purple rounded-lg">
                  <Icons.Key className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.category}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Icons.Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Icons.Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Username</label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-navy">{item.username}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(item.username)}
                  >
                    <Icons.Copy className="w-4 h-4 text-gray-400" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Password</label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-navy font-mono">
                    {showPassword === item.id ? item.password : '••••••••••••'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(showPassword === item.id ? null : item.id)}
                  >
                    {showPassword === item.id ? (
                      <Icons.EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Icons.Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(item.password)}
                  >
                    <Icons.Copy className="w-4 h-4 text-gray-400" />
                  </Button>
                </div>
              </div>
            </div>

            {item.url && (
              <div className="mt-4 flex items-center gap-2">
                <Icons.Globe className="w-4 h-4 text-gray-400" />
                <a
                  href={`https://${item.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-purple hover:text-purple-light"
                >
                  {item.url}
                </a>
              </div>
            )}

            <div className="mt-4 text-sm text-gray-500">
              Last updated: {item.lastUpdated}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PasswordManager;