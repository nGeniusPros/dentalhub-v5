import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface AITrainingAgentProps {
  name: string;
  role: string;
  avatar?: string;
  specialties?: string[];
  onMessage?: (message: string) => void;
}

export const AITrainingAgent: React.FC<AITrainingAgentProps> = ({
  name,
  role,
  avatar,
  specialties = [],
  onMessage
}) => {
  const [isActive, setIsActive] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messages = [
    "Need help with your training? I'm here to assist!",
    "Let's review your progress and set some goals.",
    "I can help explain complex topics in simple terms.",
    "Want to practice some scenarios together?"
  ];

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setIsTyping(true);
        const newMessage = messages[Math.floor(Math.random() * messages.length)];
        let i = 0;
        const typing = setInterval(() => {
          setCurrentMessage(newMessage.substring(0, i));
          i++;
          if (i > newMessage.length) {
            clearInterval(typing);
            setIsTyping(false);
          }
        }, 50);
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [isActive]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 p-4 bg-white rounded-xl shadow-lg border border-gray-200 w-80"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="relative">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icons.Bot className="w-6 h-6 text-primary" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{name}</h3>
                <p className="text-sm text-gray-500">{role}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {specialties.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              )}

              <div className={cn(
                "p-3 bg-gray-50 rounded-lg",
                isTyping && "animate-pulse"
              )}>
                <p className="text-sm">
                  {currentMessage || "Hi! How can I help you with your learning today?"}
                  {isTyping && <span className="animate-pulse">|</span>}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onMessage?.('start_training')}
              >
                <Icons.Play className="w-4 h-4 mr-2" />
                Start Training
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onMessage?.('ask_question')}
              >
                <Icons.HelpCircle className="w-4 h-4 mr-2" />
                Ask Question
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsActive(!isActive)}
        className="bg-white rounded-full p-4 shadow-lg border border-gray-200"
      >
        <Icons.Bot className="w-6 h-6 text-primary" />
      </motion.button>
    </div>
  );
};