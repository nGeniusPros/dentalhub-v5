import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { FormTypeSelector } from './FormTypeSelector';

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (resource: any) => void;
}

export const AddResourceModal: React.FC<AddResourceModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [resource, setResource] = useState({
    title: '',
    description: '',
    category: '',
    formType: '',
    section: '',
    type: 'internal',
    url: '',
    file: null as File | null,
    metadata: {
      version: '1.0',
      status: 'draft',
      approvalRequired: false,
      workflow: [] as string[],
      permissions: [] as string[],
      tags: [] as string[],
      expirationDate: '',
      reviewDate: '',
      department: '',
      language: 'en'
    }
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(resource);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-lg"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Add New Resource</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={resource.title}
              onChange={(e) => setResource({ ...resource, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={resource.description}
              onChange={(e) => setResource({ ...resource, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={resource.category}
                onChange={(e) => setResource({ ...resource, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              >
                <option value="">Select category...</option>
                <option value="clinical">Clinical Forms</option>
                <option value="administrative">Administrative Forms</option>
                <option value="hr">HR Forms</option>
                <option value="compliance">Compliance Forms</option>
                <option value="patient-education">Patient Education</option>
                <option value="provider">Provider Forms</option>
                <option value="financial">Financial Forms</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section
              </label>
              <select
                value={resource.section}
                onChange={(e) => setResource({ ...resource, section: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              >
                <option value="">Select section...</option>
                {resource.category === 'forms' && (
                  <>
                    <option value="hr">HR Forms</option>
                    <option value="clinical">Clinical Forms</option>
                    <option value="administrative">Administrative Forms</option>
                  </>
                )}
                {resource.category === 'education' && (
                  <>
                    <option value="clinical">Clinical Resources</option>
                    <option value="administrative">Administrative Resources</option>
                  </>
                )}
                {resource.category === 'manuals' && (
                  <>
                    <option value="staff">Staff Manuals</option>
                    <option value="provider">Provider Manuals</option>
                    <option value="compliance">Compliance Guides</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {resource.category && (
            <div>
              <FormTypeSelector
                selectedType={resource.formType}
                onTypeChange={(type) => setResource({ ...resource, formType: type })}
                category={resource.category}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input
                type="text"
                value={resource.metadata.department}
                onChange={(e) => setResource({
                  ...resource,
                  metadata: { ...resource.metadata, department: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                value={resource.metadata.language}
                onChange={(e) => setResource({
                  ...resource,
                  metadata: { ...resource.metadata, language: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resource Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={resource.type === 'internal'}
                  onChange={() => setResource({ ...resource, type: 'internal', url: '' })}
                  className="rounded border-gray-300"
                />
                <span>Upload File</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={resource.type === 'external'}
                  onChange={() => setResource({ ...resource, type: 'external', file: null })}
                  className="rounded border-gray-300"
                />
                <span>External Link</span>
              </label>
            </div>
          </div>

          {resource.type === 'external' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <input
                type="url"
                value={resource.url}
                onChange={(e) => setResource({ ...resource, url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                placeholder="https://"
                required={resource.type === 'external'}
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File
              </label>
              <input
                type="file"
                onChange={(e) => setResource({ ...resource, file: e.target.files?.[0] || null })}
                className="w-full"
                required={resource.type === 'internal'}
              />
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {resource.metadata.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => setResource({
                        ...resource,
                        metadata: {
                          ...resource.metadata,
                          tags: resource.metadata.tags.filter((_, i) => i !== index)
                        }
                      })}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Icons.X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="Add tag..."
                  className="px-3 py-1 border border-gray-200 rounded-full text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const value = (e.target as HTMLInputElement).value.trim();
                      if (value && !resource.metadata.tags.includes(value)) {
                        setResource({
                          ...resource,
                          metadata: {
                            ...resource.metadata,
                            tags: [...resource.metadata.tags, value]
                          }
                        });
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Review Date
                </label>
                <input
                  type="date"
                  value={resource.metadata.reviewDate}
                  onChange={(e) => setResource({
                    ...resource,
                    metadata: { ...resource.metadata, reviewDate: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiration Date
                </label>
                <input
                  type="date"
                  value={resource.metadata.expirationDate}
                  onChange={(e) => setResource({
                    ...resource,
                    metadata: { ...resource.metadata, expirationDate: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={resource.metadata.approvalRequired}
                  onChange={(e) => setResource({
                    ...resource,
                    metadata: { ...resource.metadata, approvalRequired: e.target.checked }
                  })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Requires Approval</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Resource
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};