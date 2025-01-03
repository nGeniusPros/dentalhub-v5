import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { cn } from '../../lib/utils';

interface FormTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
  category: string;
}

export const FormTypeSelector: React.FC<FormTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
  category
}) => {
  // Form types organized by category
  const formTypes = {
    'clinical': [
      { id: 'medical-history', name: 'Medical History Form', icon: 'ClipboardList' },
      { id: 'treatment-consent', name: 'Treatment Consent', icon: 'FileCheck' },
      { id: 'health-questionnaire', name: 'Health Questionnaire', icon: 'FileQuestion' },
      { id: 'post-op-instructions', name: 'Post-Op Instructions', icon: 'FileText' }
    ],
    'administrative': [
      { id: 'registration', name: 'Patient Registration', icon: 'UserPlus' },
      { id: 'insurance-verification', name: 'Insurance Verification', icon: 'Shield' },
      { id: 'financial-agreement', name: 'Financial Agreement', icon: 'DollarSign' },
      { id: 'hipaa', name: 'HIPAA Consent', icon: 'Lock' }
    ],
    'training': [
      { id: 'onboarding', name: 'Onboarding Checklist', icon: 'ListChecks' },
      { id: 'safety-training', name: 'Safety Training', icon: 'Shield' },
      { id: 'compliance-training', name: 'Compliance Training', icon: 'FileCheck' },
      { id: 'skills-assessment', name: 'Skills Assessment', icon: 'CheckSquare' }
    ]
  };

  const currentTypes = formTypes[category as keyof typeof formTypes] || [];

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Select Form Type</h3>
      <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2">
        {currentTypes.map((type) => {
          const Icon = Icons[type.icon as keyof typeof Icons];
          return (
            <button
              key={type.id}
              onClick={() => onTypeChange(type.id)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                selectedType === type.id
                  ? "bg-primary text-white"
                  : "bg-gray-50 hover:bg-gray-100"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{type.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};