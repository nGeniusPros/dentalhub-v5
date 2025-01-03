import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { cn } from '../../../../lib/utils';
import { useNotifications } from '../../../../contexts/NotificationContext';
import { AddProviderModal } from './providers/AddProviderModal';

interface ProviderDocument {
  id: string;
  type: string;
  number: string;
  expirationDate: string;
  file?: string;
  status: 'active' | 'expiring' | 'expired';
}

interface Provider {
  id: string;
  name: string;
  license: string;
  expiration: string;
  status: 'active' | 'expiring' | 'expired';
  documents: ProviderDocument[];
}

export const ProviderCredentials = () => {
  const [showAddProvider, setShowAddProvider] = React.useState(false);
  const [providers, setProviders] = React.useState<Provider[]>([

    {
      id: '1',
      name: 'Dr. Sarah Wilson',
      license: 'DDS123456',
      expiration: '2024-12-31',
      status: 'active',
      documents: [
        { id: '1', type: 'License', number: 'DDS123456', expirationDate: '2024-12-31', status: 'active' },
        { id: '2', type: 'DEA', number: 'DEA789012', expirationDate: '2024-10-15', status: 'expiring' },
        { id: '3', type: 'Insurance', number: 'INS345678', expirationDate: '2025-03-20', status: 'active' }
      ]
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      license: 'DDS789012',
      expiration: '2024-10-15',
      status: 'expiring',
      documents: [
        { id: '1', type: 'License', number: 'DDS789012', expirationDate: '2024-10-15', status: 'expiring' },
        { id: '2', type: 'DEA', number: 'DEA456789', expirationDate: '2024-09-30', status: 'active' }
      ]
    },
    {
      id: '3',
      name: 'Dr. Emily Parker',
      license: 'DDS345678',
      expiration: '2025-03-20',
      status: 'active',
      documents: [
        { id: '1', type: 'License', number: 'DDS345678', expirationDate: '2025-03-20', status: 'active' },
        { id: '2', type: 'DEA', number: 'DEA234567', expirationDate: '2025-02-15', status: 'active' },
        { id: '3', type: 'Insurance', number: 'INS987654', expirationDate: '2025-04-10', status: 'active' }
      ]
    }
  ]);

  const { dispatch: notifyDispatch } = useNotifications();

  const handleUploadDocument = async (providerId: string, documentType: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // In production, upload file to server
        console.log(`Uploading ${file.name} for ${documentType}`);
        
        // Update provider documents
        setProviders(providers.map(provider => {
          if (provider.id === providerId) {
            return {
              ...provider,
              documents: provider.documents.map(doc => {
                if (doc.type === documentType) {
                  return { ...doc, file: file.name };
                }
                return doc;
              })
            };
          }
          return provider;
        }));
      }
    };

    input.click();
  };

  const handleRenewDocument = (providerId: string, documentId: string) => {
    const provider = providers.find(p => p.id === providerId);
    const document = provider?.documents.find(d => d.id === documentId);
    
    if (provider && document) {
      // Create notification for renewal
      notifyDispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now().toString(),
          type: 'alert',
          title: 'Document Renewal Required',
          message: `${document.type} for ${provider.name} needs to be renewed by ${document.expirationDate}`,
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'high',
          metadata: {
            providerId,
            documentId,
            documentType: document.type
          }
        }
      });
    }
  };

  // Check for expiring documents periodically
  React.useEffect(() => {
    const checkExpiringDocuments = () => {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      providers.forEach(provider => {
        provider.documents.forEach(doc => {
          const expirationDate = new Date(doc.expirationDate);
          if (expirationDate <= thirtyDaysFromNow && doc.status === 'active') {
            notifyDispatch({
              type: 'ADD_NOTIFICATION',
              payload: {
                id: Date.now().toString(),
                type: 'alert',
                title: 'Document Expiring Soon',
                message: `${doc.type} for ${provider.name} expires on ${doc.expirationDate}`,
                timestamp: new Date().toISOString(),
                read: false,
                priority: 'high',
                metadata: {
                  providerId: provider.id,
                  documentId: doc.id,
                  documentType: doc.type
                }
              }
            });
          }
        });
      });
    };

    // Check initially and then every day
    checkExpiringDocuments();
    const interval = setInterval(checkExpiringDocuments, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [providers, notifyDispatch]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Provider Credentials</h2>
          <p className="text-sm text-gray-500">License and certification tracking</p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowAddProvider(true)}
        >
          <Icons.Plus className="w-4 h-4 mr-2" />
          Add Provider
        </Button>
      </div>

      <div className="space-y-4">
        {providers.map((provider) => (
          <div key={provider.id} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium text-gray-900">{provider.name}</p>
                <p className="text-sm text-gray-500">License: {provider.license}</p>
              </div>
              <span className={cn(
                "px-2 py-1 text-xs font-medium rounded-full",
                provider.status === 'active' ? "bg-green-100 text-green-800" :
                provider.status === 'expiring' ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              )}>
                {provider.status === 'expiring' ? 'Expiring Soon' : provider.status}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Icons.Calendar className="w-4 h-4" />
                Expires: {provider.expiration}
              </div>
              <div className="flex items-center gap-2">
                {provider.documents.map((doc) => (
                  <span
                    key={doc.id}
                    className={cn(
                      "px-2 py-1 rounded text-xs",
                      doc.status === 'active' ? "bg-green-100 text-green-800" :
                      doc.status === 'expiring' ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    )}
                  >
                    {doc.type}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="w-32"
                onClick={() => handleUploadDocument(provider.id, 'License')}
              >
                <Icons.FileText className="w-4 h-4 mr-2" />
                Documents
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-32"
                onClick={() => handleRenewDocument(provider.id, provider.documents[0].id)}
              >
                <Icons.RefreshCw className="w-4 h-4 mr-2" />
                Renew
              </Button>
            </div>
          </div>
        ))}
      </div>

      <AddProviderModal
        isOpen={showAddProvider}
        onClose={() => setShowAddProvider(false)}
        onAdd={(newProvider) => {
          setProviders([...providers, {
            id: Date.now().toString(),
            ...newProvider,
            status: 'active',
            documents: newProvider.documents.map(doc => ({
              ...doc,
              id: Date.now().toString(),
              status: 'active'
            }))
          }]);
          setShowAddProvider(false);
        }}
      />
    </motion.div>
  );
};