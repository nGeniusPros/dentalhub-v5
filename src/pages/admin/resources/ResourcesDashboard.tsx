import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useNotifications } from '../../../contexts/NotificationContext';
import { AddResourceModal } from './components/AddResourceModal';
import { UploadResourceModal } from './components/UploadResourceModal';
import { ResourceSearch } from './components/ResourceSearch';
import { ResourceGrid } from './components/ResourceGrid';
import { ResourceFilters } from './components/ResourceFilters';
import { ResourceStats } from './components/ResourceStats';
import { ResourceCategories } from './components/ResourceCategories';
import { LearningCenterIntegration } from './components/LearningCenterIntegration';

const ResourcesDashboard = () => {
  const [showAddResource, setShowAddResource] = useState(false);
  const [showUploadResource, setShowUploadResource] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const { dispatch: notifyDispatch } = useNotifications();

  const handleAddResource = (resource: any) => {
    console.log('Adding resource:', resource);
    notifyDispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        type: 'message',
        title: 'Resource Added',
        message: `${resource.title} has been added to the resources library`,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'medium'
      }
    });
  };

  const handleUploadResource = (files: FileList) => {
    console.log('Uploading files:', files);
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
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text">
            Resources & Learning Center
          </h1>
          <p className="text-gray-600">Access forms, educational materials, training resources, and learning modules</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => setShowUploadResource(true)}
          >
            <Icons.Upload className="w-4 h-4 mr-2" />
            Upload Resource
          </Button>
          <Button onClick={() => setShowAddResource(true)}>
            <Icons.Plus className="w-4 h-4 mr-2" />
            Add Resource
          </Button>
        </div>
      </div>

      <ResourceStats />

      <div className="flex gap-4">
        <div className="flex-1">
          <ResourceSearch value={searchQuery} onChange={setSearchQuery} />
        </div>
        <ResourceFilters
          selectedFilters={selectedFilters}
          onFilterChange={setSelectedFilters}
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <ResourceCategories
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          <div className="mt-6">
            <LearningCenterIntegration />
          </div>
        </div>

        <div className="col-span-9">
          <ResourceGrid
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            selectedFilters={selectedFilters}
          />
        </div>
      </div>

      <AddResourceModal
        isOpen={showAddResource}
        onClose={() => setShowAddResource(false)}
        onAdd={handleAddResource}
      />

      <UploadResourceModal
        isOpen={showUploadResource}
        onClose={() => setShowUploadResource(false)}
        onUpload={handleUploadResource}
      />
    </div>
  );
};

export default ResourcesDashboard;