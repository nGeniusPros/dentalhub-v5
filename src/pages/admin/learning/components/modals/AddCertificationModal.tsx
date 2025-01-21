```typescript
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { cn } from '../../../../../lib/utils';
import type { Certification } from '../../../../../types/learning';

interface AddCertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (certification: Certification) => void;
}

export const AddCertificationModal: React.FC<AddCertificationModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [certification, setCertification] = useState<Partial<Certification>>({
    name: '',
    issuer: '',
    description: '',
    skills: [],
    requirements: [],
    status: 'active'
  });

  const [currentSkill, setCurrentSkill] = useState('');
  const [currentRequirement, setCurrentRequirement] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (certification.name && certification.description) {
      onAdd({
        ...certification,
        id: Date.now().toString(),
        earnedDate: new Date().toISOString(),
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        skills: certification.skills || [],
        requirements: certification.requirements || [],
        credentialId: `CERT-${Date.now()}`
      } as Certification);
      onClose();
    }
  };

  const handleAddSkill = () => {
    if (currentSkill.trim()) {
      setCertification(prev => ({
        ...prev,
        skills: [...(prev.skills || []), currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  const handleAddRequirement = () => {
    if (currentRequirement.trim()) {
      setCertification(prev => ({
        ...prev,
        requirements: [...(prev.requirements || []), currentRequirement.trim()]
      }));
      setCurrentRequirement('');
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
            <h2 className="text-xl font-semibold">Create New Certification</h2>
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
                Certification Name
              </label>
              <input
                type="text"
                value={certification.name}
                onChange={(e) => setCertification({ ...certification, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={certification.description}
                onChange={(e) => setCertification({ ...certification, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issuing Organization
              </label>
              <input
                type="text"
                value={certification.issuer}
                onChange={(e) => setCertification({ ...certification, issuer: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Validation URL
              </label>
              <input
                type="url"
                value={certification.validationUrl}
                onChange={(e) => setCertification({ ...certification, validationUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                placeholder="https://"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills & Competencies
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="Enter skill..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddSkill}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {certification.skills?.map((skill, index) => (
                  <div
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => setCertification({
                        ...certification,
                        skills: certification.skills?.filter((_, i) => i !== index)
                      })}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Icons.X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentRequirement}
                  onChange={(e) => setCurrentRequirement(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="Enter requirement..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddRequirement();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddRequirement}>
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {certification.requirements?.map((requirement, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm">{requirement}</span>
                    <button
                      type="button"
                      onClick={() => setCertification({
                        ...certification,
                        requirements: certification.requirements?.filter((_, i) => i !== index)
                      })}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate Template
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
              <div className="flex flex-col items-center">
                <Icons.Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  Drag and drop an image here, or click to browse
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Handle file upload
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setCertification({
                          ...certification,
                          thumbnail: reader.result as string
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <Button type="button" variant="outline" className="mt-2">
                  Browse Files
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!certification.name || !certification.description}
            >
              Create Certification
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
```