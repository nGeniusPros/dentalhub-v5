import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../ui/button';
import { useNotifications } from '../../contexts/NotificationContext';

interface JoinChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: {
    id: string;
    title: string;
    description: string;
    points: number;
    endDate: string;
    participants: number;
    tasks?: Array<{
      id: string;
      title: string;
      points: number;
      completed?: boolean;
    }>;
    requirements?: string[];
  };
  onJoin: (challengeId: string, teamMembers?: string[]) => void;
}

export const JoinChallengeModal: React.FC<JoinChallengeModalProps> = ({
  isOpen,
  onClose,
  challenge,
  onJoin
}) => {
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { dispatch: notifyDispatch } = useNotifications();

  if (!isOpen) return null;

  const handleJoin = () => {
    if (!agreedToTerms) {
      notifyDispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now().toString(),
          type: 'alert',
          title: 'Agreement Required',
          message: 'Please agree to the challenge terms to continue.',
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'medium'
        }
      });
      return;
    }

    onJoin(challenge.id, teamMembers);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-lg"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{challenge.title}</h2>
              <p className="text-sm text-gray-500">Challenge Details</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-600">{challenge.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Points</label>
              <p className="font-medium">{challenge.points}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">End Date</label>
              <p className="font-medium">{new Date(challenge.endDate).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Participants</label>
              <p className="font-medium">{challenge.participants}</p>
            </div>
          </div>

          {challenge.tasks && (
            <div>
              <h3 className="font-medium mb-2">Challenge Tasks</h3>
              <div className="space-y-2">
                {challenge.tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>{task.title}</span>
                    <span className="text-sm text-gray-500">{task.points} points</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {challenge.requirements && (
            <div>
              <h3 className="font-medium mb-2">Requirements</h3>
              <div className="space-y-2">
                {challenge.requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Icons.CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-medium mb-2">Team Members (Optional)</h3>
            <div className="space-y-2">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span>{member}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTeamMembers(teamMembers.filter((_, i) => i !== index))}
                  >
                    <Icons.X className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const member = prompt('Enter team member name:');
                  if (member) {
                    setTeamMembers([...teamMembers, member]);
                  }
                }}
              >
                <Icons.UserPlus className="w-4 h-4 mr-2" />
                Add Team Member
              </Button>
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm">
              I agree to the challenge terms and commit to completing all required tasks
            </span>
          </label>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleJoin} disabled={!agreedToTerms}>
            Join Challenge
          </Button>
        </div>
      </motion.div>
    </div>
  );
};