import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

interface AITutorAvatarProps {
  name: string;
  expertise?: string[];
  avatar?: string;
  onInteract?: (action: string) => void;
}

export const AITutorAvatar: React.FC<AITutorAvatarProps> = ({
  name,
  expertise = [],
  avatar,
  onInteract,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messages = [
    "Need help understanding a concept?",
    "Let's practice together!",
    "I can explain that in a different way.",
    "Want to review your progress?",
  ];

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setIsTyping(true);
        const newMessage =
          messages[Math.floor(Math.random() * messages.length)];
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
  }, [isOpen]);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <AnimatePresence>
        {isOpen && (
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
                    <Icons.GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{name}</h3>
                <p className="text-sm text-gray-500">AI Learning Assistant</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {expertise.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div
                className={cn(
                  "p-3 bg-gray-50 rounded-lg",
                  isTyping && "animate-pulse",
                )}
              >
                <p className="text-sm">
                  {currentMessage ||
                    "Hi! How can I help you with your learning today?"}
                  {isTyping && <span className="animate-pulse">|</span>}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onInteract?.("explain")}
              >
                <Icons.BookOpen className="w-4 h-4 mr-2" />
                Explain Topic
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onInteract?.("practice")}
              >
                <Icons.Target className="w-4 h-4 mr-2" />
                Practice
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white rounded-full p-4 shadow-lg border border-gray-200"
      >
        <Icons.GraduationCap className="w-6 h-6 text-primary" />
      </motion.button>
    </div>
  );
};
