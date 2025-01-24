import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { cn } from '../../../../../lib/utils';
import { AddDocumentModal } from '../documents/AddDocumentModal';
import { useNotifications } from '../../../../../contexts/NotificationContext';
import { UploadDocumentModal } from '../documents/UploadDocumentModal';

export const DocumentsTab = () => {
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { dispatch: notifyDispatch } = useNotifications();

  const documents = [
    {
      id: '1',
      name: 'Employee Handbook',
      type: 'PDF',
      lastUpdated: '2024-03-01',
      category: 'Policies',
      status: 'active'
    },
    {
      id: '2',
      name: 'HIPAA Training Certificate',
      type: 'PDF',
      lastUpdated: '2024-02-15',
      category: 'Certifications',
      status: 'expiring'
    },
    {
      id: '3',
      name: 'Performance Review Template',
      type: 'DOCX',
      lastUpdated: '2024-02-01',
      category: 'Forms',
      status: 'active'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Document Management</h2>
          <p className="text-sm text-gray-500">Manage staff documents and forms</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowUploadModal(true)}>
            <Icons.Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
          <Button onClick={() => setShowAddDocument(true)}>
            <Icons.Plus className="w-4 h-4 mr-2" />
            New Document
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {documents.map((doc) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icons.FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{doc.name}</h3>
                  <p className="text-sm text-gray-500">
                    Last updated: {doc.lastUpdated}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={cn(
                  "px-2 py-1 text-xs font-medium rounded-full",
                  doc.status === 'active' && "bg-green-100 text-green-800",
                  doc.status === 'expiring' && "bg-yellow-100 text-yellow-800",
                  doc.status === 'expired' && "bg-red-100 text-red-800"
                )}>
                  {doc.status}
                </span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Icons.Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Icons.Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Icons.Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AddDocumentModal
        isOpen={showAddDocument}
        onClose={() => setShowAddDocument(false)}
        onAdd={(document) => {
          console.log('New document:', document);
          notifyDispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
              id: Date.now().toString(),
              type: 'message',
              title: 'Document Added',
              message: `${document.name} has been added successfully`,
              timestamp: new Date().toISOString(),
              read: false,
              priority: 'medium'
            }
          });
        }}
      />
      
      <UploadDocumentModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={(files) => {
          console.log('Uploaded files:', files);
          notifyDispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
              id: Date.now().toString(),
              type: 'message',
              title: 'Files Uploaded',
              message: `${files.length} files have been uploaded successfully`,
              timestamp: new Date().toISOString(),
              read: false,
              priority: 'medium'
            }
          });
        }}
      />
    </div>
  );
};