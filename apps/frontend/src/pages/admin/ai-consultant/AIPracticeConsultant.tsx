import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../components/ui/button";
import { AIConsultantChat } from "../../../components/ai/AIConsultantChat";
import type { AgentContext } from "../../../lib/ai-agents/types/agent-types";

const quickQuestions = [
  {
    category: "Practice Growth",
    questions: [
      "What are the key metrics for growth?",
      "How to increase case acceptance?",
      "Best marketing strategies?",
      "Building referral programs?",
    ],
  },
  {
    category: "Patient Experience",
    questions: [
      "Improving satisfaction scores?",
      "Reducing wait times?",
      "Handling complaints?",
      "Better waiting room experience?",
    ],
  },
  {
    category: "Operations",
    questions: [
      "Optimizing scheduling?",
      "Reducing no-shows?",
      "Front desk efficiency?",
      "Inventory management?",
    ],
  },
  {
    category: "Staff & Training",
    questions: [
      "Improving retention?",
      "Training new staff?",
      "Team meetings?",
      "Performance reviews?",
    ],
  },
  {
    category: "Financial Growth",
    questions: [
      "Increasing revenue?",
      "Insurance collections?",
      "Membership programs?",
      "Fee scheduling?",
    ],
  },
];

const practiceMetrics: AgentContext["practiceMetrics"] = {
  revenue: 150000,
  patientCount: 1200,
  appointmentFillRate: 75,
  treatmentAcceptance: 65,
};

export const AIPracticeConsultant = () => {
  const [selectedQuestion, setSelectedQuestion] = React.useState("");
  const [selectedMetric, setSelectedMetric] = React.useState("revenue");

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
          <p className="text-gray-500 mt-1">
            Get expert insights and recommendations
          </p>
        </div>
        <Button className="bg-gradient-primary text-white hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-200 font-medium">
          <Icons.RefreshCw className="w-4 h-4 mr-2" />
          Refresh Analysis
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AIConsultantChat 
            selectedQuestion={selectedQuestion} 
            practiceMetrics={practiceMetrics}
          />

          {/* Practice Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Practice Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Monthly Revenue",
                  value: "$150,000",
                  icon: "DollarSign",
                  trend: "+12%",
                },
                {
                  label: "Patient Count",
                  value: "1,200",
                  icon: "Users",
                  trend: "+5%",
                },
                {
                  label: "Appointment Fill Rate",
                  value: "75%",
                  icon: "Calendar",
                  trend: "-2%",
                },
                {
                  label: "Treatment Acceptance",
                  value: "65%",
                  icon: "CheckCircle",
                  trend: "+8%",
                },
              ].map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg ${
                    selectedMetric === metric.label.toLowerCase()
                      ? "bg-primary/10 border-primary"
                      : "bg-gray-50 border-transparent"
                  } border-2 transition-colors duration-200 cursor-pointer hover:border-primary/50`}
                  onClick={() => setSelectedMetric(metric.label.toLowerCase())}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`p-2 rounded-lg ${
                        selectedMetric === metric.label.toLowerCase()
                          ? "bg-primary/20"
                          : "bg-gray-100"
                      }`}
                    >
                      {React.createElement(Icons[metric.icon as keyof typeof Icons], {
                        className: "w-5 h-5 text-primary",
                      })}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        metric.trend.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {metric.trend}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <p className="text-xl font-semibold mt-1">{metric.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Questions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Questions</h2>
            <div className="space-y-4">
              {quickQuestions.map((section, index) => (
                <div key={index}>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    {section.category}
                  </h3>
                  <div className="space-y-2">
                    {section.questions.map((q, qIndex) => (
                      <Button
                        key={qIndex}
                        variant="outline"
                        className="w-full justify-start text-left hover:bg-primary/5 hover:text-primary"
                        onClick={() => setSelectedQuestion(q)}
                      >
                        {q}
                      </Button>
                    ))}
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
