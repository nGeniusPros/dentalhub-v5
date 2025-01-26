import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { ApplicantsList } from "./ApplicantsList";
import { InterviewScheduler } from "./InterviewScheduler";
import { MessageDialog } from "./MessageDialog";
import { CommentDialog } from "./CommentDialog";
import { cn } from "../../../../lib/utils";
import { PostJobModal } from "./recruitment/PostJobModal";
import { RequestRecruiterModal } from "./recruitment/RequestRecruiterModal";

export const RecruitmentTracker = () => {
  const [showApplicants, setShowApplicants] = React.useState(false);
  const [showScheduler, setShowScheduler] = React.useState(false);
  const [showMessage, setShowMessage] = React.useState(false);
  const [showComment, setShowComment] = React.useState(false);
  const [selectedOpening, setSelectedOpening] = React.useState<any>(null);

  const handleViewApplicants = (opening: any) => {
    setSelectedOpening(opening);
    setShowApplicants(true);
  };

  const handleScheduleInterview = (details: any) => {
    console.log("Scheduling interview:", details);
    setShowScheduler(false);
  };

  const [showPostJob, setShowPostJob] = React.useState(false);
  const [showRequestRecruiter, setShowRequestRecruiter] = React.useState(false);

  const openings = [
    {
      position: "Dental Hygienist",
      department: "Clinical",
      status: "active",
      applicants: 12,
      interviews: 3,
      posted: "2024-02-15",
    },
    {
      position: "Front Desk Coordinator",
      department: "Administrative",
      status: "interviewing",
      applicants: 18,
      interviews: 5,
      posted: "2024-02-20",
    },
    {
      position: "Dental Assistant",
      department: "Clinical",
      status: "reviewing",
      applicants: 8,
      interviews: 0,
      posted: "2024-03-01",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Recruitment Tracker</h2>
          <p className="text-sm text-gray-500">
            Active job openings and applications
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowRequestRecruiter(true)}
          >
            <Icons.Headphones className="w-4 h-4 mr-2" />
            Request Recruiter
          </Button>
          <Button onClick={() => setShowPostJob(true)}>
            <Icons.Plus className="w-4 h-4 mr-2" />
            Post Job
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {openings.map((opening, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium text-gray-900">{opening.position}</p>
                <p className="text-sm text-gray-500">{opening.department}</p>
              </div>
              <span
                className={cn(
                  "px-2 py-1 text-xs font-medium rounded-full",
                  opening.status === "active"
                    ? "bg-green-100 text-green-800"
                    : opening.status === "interviewing"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800",
                )}
              >
                {opening.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-3">
              <div>
                <p className="text-sm text-gray-500">Applicants</p>
                <p className="font-medium">{opening.applicants}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Interviews</p>
                <p className="font-medium">{opening.interviews}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Posted</p>
                <p className="font-medium">{opening.posted}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => handleViewApplicants(opening)}
              >
                <Icons.Users className="w-4 h-4 mr-2" />
                View Applicants
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => setShowScheduler(true)}
              >
                <Icons.Calendar className="w-4 h-4 mr-2" />
                Schedule Interview
              </Button>
            </div>
          </div>
        ))}
      </div>

      {showApplicants && selectedOpening && (
        <ApplicantsList
          isOpen={showApplicants}
          onClose={() => setShowApplicants(false)}
          opening={selectedOpening}
        />
      )}

      {showScheduler && (
        <InterviewScheduler
          isOpen={showScheduler}
          onClose={() => setShowScheduler(false)}
          onSchedule={handleScheduleInterview}
          candidate={selectedOpening}
        />
      )}

      {showMessage && (
        <MessageDialog
          isOpen={showMessage}
          onClose={() => setShowMessage(false)}
          onSend={(message) => {
            console.log("Sending message:", message);
            setShowMessage(false);
          }}
          recipient={{ name: "John Smith", email: "john@example.com" }}
        />
      )}

      {showComment && (
        <CommentDialog
          isOpen={showComment}
          onClose={() => setShowComment(false)}
          onSubmit={(comment) => {
            console.log("Adding comment:", comment);
            setShowComment(false);
          }}
        />
      )}

      <PostJobModal
        isOpen={showPostJob}
        onClose={() => setShowPostJob(false)}
        onSubmit={(jobData) => {
          console.log("New job posted:", jobData);
          setShowPostJob(false);
        }}
      />

      <RequestRecruiterModal
        isOpen={showRequestRecruiter}
        onClose={() => setShowRequestRecruiter(false)}
        onSubmit={(request) => {
          console.log("Recruiter consultation requested:", request);
          setShowRequestRecruiter(false);
        }}
      />
    </motion.div>
  );
};
