import React, { useState } from "react";
import { Button } from "../ui/button";
import * as Icons from "lucide-react";
import { ExportReportModal } from "./ExportReportModal";
import { useNotifications } from "../../contexts/NotificationContext";
import {
  exportToCSV,
  exportToExcel,
  exportToPDF,
} from "../../lib/utils/export";

interface ExportReportButtonProps {
  data?: any;
  type?: "staff" | "performance" | "training" | "financial";
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export const ExportReportButton: React.FC<ExportReportButtonProps> = ({
  data,
  type = "staff",
  variant = "outline",
  size = "default",
  className,
}) => {
  const [showExportDialog, setShowExportDialog] = useState(false);
  const { dispatch: notifyDispatch } = useNotifications();

  const handleExport = (format: string, options: any) => {
    // In production, this would trigger a backend export process
    console.log("Exporting with format:", format, "and options:", options);

    notifyDispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: Date.now().toString(),
        type: "message",
        title: "Export Started",
        message: "Your export is being processed and will be ready shortly.",
        timestamp: new Date().toISOString(),
        read: false,
        priority: "medium",
      },
    });

    setShowExportDialog(false);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setShowExportDialog(true)}
      >
        <Icons.Download className="w-4 h-4 mr-2" />
        Export Report
      </Button>

      <ExportReportModal
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={handleExport}
        data={data}
        type={type}
      />
    </>
  );
};
