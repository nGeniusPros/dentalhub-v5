import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { cn } from '../../../../../lib/utils';
import { useNotifications } from '../../../../../contexts/NotificationContext';

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (document: any) => void;
}

export const AddDocumentModal: React.FC<AddDocumentModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const { dispatch: notifyDispatch } = useNotifications();
  const [document, setDocument] = useState({
    name: '',
    description: '',
    category: '',
    type: 'policy',
    status: 'active',
    file: null as File | null,
    metadata: {
      version: '1.0',
      department: '',
      approvalRequired: false,
      reviewDate: '',
      expirationDate: '',
      tags: [] as string[],
      assignedTo: [] as string[],
      workflow: [] as string[]
    }
  });

  const [currentTag, setCurrentTag] = useState('');
  const [currentAssignee, setCurrentAssignee] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!document.file && document.type !== 'template') {
      notifyDispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now().toString(),
          type: 'alert',
          title: 'File Required',
          message: 'Please upload a document file to continue.',
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'medium'
        }
      });
      return;
    }

    const newDocument = {
      ...document,
      id: Date.now().toString(),
      uploadDate: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    onAdd(newDocument);
    onClose();

    notifyDispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        type: 'message',
        title: 'Document Added',
        message: `${document.name} has been added successfully.`,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'medium'
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocument({ ...document, file });
    }
  };

  const handleAddTag = () => {
    if (currentTag && !document.metadata.tags.includes(currentTag)) {
      setDocument({
        ...document,
        metadata: {
          ...document.metadata,
          tags: [...document.metadata.tags, currentTag]
        }
      });
      setCurrentTag('');
    }
  };

  const handleAddAssignee = () => {
    if (currentAssignee && !document.metadata.assignedTo.includes(currentAssignee)) {
      setDocument({
        ...document,
        metadata: {
          ...document.metadata,
          assignedTo: [...document.metadata.assignedTo, currentAssignee]
        }
      });
      setCurrentAssignee('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Add New Document</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Name
              </label>
              <input
                type="text"
                value={document.name}
                onChange={(e) => setDocument({ ...document, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={document.description}
                onChange={(e) => setDocument({ ...document, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={document.category}
                onChange={(e) => setDocument({ ...document, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              >
                <option value="">Select category...</option>
                <option value="policies">Policies & Procedures</option>
                <option value="forms">Forms</option>
                <option value="training">Training Materials</option>
                <option value="hr">HR Documents</option>
                <option value="compliance">Compliance</option>
                <option value="templates">Templates</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Type
              </label>
              <select
                value={document.type}
                onChange={(e) => setDocument({ ...document, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              >
                <option value="policy">Policy</option>
                <option value="procedure">Procedure</option>
                <option value="form">Form</option>
                <option value="template">Template</option>
                <option value="guide">Guide</option>
                <option value="manual">Manual</option>
              </select>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Document
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
              <div className="flex flex-col items-center">
                <Icons.Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">
                  Drag and drop your file here, or click to browse
                </p>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Browse Files
                </Button>
                {document.file && (
                  <div className="mt-4 flex items-center gap-2">
                    <Icons.FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{document.file.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Document Metadata</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Department
                </label>
                <select
                  value={document.metadata.department}
                  onChange={(e) => setDocument({
                    ...document,
                    metadata: { ...document.metadata, department: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="">Select department...</option>
                  <option value="clinical">Clinical</option>
                  <option value="administrative">Administrative</option>
                  <option value="management">Management</option>
                  <option value="all">All Departments</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Version
                </label>
                <input
                  type="text"
                  value={document.metadata.version}
                  onChange={(e) => setDocument({
                    ...document,
                    metadata: { ...document.metadata, version: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="e.g., 1.0"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Review Date
                </label>
                <input
                  type="date"
                  value={document.metadata.reviewDate}
                  onChange={(e) => setDocument({
                    ...document,
                    metadata: { ...document.metadata, reviewDate: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Expiration Date
                </label>
                <input
                  type="date"
                  value={document.metadata.expirationDate}
                  onChange={(e) => setDocument({
                    ...document,
                    metadata: { ...document.metadata, expirationDate: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {document.metadata.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => setDocument({
                        ...document,
                        metadata: {
                          ...document.metadata,
                          tags: document.metadata.tags.filter((_, i) => i !== index)
                        }
                      })}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Icons.X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="Add tag..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTag}>
                  Add
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Assign To
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {document.metadata.assignedTo.map((assignee, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1"
                  >
                    {assignee}
                    <button
                      type="button"
                      onClick={() => setDocument({
                        ...document,
                        metadata: {
                          ...document.metadata,
                          assignedTo: document.metadata.assignedTo.filter((_, i) => i !== index)
                        }
                      })}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Icons.X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentAssignee}
                  onChange={(e) => setCurrentAssignee(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="Add assignee..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddAssignee();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddAssignee}>
                  Add
                </Button>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={document.metadata.approvalRequired}
                  onChange={(e) => setDocument({
                    ...document,
                    metadata: {
                      ...document.metadata,
                      approvalRequired: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Requires Approval</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!document.name || !document.description || (!document.file && document.type !== 'template')}
            >
              Add Document
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};