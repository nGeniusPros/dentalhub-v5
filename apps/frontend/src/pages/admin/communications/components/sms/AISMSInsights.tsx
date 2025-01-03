import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';

export const AISMSInsights = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [insights] = useState([
    {
      title: 'Engagement Optimization',
      description: 'Based on response rates, sending SMS between 9-11am shows 25% higher engagement.',
      icon: 'Zap',
      action: 'Adjust sending schedule',
      onClick: () => handleAdjustSchedule(),
      metrics: [
        { label: 'Peak Time', value: '9-11am' },
        { label: 'Engagement Lift', value: '+25%' }
      ]
    },
    {
      title: 'Content Analysis',
      description: 'Messages with personalized content have 35% higher response rates.',
      icon: 'FileText',
      action: 'Review templates',
      onClick: () => handleReviewTemplates(),
      metrics: [
        { label: 'Response Rate', value: '35%' },
        { label: 'Conversion Rate', value: '12%' }
      ]
    },
    {
      title: 'Audience Segmentation',
      description: 'Targeted campaigns show 40% better response rates than general broadcasts.',
      icon: 'Users',
      action: 'Refine segments',
      onClick: () => handleRefineSegments(),
      metrics: [
        { label: 'Response Improvement', value: '40%' },
        { label: 'Conversion Lift', value: '25%' }
      ]
    }
  ]);

  const handleRefreshAnalysis = () => {
    setIsRefreshing(true);
    try {
      // In production, this would be an API call
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1500);
      // Update insights with new data
    } catch (error) {
      console.error('Error refreshing analysis:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAdjustSchedule = () => {
    // Implement schedule adjustment logic
    console.log('Adjusting schedule...');
  };

  const handleReviewTemplates = () => {
    // Implement template review logic
    console.log('Reviewing templates...');
  };

  const handleRefineSegments = () => {
    // Implement segment refinement logic
    console.log('Refining segments...');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-navy/5 via-white to-turquoise/5 rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-navy to-purple rounded-lg">
            <Icons.Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text">
              AI-Powered SMS Insights
            </h2>
            <p className="text-sm text-gray-500">Real-time campaign optimization recommendations</p>
          </div>
        </div>
        <Button
          onClick={handleRefreshAnalysis}
          disabled={isRefreshing}
          className="bg-gradient-to-r from-navy to-purple text-white"
        >
          <Icons.RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
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
            className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              {React.createElement(Icons[insight.icon as keyof typeof Icons], {
                className: "w-5 h-5 text-primary"
              })}
              <h3 className="font-medium text-gray-900">{insight.title}</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{insight.description}</p>
            
            <div className="space-y-2 mb-4">
              {insight.metrics.map((metric, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{metric.label}</span>
                  <span className="text-sm font-medium text-gray-900">{metric.value}</span>
                </div>
              ))}
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={insight.onClick}
            >
              {insight.action}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};