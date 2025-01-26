import React from "react";
import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import { Button } from "./button";

interface BackButtonProps {
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ className }) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate(-1)}
      className={className}
    >
      <Icons.ArrowLeft className="w-4 h-4 mr-2" />
      Back
    </Button>
  );
};
