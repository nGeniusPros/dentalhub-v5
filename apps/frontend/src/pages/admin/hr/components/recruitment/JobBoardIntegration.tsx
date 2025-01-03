import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';

interface JobBoard {
  id: string;
  name: string;
  icon: keyof typeof Icons;
  connected: boolean;
  credentials?: {
    username: string;
    apiKey?: string;
  };
}

export const JobBoardIntegration = () => {
  const [jobBoards, setJobBoards] = useState<JobBoard[]>([
    { id: 'indeed', name: 'Indeed', icon: 'Briefcase', connected: false },
    { id: 'linkedin', name: 'LinkedIn', icon: 'Linkedin', connected: false },
    { id: 'monster', name: 'Monster', icon: 'Building', connected: false },
    { id: 'ziprecruiter', name: 'ZipRecruiter', icon: 'Search', connected: false },
    { id: 'glassdoor', name: 'Glassdoor', icon: 'Building2', connected: false }
  ]);

  const [showCredentials, setShowCredentials] = useState<string | null>(null);

  const handleConnect = (boardId: string) => {
    // Open the job board's login page in a new window
    const urls = {
      indeed: 'https://employers.indeed.com/login',
      linkedin: 'https://www.linkedin.com/talent/login',
      monster: 'https://hiring.monster.com/signin',
      ziprecruiter: 'https://www.ziprecruiter.com/login',
      glassdoor: 'https://www.glassdoor.com/employer/login'
    };

    const url = urls[boardId as keyof typeof urls];
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleDisconnect = (boardId: string) => {
    setJobBoards(boards => boards.map(board =>
      board.id === boardId ? { ...board, connected: false, credentials: undefined } : board
    ));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Connected Job Boards</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobBoards.map((board) => (
          <div key={board.id} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {React.createElement(Icons[board.icon], {
                  className: "w-6 h-6 text-primary"
                })}
                <span className="font-medium">{board.name}</span>
              </div>
              {board.connected ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDisconnect(board.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Disconnect
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => handleConnect(board.id)}
                >
                  Connect
                </Button>
              )}
            </div>

            {board.connected && (
              <div className="text-sm text-gray-500">
                Connected as: {board.credentials?.username}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};