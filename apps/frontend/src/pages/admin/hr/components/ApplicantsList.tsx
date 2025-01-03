import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { ExportDialog } from './ExportDialog';
import { exportToCSV, exportToExcel, exportToPDF } from '../../../../lib/utils/export';
import { InterviewScheduler } from './InterviewScheduler';
import { cn } from '../../../../lib/utils';

interface Applicant {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  status: 'new' | 'reviewed' | 'interviewing' | 'offered' | 'rejected';
  appliedDate: string;
  experience: string;
  education: string;
  resumeUrl?: string;
}

interface ApplicantsListProps {
  isOpen: boolean;
  onClose: () => void;
  opening?: any;
}
export const ApplicantsList: React.FC<ApplicantsListProps> = ({
  isOpen,
  onClose,
  opening
}) => {
  const [applicants, setApplicants] = useState<Applicant[]>([
    {
      id: '1',
      name: 'John Smith',
      position: 'Dental Hygienist',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      status: 'new',
      appliedDate: '2024-03-10',
      experience: '5 years',
      education: 'Bachelor of Science in Dental Hygiene'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      position: 'Front Desk Coordinator',
      email: 'sarah.j@example.com',
      phone: '(555) 234-5678',
      status: 'interviewing',
      appliedDate: '2024-03-08',
      experience: '3 years',
      education: 'Associates Degree in Healthcare Administration'
    }
  ]);

  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleStatusChange = (applicantId: string, newStatus: Applicant['status']) => {
    setApplicants(applicants.map(applicant =>
      applicant.id === applicantId ? { ...applicant, status: newStatus } : applicant
    ));
  };

  const handleScheduleInterview = (details: any) => {
    if (selectedApplicant) {
      handleStatusChange(selectedApplicant.id, 'interviewing');
      setShowScheduler(false);
      setSelectedApplicant(null);
    }
  };

  const handleAddComment = () => {
    // Add comment logic here
    setShowCommentDialog(false);
    setComment('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6"
      >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Applicants</h2>
          {opening && <p className="text-sm text-gray-500">{opening.position}</p>}
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Icons.Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Icons.Download className="w-4 h-4 mr-2" />
            Export List
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icons.X className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={(format, options) => {
          const exportData = applicants.map(applicant => ({
            name: applicant.name,
            position: applicant.position,
            email: applicant.email,
            phone: applicant.phone,
            status: applicant.status,
            appliedDate: applicant.appliedDate,
            experience: applicant.experience,
            education: applicant.education
          }));

          if (format === 'csv') {
            exportToCSV(exportData, 'applicants-list');
          } else if (format === 'excel') {
            exportToExcel(exportData, 'applicants-list');
          } else if (format === 'pdf') {
            exportToPDF(exportData, 'applicants-list');
          }
        }}
      />

      <div className="space-y-4">
        {applicants.map((applicant) => (
          <motion.div
            key={applicant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icons.User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{applicant.name}</h3>
                  <p className="text-gray-500">{applicant.position}</p>
                </div>
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                applicant.status === 'new' && "bg-blue-100 text-blue-800",
                applicant.status === 'reviewed' && "bg-yellow-100 text-yellow-800",
                applicant.status === 'interviewing' && "bg-purple-100 text-purple-800",
                applicant.status === 'offered' && "bg-green-100 text-green-800",
                applicant.status === 'rejected' && "bg-red-100 text-red-800"
              )}>
                {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Applied Date</p>
                <p className="font-medium">{applicant.appliedDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="font-medium">{applicant.experience}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Education</p>
                <p className="font-medium">{applicant.education}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium">{applicant.email}</p>
                <p className="text-sm">{applicant.phone}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => {
                  setSelectedApplicant(applicant);
                  setShowScheduler(true);
                }}
              >
                <Icons.Calendar className="w-4 h-4 mr-2" />
                Schedule Interview
              </Button>
              <Button variant="outline">
                <Icons.FileText className="w-4 h-4 mr-2" />
                View Resume
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setSelectedApplicant(applicant);
                  setShowCommentDialog(true);
                }}
              >
                <Icons.MessageSquare className="w-4 h-4 mr-2" />
                Add Comment
              </Button>
              <Button variant="outline">
                <Icons.Mail className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Interview Scheduler Dialog */}
      {selectedApplicant && (
        <InterviewScheduler
          isOpen={showScheduler}
          onClose={() => {
            setShowScheduler(false);
            setSelectedApplicant(null);
          }}
          onSchedule={handleScheduleInterview}
          candidate={selectedApplicant}
        />
      )}

      {/* Comment Dialog */}
      {showCommentDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Add Comment</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowCommentDialog(false)}>
                  <Icons.X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                rows={4}
                placeholder="Add your comment..."
              />
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowCommentDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddComment}>
                Add Comment
              </Button>
            </div>
          </motion.div>
        </div>
      )}
      </motion.div>
    </div>
  );
};