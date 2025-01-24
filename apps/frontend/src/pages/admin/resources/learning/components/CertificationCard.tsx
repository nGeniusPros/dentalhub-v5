import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { cn } from '../../../../lib/utils';

interface CertificationCardProps {
  certification: {
    id: string;
    name: string;
    issuer: string;
    earnedDate: string;
    expirationDate: string;
    status: 'active' | 'expiring' | 'expired';
    skills: string[];
    credentialId: string;
    thumbnail?: string;
  };
  onRenew: (id: string) => void;
  onDownload: (id: string) => void;
  onShare: (id: string) => void;
}

export const CertificationCard: React.FC<CertificationCardProps> = ({
  certification,
  onRenew,
  onDownload,
  onShare
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
    >
      <div className="relative">
        {certification.thumbnail ? (
          <img
            src={certification.thumbnail}
            alt={certification.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-r from-primary/10 to-primary/5 flex items-center justify-center">
            <Icons.Award className="w-12 h-12 text-primary/40" />
          </div>
        )}
        <span className={cn(
          "absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium",
          certification.status === 'active' && "bg-green-100 text-green-800",
          certification.status === 'expiring' && "bg-yellow-100 text-yellow-800",
          certification.status === 'expired' && "bg-red-100 text-red-800"
        )}>
          {certification.status === 'active' && 'Active'}
          {certification.status === 'expiring' && 'Expiring Soon'}
          {certification.status === 'expired' && 'Expired'}
        </span>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{certification.name}</h3>
        <p className="text-sm text-gray-500 mb-4">Issued by {certification.issuer}</p>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="text-gray-500">Earned</label>
              <p className="font-medium">{new Date(certification.earnedDate).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-gray-500">Expires</label>
              <p className="font-medium">{new Date(certification.expirationDate).toLocaleDateString()}</p>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500 block mb-2">Skills</label>
            <div className="flex flex-wrap gap-2">
              {certification.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500 block mb-1">Credential ID</label>
            <p className="text-sm font-mono bg-gray-50 p-2 rounded">{certification.credentialId}</p>
          </div>

          <div className="flex gap-2">
            {certification.status === 'expiring' && (
              <Button
                className="flex-1"
                onClick={() => onRenew(certification.id)}
              >
                <Icons.RefreshCw className="w-4 h-4 mr-2" />
                Renew
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => onDownload(certification.id)}
            >
              <Icons.Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              onClick={() => onShare(certification.id)}
            >
              <Icons.Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};