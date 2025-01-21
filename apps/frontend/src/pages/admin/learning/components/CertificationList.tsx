import React from 'react';
import { motion } from 'framer-motion';
import { CertificationCard } from './CertificationCard';
import { Button } from '../../../../components/ui/button';
import * as Icons from 'lucide-react';

export const CertificationList = () => {
  const certifications = [
    {
      id: '1',
      name: 'HIPAA Compliance Certification',
      issuer: 'Healthcare Compliance Institute',
      earnedDate: '2023-06-15',
      expirationDate: '2024-06-15',
      status: 'active',
      skills: ['Privacy Laws', 'Data Security', 'Patient Rights'],
      credentialId: 'HC-2023-1234'
    },
    {
      id: '2',
      name: 'Advanced Patient Care',
      issuer: 'Dental Excellence Academy',
      earnedDate: '2023-09-01',
      expirationDate: '2024-03-30',
      status: 'expiring',
      skills: ['Patient Care', 'Clinical Procedures', 'Emergency Response'],
      credentialId: 'DEA-2023-5678'
    }
  ];

  const handleRenew = (id: string) => {
    console.log('Renewing certification:', id);
  };

  const handleDownload = (id: string) => {
    console.log('Downloading certification:', id);
  };

  const handleShare = (id: string) => {
    console.log('Sharing certification:', id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Your Certifications</h2>
        <Button>
          <Icons.Plus className="w-4 h-4 mr-2" />
          Add Certification
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certifications.map((certification) => (
          <CertificationCard
            key={certification.id}
            certification={certification}
            onRenew={handleRenew}
            onDownload={handleDownload}
            onShare={handleShare}
          />
        ))}
      </div>
    </motion.div>
  );
};