import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { JobBoardIntegration } from './JobBoardIntegration';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jobData: any) => void;
}

export const PostJobModal: React.FC<PostJobModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [jobData, setJobData] = useState({
    position: '',
    department: '',
    type: 'full-time',
    experience: '',
    salary: { min: '', max: '' },
    requirements: [''],
    responsibilities: [''],
    benefits: [''],
    startDate: '',
    location: '',
    description: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...jobData,
      requirements: jobData.requirements.filter(Boolean),
      responsibilities: jobData.responsibilities.filter(Boolean),
      benefits: jobData.benefits.filter(Boolean)
    });
  };

  const handleArrayInput = (
    field: 'requirements' | 'responsibilities' | 'benefits',
    index: number,
    value: string
  ) => {
    const newArray = [...jobData[field]];
    newArray[index] = value;
    setJobData({ ...jobData, [field]: newArray });
  };

  const addArrayItem = (field: 'requirements' | 'responsibilities' | 'benefits') => {
    setJobData({ ...jobData, [field]: [...jobData[field], ''] });
  };

  const removeArrayItem = (field: 'requirements' | 'responsibilities' | 'benefits', index: number) => {
    const newArray = jobData[field].filter((_, i) => i !== index);
    setJobData({ ...jobData, [field]: newArray });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Post New Job Opening</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Job Board Integration Section */}
        <div className="border-t border-gray-200 mt-6 pt-6">
          <JobBoardIntegration />
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position Title
              </label>
              <input
                type="text"
                value={jobData.position}
                onChange={(e) => setJobData({ ...jobData, position: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input
                type="text"
                value={jobData.department}
                onChange={(e) => setJobData({ ...jobData, department: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employment Type
              </label>
              <select
                value={jobData.type}
                onChange={(e) => setJobData({ ...jobData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              >
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="temporary">Temporary</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience Level
              </label>
              <input
                type="text"
                value={jobData.experience}
                onChange={(e) => setJobData({ ...jobData, experience: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                placeholder="e.g., 3-5 years"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salary Range (Min)
              </label>
              <input
                type="number"
                value={jobData.salary.min}
                onChange={(e) => setJobData({
                  ...jobData,
                  salary: { ...jobData.salary, min: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                placeholder="Minimum salary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salary Range (Max)
              </label>
              <input
                type="number"
                value={jobData.salary.max}
                onChange={(e) => setJobData({
                  ...jobData,
                  salary: { ...jobData.salary, max: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                placeholder="Maximum salary"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description
            </label>
            <textarea
              value={jobData.description}
              onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              rows={4}
              required
            />
          </div>

          {/* Requirements Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Requirements
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('requirements')}
              >
                <Icons.Plus className="w-4 h-4 mr-2" />
                Add Requirement
              </Button>
            </div>
            <div className="space-y-2">
              {jobData.requirements.map((req, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => handleArrayInput('requirements', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="Enter requirement..."
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeArrayItem('requirements', index)}
                  >
                    <Icons.X className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Responsibilities Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Responsibilities
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('responsibilities')}
              >
                <Icons.Plus className="w-4 h-4 mr-2" />
                Add Responsibility
              </Button>
            </div>
            <div className="space-y-2">
              {jobData.responsibilities.map((resp, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={resp}
                    onChange={(e) => handleArrayInput('responsibilities', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="Enter responsibility..."
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeArrayItem('responsibilities', index)}
                  >
                    <Icons.X className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Benefits
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('benefits')}
              >
                <Icons.Plus className="w-4 h-4 mr-2" />
                Add Benefit
              </Button>
            </div>
            <div className="space-y-2">
              {jobData.benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => handleArrayInput('benefits', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="Enter benefit..."
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeArrayItem('benefits', index)}
                  >
                    <Icons.X className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={jobData.startDate}
                onChange={(e) => setJobData({ ...jobData, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={jobData.location}
                onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                placeholder="e.g., New York, NY"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Post Job
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};