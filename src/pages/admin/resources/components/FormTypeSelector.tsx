import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { cn } from '../../../../lib/utils';

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
  // Comprehensive form types organized by category
  const formTypes = {
    'clinical': [
      { id: 'medical-history', name: 'Medical History Form', icon: 'ClipboardList' },
      { id: 'treatment-consent', name: 'Treatment Consent', icon: 'FileCheck' },
      { id: 'health-questionnaire', name: 'Health Questionnaire', icon: 'FileQuestion' },
      { id: 'post-op-instructions', name: 'Post-Op Instructions', icon: 'FileText' },
      { id: 'prescription', name: 'Prescription Form', icon: 'Pill' },
      { id: 'referral', name: 'Referral Form', icon: 'Forward' },
      { id: 'xray-consent', name: 'X-Ray Consent', icon: 'Radio' },
      { id: 'treatment-plan', name: 'Treatment Plan', icon: 'ClipboardCheck' }
    ],
    'administrative': [
      { id: 'registration', name: 'Patient Registration', icon: 'UserPlus' },
      { id: 'insurance-verification', name: 'Insurance Verification', icon: 'Shield' },
      { id: 'financial-agreement', name: 'Financial Agreement', icon: 'DollarSign' },
      { id: 'hipaa', name: 'HIPAA Consent', icon: 'Lock' },
      { id: 'records-release', name: 'Records Release', icon: 'FileOutput' },
      { id: 'appointment', name: 'Appointment Forms', icon: 'Calendar' },
      { id: 'payment-plan', name: 'Payment Plan Agreement', icon: 'CreditCard' }
    ],
    'hr': [
      { id: 'employment', name: 'Employment Application', icon: 'Briefcase' },
      { id: 'onboarding', name: 'Onboarding Checklist', icon: 'ListChecks' },
      { id: 'benefits', name: 'Benefits Enrollment', icon: 'Heart' },
      { id: 'performance-review', name: 'Performance Review', icon: 'BarChart2' },
      { id: 'time-off', name: 'Time Off Request', icon: 'Calendar' },
      { id: 'incident-report', name: 'Incident Report', icon: 'AlertTriangle' },
      { id: 'training', name: 'Training Documentation', icon: 'GraduationCap' }
    ],
    'compliance': [
      { id: 'osha', name: 'OSHA Compliance', icon: 'Shield' },
      { id: 'hipaa-training', name: 'HIPAA Training', icon: 'FileShield' },
      { id: 'safety-checklist', name: 'Safety Checklist', icon: 'CheckSquare' },
      { id: 'infection-control', name: 'Infection Control', icon: 'Thermometer' },
      { id: 'emergency-protocol', name: 'Emergency Protocol', icon: 'Siren' },
      { id: 'audit', name: 'Audit Forms', icon: 'ClipboardCheck' }
    ],
    'patient-education': [
      { id: 'post-care', name: 'Post-Care Instructions', icon: 'FileText' },
      { id: 'treatment-info', name: 'Treatment Information', icon: 'FileInfo' },
      { id: 'hygiene', name: 'Oral Hygiene Guide', icon: 'Smile' },
      { id: 'nutrition', name: 'Nutrition Guidelines', icon: 'Apple' },
      { id: 'preventive-care', name: 'Preventive Care', icon: 'Shield' }
    ],
    'provider': [
      { id: 'credentialing', name: 'Credentialing Forms', icon: 'FileCheck' },
      { id: 'privileges', name: 'Privileges Request', icon: 'Key' },
      { id: 'peer-review', name: 'Peer Review', icon: 'Users' },
      { id: 'quality-assurance', name: 'Quality Assurance', icon: 'CheckCircle' },
      { id: 'lab-requisition', name: 'Lab Requisition', icon: 'Flask' }
    ],
    'financial': [
      { id: 'insurance-claim', name: 'Insurance Claim', icon: 'FileText' },
      { id: 'superbill', name: 'Superbill', icon: 'Receipt' },
      { id: 'fee-schedule', name: 'Fee Schedule', icon: 'DollarSign' },
      { id: 'financial-policy', name: 'Financial Policy', icon: 'FileText' },
      { id: 'payment-authorization', name: 'Payment Authorization', icon: 'CreditCard' }
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