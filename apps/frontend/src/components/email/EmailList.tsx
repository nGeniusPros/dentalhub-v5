import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Mail, MousePointer } from 'lucide-react';
import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';
import { InstantlyService } from '../../services/instantlyService';
import { BeehiivService } from '../../services/beehiivService';

interface EmailListProps {
  type: 'all' | 'outbound' | 'newsletter';
}

interface EmailData {
  id: string;
  subject: string;
  preview: string;
  sender: string;
  senderEmail: string;
  date: string;
  status: 'sent' | 'scheduled';
  openRate: number;
  clickRate: number;
}

export const EmailList = ({ type }: EmailListProps) => {
  const [emails, setEmails] = useState<EmailData[]>([]);
  const [loading, setLoading] = useState(true);
  const instantlyService = InstantlyService.getInstance();
  const beehiivService = BeehiivService.getInstance();

  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      try {
        let fetchedEmails: EmailData[] = [];
        if (type === 'outbound') {
          const campaigns = await instantlyService.getCampaigns();
          if (campaigns && Array.isArray(campaigns)) {
            fetchedEmails = campaigns.map((campaign: any) => ({
              id: campaign.id,
              subject: campaign.name,
              preview: campaign.description,
              sender: 'Instantly',
              senderEmail: 'no-reply@instantly.ai',
              date: new Date(campaign.created_at).toLocaleDateString(),
              status: 'sent' as const, // Assuming all campaigns are sent
              openRate: 0, // Placeholder
              clickRate: 0, // Placeholder
            }));
          }
        } else if (type === 'newsletter') {
          const publications = await beehiivService.getPublications();
          if (publications && Array.isArray(publications)) {
            fetchedEmails = publications.map((publication: any) => ({
              id: publication.id,
              subject: publication.name,
              preview: publication.description,
              sender: 'Beehiiv',
              senderEmail: 'no-reply@beehiiv.com',
              date: new Date(publication.created_at).toLocaleDateString(),
              status: 'scheduled' as const, // Assuming all publications are scheduled
              openRate: 0, // Placeholder
              clickRate: 0, // Placeholder
            }));
          }
        }
        setEmails(fetchedEmails);
      } catch (error) {
        console.error('Failed to fetch emails:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [type, instantlyService, beehiivService]);

  if (loading) {
    return <div>Loading emails...</div>;
  }

  return (
    <div className="space-y-4">
      {emails.map((email) => (
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
                <MoreVertical className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{email.preview}</p>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" aria-hidden="true" />
              <span className="text-sm text-gray-600">
                {email.openRate}% open rate
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MousePointer className="w-4 h-4 text-gray-400" aria-hidden="true" />
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