import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../ui/button';
import { TemplateBuilder } from './TemplateBuilder';
import { cn } from '../../lib/utils';
import type { EmailTemplate } from '../../types/email';

interface TemplateGalleryProps {
  templates: EmailTemplate[];
  onSelect: (template: EmailTemplate) => void;
}

const defaultTemplates: EmailTemplate[] = [
  {
    id: 'recall-1',
    name: 'Standard Recall',
    type: 'recall',
    thumbnail: 'https://images.unsplash.com/photo-1588776814546-daab30f310ce?auto=format&fit=crop&q=80&w=400',
    content: '',
    category: 'Recall',
    tags: ['recall', 'checkup', 'cleaning'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'birthday-1',
    name: 'Birthday Celebration',
    type: 'birthday',
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=400',
    content: '',
    category: 'Special Events',
    tags: ['birthday', 'celebration', 'special offer'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'newsletter-1',
    name: 'Monthly Newsletter',
    type: 'newsletter',
    thumbnail: 'https://images.unsplash.com/photo-1586339949216-35c2747cc36d?auto=format&fit=crop&q=80&w=400',
    content: '',
    category: 'Newsletters',
    tags: ['newsletter', 'updates', 'news'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'event-1',
    name: 'Practice Event',
    type: 'event',
    thumbnail: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&q=80&w=400',
    content: '',
    category: 'Events',
    tags: ['event', 'special', 'community'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'reactivation-1',
    name: 'Patient Reactivation',
    type: 'reactivation',
    thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400',
    content: '',
    category: 'Reactivation',
    tags: ['reactivation', 'welcome back', 'special offer'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'referral-1',
    name: 'Referral Request',
    type: 'referral',
    thumbnail: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=400',
    content: '',
    category: 'Referrals',
    tags: ['referral', 'rewards', 'growth'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  templates,
  onSelect
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  const allTemplates = [...defaultTemplates, ...templates];
  const categories = Array.from(new Set(allTemplates.map(t => t.category)));

  const filteredTemplates = allTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-1">
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
          />
        </div>
        <Button 
          variant="outline" 
          onClick={() => onSelect({
            id: Date.now().toString(),
            name: 'Custom Template',
            type: 'custom',
            content: '',
            category: 'Custom',
            tags: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })}
        >
          <Icons.Plus className="w-4 h-4 mr-2" />
          Create Custom
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('all')}
        >
          All Templates
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <motion.div
            key={template.id}
            whileHover={{ scale: 1.02 }}
            className={cn(
              "bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden",
              "hover:shadow-xl transition-all duration-200"
            )}
          >
            {template.thumbnail ? (
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                <Icons.Mail className="w-12 h-12 text-gray-400" />
              </div>
            )}
            <div className="p-6">
              <h3 className="font-medium text-gray-900 mb-2">{template.name}</h3>
              <div className="flex gap-2 mt-2">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Button
                onClick={() => onSelect(template)}
                className="w-full mt-6"
              >
                <Icons.Edit3 className="w-4 h-4 mr-2" />
                Use Template
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};