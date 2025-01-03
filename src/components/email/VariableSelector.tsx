import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../ui/button';

interface Variable {
  name: string;
  description: string;
  category: string;
  example: string;
}

interface VariableSelectorProps {
  onSelect: (variable: Variable) => void;
}

const variables: Variable[] = [
  {
    name: '{{patient.firstName}}',
    description: 'Patient\'s first name',
    category: 'Patient Info',
    example: 'John'
  },
  {
    name: '{{patient.lastName}}',
    description: 'Patient\'s last name',
    category: 'Patient Info',
    example: 'Smith'
  },
  {
    name: '{{appointment.date}}',
    description: 'Next appointment date',
    category: 'Appointments',
    example: 'March 15, 2024'
  },
  {
    name: '{{appointment.time}}',
    description: 'Next appointment time',
    category: 'Appointments',
    example: '2:30 PM'
  },
  {
    name: '{{practice.name}}',
    description: 'Practice name',
    category: 'Practice Info',
    example: 'NGenius Dental'
  },
  {
    name: '{{practice.phone}}',
    description: 'Practice phone number',
    category: 'Practice Info',
    example: '(555) 123-4567'
  },
  {
    name: '{{practice.address}}',
    description: 'Practice address',
    category: 'Practice Info',
    example: '123 Main St, Suite 100'
  },
  {
    name: '{{treatment.name}}',
    description: 'Treatment name',
    category: 'Treatment',
    example: 'Dental Cleaning'
  },
  {
    name: '{{treatment.cost}}',
    description: 'Treatment cost',
    category: 'Treatment',
    example: '$150'
  }
];

export const VariableSelector: React.FC<VariableSelectorProps> = ({ onSelect }) => {
  const categories = Array.from(new Set(variables.map(v => v.category)));

  return (
    <div className="p-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Insert Variable</h3>
        <p className="text-sm text-gray-500">
          Select a variable to insert into your email
        </p>
      </div>

      <div className="space-y-6">
        {categories.map(category => (
          <div key={category}>
            <h4 className="text-sm font-medium text-gray-700 mb-2">{category}</h4>
            <div className="space-y-2">
              {variables
                .filter(v => v.category === category)
                .map(variable => (
                  <motion.button
                    key={variable.name}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => onSelect(variable)}
                    className="w-full p-3 text-left bg-white rounded-lg border border-gray-200 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{variable.name}</p>
                        <p className="text-sm text-gray-500">{variable.description}</p>
                      </div>
                      <div className="text-sm text-gray-400">
                        Example: {variable.example}
                      </div>
                    </div>
                  </motion.button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};