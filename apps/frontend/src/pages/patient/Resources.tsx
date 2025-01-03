import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

const Resources = () => {
  const forms = [
    {
      id: 1,
      name: 'New Patient Registration',
      type: 'PDF',
      lastUpdated: '2024-02-15',
      required: true
    },
    {
      id: 2,
      name: 'Medical History Form',
      type: 'PDF',
      lastUpdated: '2024-02-15',
      required: true
    },
    {
      id: 3,
      name: 'Insurance Information',
      type: 'PDF',
      lastUpdated: '2024-02-15',
      required: true
    },
    {
      id: 4,
      name: 'HIPAA Consent Form',
      type: 'PDF',
      lastUpdated: '2024-02-15',
      required: true
    }
  ];

  const educationalResources = [
    {
      id: 1,
      title: 'Oral Hygiene Guide',
      description: 'Learn proper brushing and flossing techniques',
      type: 'Video',
      duration: '5 mins'
    },
    {
      id: 2,
      title: 'Post-Treatment Care',
      description: 'Instructions for after dental procedures',
      type: 'PDF',
      pages: 2
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Resources</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <h2 className="text-lg font-semibold mb-4">Required Forms</h2>
        <div className="space-y-4">
          {forms.map((form) => (
            <div
              key={form.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Icons.FileText className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium">{form.name}</p>
                  <p className="text-sm text-gray-500">
                    Last updated: {form.lastUpdated}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {form.required && (
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    Required
                  </span>
                )}
                <button className="px-4 py-2 text-sm text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <h2 className="text-lg font-semibold mb-4">Educational Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {educationalResources.map((resource) => (
            <div
              key={resource.id}
              className="p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3 mb-2">
                {resource.type === 'Video' ? (
                  <Icons.Video className="w-5 h-5 text-primary-600" />
                ) : (
                  <Icons.FileText className="w-5 h-5 text-primary-600" />
                )}
                <h3 className="font-medium">{resource.title}</h3>
              </div>
              <p className="text-sm text-gray-500 mb-3">{resource.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {resource.type === 'Video' ? `Duration: ${resource.duration}` : `${resource.pages} pages`}
                </span>
                <button className="px-3 py-1 text-sm text-primary-600 hover:text-primary-700">
                  View Resource →
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Resources;