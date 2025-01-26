import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import * as Icons from "lucide-react";
import { useNotifications } from "../../contexts/NotificationContext";

interface TrainingAssignmentButtonProps {
  staffId: string;
  staffName: string;
  onAssign?: (modules: any[]) => void;
}

export const TrainingAssignmentButton: React.FC<
  TrainingAssignmentButtonProps
> = ({ staffId, staffName, onAssign }) => {
  const navigate = useNavigate();
  const { dispatch: notifyDispatch } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);

    // Notify about the redirection
    notifyDispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: Date.now().toString(),
        type: "message",
        title: "Redirecting to Learning Center",
        message: `Assigning training for ${staffName}`,
        timestamp: new Date().toISOString(),
        read: false,
        priority: "medium",
      },
    });

    // Navigate to learning center with staff context
    navigate("/admin-dashboard/learning", {
      state: {
        assignTraining: true,
        staffId,
        staffName,
      },
    });
  };

  return (
    <Button onClick={handleClick} disabled={isLoading}>
      {isLoading ? (
        <Icons.Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Icons.GraduationCap className="w-4 h-4 mr-2" />
      )}
      Start Training
    </Button>
  );
};
