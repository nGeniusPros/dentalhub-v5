import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useLearning } from "../../../contexts/LearningContext";
import { LearningStats } from "./components/LearningStats";
import { CourseGrid } from "./components/CourseGrid";
import { LeaderboardSection } from "./components/LeaderboardSection";
import { ChallengesSection } from "./components/ChallengesSection";
import { AchievementsSection } from "./components/AchievementsSection";
import { LearningPathProgress } from "./components/LearningPathProgress";
import { RewardsSection } from "./components/RewardsSection";
import { AssignmentList } from "./components/AssignmentList";
import { CertificationList } from "./components/CertificationList";
import { BadgeList } from "./components/BadgeList";
import { AITrainingAgent } from "../../../components/learning/AITrainingAgent";
import { AITutorAvatar } from "../../../components/learning/AITutorAvatar";
import { useNotifications } from "../../../contexts/NotificationContext";

const LearningDashboard = () => {
  const [activeTab, setActiveTab] = React.useState("overview");
  const { dispatch: notifyDispatch } = useNotifications();

  const handleAIMessage = (message: string) => {
    notifyDispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: Date.now().toString(),
        type: "message",
        title: "AI Assistant",
        message: "Your AI training assistant is ready to help!",
        timestamp: new Date().toISOString(),
        read: false,
        priority: "medium",
      },
    });
  };

  const handleStartCourse = (courseId: string) => {
    notifyDispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: Date.now().toString(),
        type: "message",
        title: "Course Started",
        message: "You have started a new course. Good luck!",
        timestamp: new Date().toISOString(),
        read: false,
        priority: "medium",
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text">
            Learning Center
          </h1>
          <p className="text-gray-600">Grow your skills and earn rewards</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setActiveTab("rewards")}>
            <Icons.Trophy className="w-4 h-4 mr-2" />
            View Rewards
          </Button>
          <Button onClick={() => setActiveTab("courses")}>
            <Icons.GraduationCap className="w-4 h-4 mr-2" />
            Start Learning
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: "overview", label: "Overview", icon: "LayoutDashboard" },
          { id: "courses", label: "Courses", icon: "BookOpen" },
          { id: "assignments", label: "Assignments", icon: "ClipboardList" },
          { id: "certifications", label: "Certifications", icon: "Award" },
          { id: "badges", label: "Badges", icon: "Shield" },
          { id: "rewards", label: "Rewards", icon: "Gift" },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            onClick={() => setActiveTab(tab.id)}
            className="relative py-2 -mb-px"
          >
            {React.createElement(Icons[tab.icon as keyof typeof Icons], {
              className: "w-4 h-4 mr-2",
            })}
            {tab.label}
          </Button>
        ))}
      </div>

      <LearningStats />

      {activeTab === "overview" && (
        <div className="grid grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="col-span-8 space-y-6">
            <LearningPathProgress />
            <CourseGrid onStartCourse={handleStartCourse} />
            <ChallengesSection />
          </div>

          {/* Sidebar */}
          <div className="col-span-4 space-y-6">
            <LeaderboardSection />
            <AchievementsSection />
          </div>
        </div>
      )}

      {activeTab === "courses" && (
        <CourseGrid onStartCourse={handleStartCourse} />
      )}

      {activeTab === "assignments" && <AssignmentList />}

      {activeTab === "certifications" && <CertificationList />}

      {activeTab === "badges" && <BadgeList />}

      {activeTab === "rewards" && <RewardsSection />}

      {/* AI Training Assistants */}
      <AITrainingAgent
        name="Alex"
        role="Training Assistant"
        specialties={["HIPAA", "Clinical Procedures", "Patient Care"]}
        onMessage={handleAIMessage}
      />

      <AITutorAvatar
        name="Dr. Sarah"
        expertise={["Dental Procedures", "Best Practices", "Compliance"]}
        onInteract={handleAIMessage}
      />
    </div>
  );
};

export default LearningDashboard;
