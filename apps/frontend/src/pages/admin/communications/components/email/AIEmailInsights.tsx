import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';

export const AIEmailInsights = () => {
  const insights = [
    {
      title: 'Engagement Optimization',
      description: 'Based on open rates, sending emails between 9-11am shows 25% higher engagement.',
      icon: 'Zap',
      action: 'Adjust sending schedule'
    },
    {
      title: 'Content Analysis',
      description: 'Emails with personalized subject lines have 35% higher open rates.',
      icon: 'FileText',
      action: 'Review templates'
    },
    {
      title: 'Audience Segmentation',
      description: 'Targeted campaigns show 40% better click-through rates than general broadcasts.',
      icon: 'Users',
      action: 'Refine segments'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icons.Brain className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">AI-Powered Insights</h2>
            <p className="text-sm text-gray-500">Real-time recommendations for campaign optimization</p>
          </div>
        </div>
        <Button 
          variant="outline"
          onClick={() => {
            // Simulate refresh with loading state
            const button = document.querySelector('#refresh-analysis-btn');
            if (button) {
              button.classList.add('animate-spin');
              setTimeout(() => {
                button.classList.remove('animate-spin');
              }, 1500);
            }
          }}
        >
          <Icons.RefreshCw className="w-4 h-4 mr-2" />
          Refresh Analysis
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              {React.createElement(Icons[insight.icon as keyof typeof Icons], {
                className: "w-5 h-5 text-primary"
              })}
              <h3 className="font-medium text-gray-900">{insight.title}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">{insight.description}</p>
            <Button variant="outline" size="sm" className="w-full">
              {insight.action}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};