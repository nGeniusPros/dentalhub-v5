import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';

interface EmailListProps {
  type: 'all' | 'outbound' | 'newsletter';
}

const mockEmails = [
  {
    id: '1',
    subject: 'Your Dental Appointment Reminder',
    preview: 'This is a reminder for your upcoming dental appointment...',
    sender: 'Dr. Sarah Wilson',
    senderEmail: 'sarah.wilson@example.com',
    date: '2024-03-15',
    status: 'sent',
    openRate: 68,
    clickRate: 42
  },
  {
    id: '2',
    subject: 'Monthly Newsletter - March 2024',
    preview: 'Check out our latest dental care tips and practice updates...',
    sender: 'NGenius Dental',
    senderEmail: 'newsletter@example.com',
    date: '2024-03-10',
    status: 'scheduled',
    openRate: 55,
    clickRate: 35
  }
];

export const EmailList = ({ type }: EmailListProps) => {
  return (
    <div className="space-y-4">
      {mockEmails.map((email) => (
        <motion.div
          key={email.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar seed={email.senderEmail} size={40} />
              <div>
                <h3 className="font-medium text-gray-900">{email.subject}</h3>
                <p className="text-sm text-gray-500">{email.sender}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{email.date}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  email.status === 'sent' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {email.status}
                </span>
              </div>
              <Button variant="ghost" size="sm">
                <Icons.MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{email.preview}</p>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Icons.Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {email.openRate}% open rate
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icons.MousePointer className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {email.clickRate}% click rate
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};