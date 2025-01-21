import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface ViewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  type: 'course' | 'challenge' | 'certification' | 'assignment';
  onAction?: (action: string) => void;
}

export const ViewDetailsModal: React.FC<ViewDetailsModalProps> = ({
  isOpen,
  onClose,
  data,
  type,
  onAction
}) => {
  if (!isOpen || !data) return null;

  const renderMetrics = () => {
    switch (type) {
      case 'course':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-gray-500">Duration</label>
              <p className="font-medium">{data.duration}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Points</label>
              <p className="font-medium">{data.points}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Level</label>
              <p className="font-medium capitalize">{data.level}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Category</label>
              <p className="font-medium">{data.category}</p>
            </div>
          </div>
        );

      case 'challenge':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-500">Points</label>
              <p className="font-medium">{data.points}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">End Date</label>
              <p className="font-medium">{new Date(data.endDate).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Participants</label>
              <p className="font-medium">{data.participants}</p>
            </div>
          </div>
        );

      case 'certification':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Issuer</label>
              <p className="font-medium">{data.issuer}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Status</label>
              <span className={cn(
                "px-2 py-1 text-xs font-medium rounded-full",
                data.status === 'active' && "bg-green-100 text-green-800",
                data.status === 'expiring' && "bg-yellow-100 text-yellow-800",
                data.status === 'expired' && "bg-red-100 text-red-800"
              )}>
                {data.status}
              </span>
            </div>
            <div>
              <label className="text-sm text-gray-500">Earned Date</label>
              <p className="font-medium">{new Date(data.earnedDate).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Expiration Date</label>
              <p className="font-medium">{new Date(data.expirationDate).toLocaleDateString()}</p>
            </div>
          </div>
        );

      case 'assignment':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Due Date</label>
              <p className="font-medium">{new Date(data.dueDate).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Points</label>
              <p className="font-medium">{data.points}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Time Estimate</label>
              <p className="font-medium">{data.timeEstimate}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Status</label>
              <span className={cn(
                "px-2 py-1 text-xs font-medium rounded-full",
                data.status === 'completed' && "bg-green-100 text-green-800",
                data.status === 'in_progress' && "bg-blue-100 text-blue-800",
                data.status === 'pending' && "bg-yellow-100 text-yellow-800"
              )}>
                {data.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        );
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'course':
        return (
          <>
            {/* Progress */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{data.progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${data.progress}%` }}
                />
              </div>
            </div>

            {/* Modules */}
            {data.modules && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Modules</h3>
                <div className="space-y-2">
                  {data.modules.map((module: any, index: number) => (
                    <div
                      key={index}
                      className={cn(
                        "p-3 rounded-lg",
                        module.completed ? "bg-green-50" : "bg-gray-50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {module.completed ? (
                            <Icons.CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Icons.Circle className="w-4 h-4 text-gray-300" />
                          )}
                          <span className="font-medium">{module.title}</span>
                        </div>
                        <span className="text-sm text-gray-500">{module.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        );

      case 'challenge':
        return (
          <>
            {/* Requirements */}
            {data.requirements && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Requirements</h3>
                <div className="space-y-2">
                  {data.requirements.map((req: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Icons.CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tasks */}
            {data.tasks && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Challenge Tasks</h3>
                <div className="space-y-2">
                  {data.tasks.map((task: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>{task.title}</span>
                      <span className="text-sm text-gray-500">{task.points} points</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        );

      case 'certification':
        return (
          <>
            {/* Skills */}
            {data.skills && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Validation */}
            {data.validationUrl && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Validation</h3>
                <a
                  href={data.validationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Verify Certification
                </a>
              </div>
            )}
          </>
        );

      case 'assignment':
        return (
          <>
            {/* Attachments */}
            {data.attachments && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Attachments</h3>
                <div className="space-y-2">
                  {data.attachments.map((file: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Icons.FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{file.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grade & Feedback */}
            {data.status === 'graded' && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Grade</span>
                  <span className="text-lg font-bold text-primary">{data.grade}%</span>
                </div>
                {data.feedback && (
                  <p className="text-sm text-gray-600">{data.feedback}</p>
                )}
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{data.title}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600">{data.description}</p>
          </div>

          {/* Metrics */}
          {renderMetrics()}

          {/* Content */}
          {renderContent()}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {type === 'course' && (
              <Button onClick={() => onAction?.('start-course')}>
                {data.progress === 0 ? (
                  <>
                    <Icons.Play className="w-4 h-4 mr-2" />
                    Start Course
                  </>
                ) : data.progress === 100 ? (
                  <>
                    <Icons.RotateCcw className="w-4 h-4 mr-2" />
                    Retake Course
                  </>
                ) : (
                  <>
                    <Icons.ArrowRight className="w-4 h-4 mr-2" />
                    Continue
                  </>
                )}
              </Button>
            )}
            {type === 'challenge' && (
              <Button onClick={() => onAction?.('join-challenge')}>
                <Icons.Users className="w-4 h-4 mr-2" />
                Join Challenge
              </Button>
            )}
            {type === 'certification' && (
              <Button onClick={() => onAction?.('start-certification')}>
                <Icons.FileCheck className="w-4 h-4 mr-2" />
                Begin Certification
              </Button>
            )}
            {type === 'assignment' && (
              <Button onClick={() => onAction?.('start-assignment')}>
                <Icons.Play className="w-4 h-4 mr-2" />
                Start Assignment
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};