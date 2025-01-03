import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { IntegrationCard } from './components/IntegrationCard';
import { CategoryFilter } from './components/CategoryFilter';
import { SearchBar } from './components/SearchBar';
import { FeaturedIntegration } from './components/FeaturedIntegration';
import type { Integration, Category } from './types';

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = React.useState<string>('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const categories: Category[] = [
    { id: 'all', name: 'All', icon: 'Grid' },
    {
      id: 'labs',
      name: 'Dental Labs',
      icon: 'Flask',
      subcategories: [
        { id: 'general', name: 'General Services' },
        { id: 'implants', name: 'Implants & Removables' },
        { id: 'cosmetic', name: 'Cosmetic' },
        { id: 'orthodontic', name: 'Orthodontic' }
      ]
    },
    {
      id: 'staffing',
      name: 'Staffing & Recruiting',
      icon: 'Users',
      subcategories: [
        { id: 'permanent', name: 'Permanent Placement' },
        { id: 'temporary', name: 'Temporary Staffing' },
        { id: 'consulting', name: 'HR Consulting' }
      ]
    },
    { id: 'reputation', name: 'Reputation Management', icon: 'Star' },
    { id: 'marketing', name: 'Marketing', icon: 'Megaphone' },
    { id: 'communication', name: 'Communication', icon: 'MessageSquare' },
    { id: 'analytics', name: 'Analytics', icon: 'BarChart2' },
    { id: 'clinical', name: 'Clinical', icon: 'Stethoscope' },
    { id: 'financial', name: 'Financial', icon: 'DollarSign' },
    {
      id: 'misc',
      name: 'Miscellaneous',
      icon: 'MoreHorizontal',
      subcategories: [
        { id: 'consultants', name: 'Consultants' },
        { id: 'legal', name: 'Legal Services' },
        { id: 'accounting', name: 'Accounting' },
        { id: 'it', name: 'IT Services' },
        { id: 'maintenance', name: 'Maintenance' }
      ]
    }
  ];

  const integrations: Integration[] = [
    // Lab integrations
    {
      id: 'haupt-dental-lab',
      name: 'Haupt Dental Lab',
      description: 'Premier dental laboratory specializing in implants and removables',
      category: 'labs',
      subcategory: 'implants',
      icon: '/integration-icons/haupt.png',
      rating: 4.9,
      reviews: 156,
      pricing: 'Custom pricing',
      features: [
        'Full-service dental laboratory',
        'Implant restorations',
        'Removable prosthetics',
        'Digital workflow',
        'Custom shade matching'
      ],
      status: 'available',
      website: 'https://hauptdentallab.com',
      location: 'Minneapolis, MN',
      contact: {
        phone: '(555) 123-4567',
        email: 'info@hauptdentallab.com'
      },
      customAdded: true
    },
    {
      id: '3d-advantage',
      name: '3D Advantage Imaging',
      description: 'Advanced dental imaging and 3D printing solutions',
      category: 'labs',
      subcategory: 'general',
      icon: '/integration-icons/3d-advantage.png',
      rating: 4.8,
      reviews: 89,
      pricing: 'Per case',
      features: [
        '3D printing services',
        'Digital impressions',
        'Model printing',
        'Surgical guides',
        'Quick turnaround'
      ],
      status: 'available',
      website: 'https://3dadvantage.com',
      location: 'San Diego, CA',
      contact: {
        phone: '(555) 234-5678',
        email: 'support@3dadvantage.com'
      },
      customAdded: true
    },
    {
      id: 'integrity-dental',
      name: 'Integrity Dental Lab',
      description: 'Specialized cosmetic dental laboratory',
      category: 'labs',
      subcategory: 'cosmetic',
      icon: '/integration-icons/integrity.png',
      rating: 4.9,
      reviews: 203,
      pricing: 'Custom pricing',
      features: [
        'Cosmetic restorations',
        'Veneers',
        'All-ceramic crowns',
        'Smile design',
        'Shade matching'
      ],
      status: 'available',
      website: 'https://integritydentallab.com',
      location: 'Mission Viejo, CA',
      contact: {
        phone: '(555) 345-6789',
        email: 'info@integritydentallab.com'
      },
      customAdded: true
    },
    {
      id: 'glidewell',
      name: 'Glidewell Dental Lab',
      description: 'Comprehensive dental laboratory services',
      category: 'labs',
      subcategory: 'general',
      icon: '/integration-icons/glidewell.png',
      rating: 4.8,
      reviews: 1250,
      pricing: 'Varies by service',
      features: [
        'Full-service laboratory',
        'Digital dentistry',
        'Custom implants',
        'Crown & bridge',
        'Removables'
      ],
      status: 'available',
      website: 'https://glidewell.com',
      location: 'Newport Beach, CA',
      contact: {
        phone: '(555) 456-7890',
        email: 'support@glidewell.com'
      },
      customAdded: true
    },
    {
      id: 'weave',
      name: 'Weave',
      description: 'All-in-one patient engagement and communication platform',
      category: 'communication',
      icon: '/integration-icons/weave.png',
      rating: 4.9,
      reviews: 892,
      pricing: 'From $199/month',
      features: [
        'Smart Phone System',
        'Two-way Texting',
        'Digital Forms',
        'Payment Processing',
        'Team Chat & Tasks',
        'Reviews & Marketing',
        'Analytics Dashboard'
      ],
      status: 'available',
      featured: true
    },
    {
      id: 'dental-intelligence',
      name: 'Dental Intelligence',
      description: 'Practice analytics and patient engagement platform',
      category: 'analytics',
      icon: '/integration-icons/dental-intelligence.png',
      rating: 4.7,
      reviews: 523,
      pricing: 'Custom pricing',
      features: [
        'Practice analytics',
        'Patient engagement',
        'Team performance',
        'Morning huddle',
        'Patient communication',
        'Performance tracking',
        'Goal setting'
      ],
      status: 'available'
    },
    {
      id: 'birdeye',
      name: 'Birdeye',
      description: 'All-in-one reputation management platform',
      category: 'reputation',
      icon: '/integration-icons/birdeye.png',
      rating: 4.8,
      reviews: 256,
      pricing: 'From $299/month',
      features: [
        'Review management',
        'Patient surveys',
        'Listings management',
        'Referral marketing',
        'Review generation'
      ],
      status: 'available'
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'Marketing automation and CRM',
      category: 'marketing',
      icon: '/integration-icons/hubspot.png',
      rating: 4.7,
      reviews: 412,
      pricing: 'Free - $3200/month',
      features: [
        'Email marketing',
        'Social media management',
        'Lead tracking',
        'Marketing analytics'
      ],
      status: 'installed'
    },
    {
      id: 'solutionreach',
      name: 'Solutionreach',
      description: 'Patient relationship management platform',
      category: 'communication',
      icon: '/integration-icons/solutionreach.png',
      rating: 4.6,
      reviews: 324,
      pricing: 'From $279/month',
      features: [
        'Patient messaging',
        'Appointment reminders',
        'Patient surveys',
        'Recall system',
        'Online scheduling'
      ],
      status: 'available'
    },
    {
      id: 'carecredit',
      name: 'CareCredit',
      description: 'Healthcare financing solutions',
      category: 'financial',
      icon: '/integration-icons/carecredit.png',
      rating: 4.8,
      reviews: 756,
      pricing: 'Transaction-based fees',
      features: [
        'Patient financing options',
        'Instant credit decisions',
        'Promotional financing',
        'Digital card scanning',
        'Provider portal access',
        'Real-time reporting'
      ],
      status: 'available'
    },
    {
      id: 'sunbit',
      name: 'Sunbit',
      description: 'Buy now, pay later financing',
      category: 'financial',
      icon: '/integration-icons/sunbit.png',
      rating: 4.7,
      reviews: 432,
      pricing: 'Transaction-based fees',
      features: [
        'Fast credit decisions',
        'High approval rates',
        'Fair, fixed rates',
        'Flexible payment terms',
        'No hard credit check',
        'Simple application process'
      ],
      status: 'available'
    },
    {
      id: 'lending-club',
      name: 'LendingClub',
      description: 'Patient financing solutions',
      category: 'financial',
      icon: '/integration-icons/lendingclub.png',
      rating: 4.6,
      reviews: 389,
      pricing: 'Transaction-based fees',
      features: [
        'Multiple loan options',
        'Quick credit decisions',
        'Competitive rates',
        'Online application',
        'Direct provider payments',
        'Practice dashboard'
      ],
      status: 'available'
    },
    {
      id: 'wells-fargo',
      name: 'Wells Fargo Health Advantage',
      description: 'Healthcare credit program',
      category: 'financial',
      icon: '/integration-icons/wellsfargo.png',
      rating: 4.5,
      reviews: 467,
      pricing: 'Transaction-based fees',
      features: [
        'Revolving credit lines',
        'Special financing options',
        'Online account management',
        'Mobile payments',
        'Provider portal',
        'Marketing support'
      ],
      status: 'available'
    },
    {
      id: 'cherry',
      name: 'Cherry',
      description: 'Patient financing platform',
      category: 'financial',
      icon: '/integration-icons/cherry.png',
      rating: 4.8,
      reviews: 245,
      pricing: 'Transaction-based fees',
      features: [
        'Instant decisions',
        'High approval rates',
        'No credit impact',
        'Flexible terms',
        'Provider dashboard',
        'Marketing materials'
      ],
      status: 'available'
    },
    {
      id: 'citihealth',
      name: 'CitiHealth Card',
      description: 'Healthcare credit program',
      category: 'financial',
      icon: '/integration-icons/citihealth.png',
      rating: 4.6,
      reviews: 312,
      pricing: 'Transaction-based fees',
      features: [
        'Special financing',
        'Online bill pay',
        'Mobile account access',
        'Provider portal',
        'Marketing support',
        'Dedicated support'
      ],
      status: 'available'
    },
    {
      id: 'quickbooks',
      name: 'QuickBooks',
      description: 'Practice accounting software',
      category: 'financial',
      icon: '/integration-icons/quickbooks.png',
      rating: 4.7,
      reviews: 678,
      pricing: 'From $25/month',
      features: [
        'Accounting',
        'Payroll',
        'Expense tracking',
        'Financial reporting',
        'Tax preparation'
      ],
      status: 'available'
    }
  ];

  const featuredIntegration: Integration = {
    id: 'weave-featured',
    name: 'Weave',
    description: 'All-in-one patient engagement and communication platform',
    category: 'communication',
    icon: '/integration-icons/weave.png',
    rating: 4.9,
    reviews: 892,
    pricing: 'From $199/month',
    features: [
      'Smart Phone System',
      'Two-way Texting',
      'Digital Forms',
      'Payment Processing',
      'Team Chat & Tasks',
      'Reviews & Marketing',
      'Analytics Dashboard'
    ],
    status: 'available',
    featured: true
  };

  const filteredIntegrations = integrations.filter(integration => {
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text">
            Marketplace
          </h1>
          <p className="text-gray-600">Discover and integrate powerful tools for your practice</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsModalOpen(true)}>
            <Icons.Plus className="w-4 h-4 mr-2" />
            Add Vendor
          </Button>
          <Button>
          <Icons.Plus className="w-4 h-4 mr-2" />
          Request Integration
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <Button variant="outline">
          <Icons.Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="space-y-4">
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
        
        {selectedCategory !== 'all' && 
         categories.find(c => c.id === selectedCategory)?.subcategories && (
          <div className="flex gap-2 ml-4">
            {categories
              .find(c => c.id === selectedCategory)
              ?.subcategories?.map(sub => (
                <Button
                  key={sub.id}
                  variant={selectedSubcategory === sub.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSubcategory(sub.id)}
                >
                  {sub.name}
                </Button>
              ))}
          </div>
        )}
      </div>

      {selectedCategory === 'all' && (
        <FeaturedIntegration integration={featuredIntegration} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map(integration => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
          />
        ))}
      </div>

      <div className="flex justify-center">
        <Button variant="outline" className="w-full max-w-xs">
          Load More
        </Button>
      </div>
    </div>
  );
};

export default Marketplace;