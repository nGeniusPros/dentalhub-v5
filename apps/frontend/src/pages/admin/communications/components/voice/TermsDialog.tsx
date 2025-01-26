import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../../components/ui/button";

interface TermsDialogProps {
  open: boolean;
  onClose: () => void;
}

export const TermsDialog: React.FC<TermsDialogProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Terms and Conditions
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="prose max-w-none">
            <h3>Voice Campaign Terms of Service</h3>
            <p>
              By using our voice campaign services, you agree to comply with all
              applicable laws and regulations regarding telephone
              communications, including but not limited to:
            </p>

            <ul>
              <li>The Telephone Consumer Protection Act (TCPA)</li>
              <li>The CAN-SPAM Act</li>
              <li>Federal Trade Commission regulations</li>
              <li>State-specific telemarketing laws</li>
            </ul>

            <h4>Key Requirements</h4>
            <p>You must:</p>
            <ul>
              <li>
                Obtain explicit consent from recipients before sending marketing
                messages
              </li>
              <li>Honor opt-out requests promptly</li>
              <li>Maintain accurate Do Not Call lists</li>
              <li>
                Only contact numbers during permitted hours (8am-9pm local time)
              </li>
              <li>Provide clear identification of your practice</li>
              <li>Maintain records of consent and communications</li>
            </ul>

            <h4>Prohibited Activities</h4>
            <ul>
              <li>
                Sending messages to numbers on the National Do Not Call Registry
              </li>
              <li>Using automated dialers without express consent</li>
              <li>Sending messages outside of permitted hours</li>
              <li>Making false or misleading statements</li>
            </ul>

            <p>
              Violation of these terms may result in immediate suspension of
              services and potential legal consequences. By proceeding, you
              acknowledge that you have read and agree to these terms.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-sm">
                I have read and agree to the terms and conditions
              </span>
            </label>
            <Button onClick={onClose}>Accept & Continue</Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
