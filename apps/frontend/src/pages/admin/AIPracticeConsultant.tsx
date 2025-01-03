import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../components/ui/button';
import { AIConsultantChat } from '../../components/ai/AIConsultantChat';

const quickQuestions = [
  {
    category: "Practice Growth",
    questions: [
      "What are the key metrics for growth?",
      "How to increase case acceptance?",
      "Best marketing strategies?",
      "Building referral programs?"
    ]
  },
  {
    category: "Patient Experience",
    questions: [
      "Improving satisfaction scores?",
      "Reducing wait times?",
      "Handling complaints?",
      "Better waiting room experience?"
    ]
  },
  {
    category: "Operations",
    questions: [
      "Optimizing scheduling?",
      "Reducing no-shows?",
      "Front desk efficiency?",
      "Inventory management?"
    ]
  },
  {
    category: "Staff & Training",
    questions: [
      "Improving retention?",
      "Training new staff?",
      "Team meetings?",
      "Performance reviews?"
    ]
  },
  {
    category: "Financial Growth",
    questions: [
      "Increasing revenue?",
      "Insurance collections?",
      "Membership programs?",
      "Fee scheduling?"
    ]
  }
];

const AIPracticeConsultant = () => {
  const [selectedQuestion, setSelectedQuestion] = React.useState('');
  const [selectedMetric, setSelectedMetric] = React.useState('revenue');

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold bg-gradient-primary text-transparent bg-clip-text">
            AI Practice Consultant
          </h1>
          <p className="text-gray-500 mt-1">Get expert insights and recommendations</p>
        </div>
        <Button 
          className="bg-gradient-primary text-white hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
        >
          <Icons.RefreshCw className="w-4 h-4 mr-2" />
          Refresh Analysis
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AIConsultantChat selectedQuestion={selectedQuestion} />

          {/* Practice Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Practice Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Monthly Revenue', value: '$150,000', icon: 'DollarSign', trend: '+12%' },
                { label: 'Patient Count', value: '1,200', icon: 'Users', trend: '+5%' },
                { label: 'Appointment Rate', value: '75%', icon: 'Calendar', trend: '+3%' },
                { label: 'Treatment Acceptance', value: '65%', icon: 'CheckCircle', trend: '+8%' },
              ].map((metric, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => setSelectedMetric(metric.label.toLowerCase())}
                >
                  <div className="flex items-center justify-between mb-2">
                    {React.createElement(Icons[metric.icon as keyof typeof Icons], {
                      className: "w-5 h-5 text-primary"
                    })}
                    <span className="text-green-600 text-sm font-medium">{metric.trend}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-sm text-gray-500">{metric.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Quick Questions */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Questions</h2>
            <div className="space-y-4">
              {quickQuestions.map((section, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">{section.category}</h3>
                  <div className="grid gap-2">
                    {section.questions.map((question, qIdx) => (
                      <Button
                        key={qIdx}
                        variant="ghost"
                        className="w-full justify-start text-left hover:bg-gray-50 text-sm py-2 h-auto whitespace-normal"
                        onClick={() => setSelectedQuestion(question)}
                      >
                        <Icons.ArrowRight className="w-4 h-4 mr-2 flex-shrink-0 text-primary" />
                        <span className="line-clamp-2">{question}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Insights */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Insights</h2>
            <div className="space-y-3">
              {[
                { title: 'Revenue Growth', category: 'Financial', date: '2h ago' },
                { title: 'Patient Retention', category: 'Operations', date: '4h ago' },
                { title: 'Staff Performance', category: 'Management', date: '1d ago' },
              ].map((insight, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{insight.title}</p>
                      <p className="text-sm text-gray-500">{insight.category}</p>
                    </div>
                    <span className="text-xs text-gray-400">{insight.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIPracticeConsultant;