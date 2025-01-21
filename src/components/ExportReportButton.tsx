import React, { useState } from 'react';
import { Button } from './ui/button';
import { Download as DownloadIcon } from 'lucide-react';
import  ExportReportDialog  from './ExportReportDialog';
import { useNotifications } from '../contexts/NotificationContext';
import type { Staff } from '../types/models';

/**
 * Properties for the ExportReportButton component.
 * @template T - The type of data being exported ('staff', 'performance', 'training', or 'financial').
 */
interface ExportReportButtonProps<T extends 'staff' | 'performance' | 'training' | 'financial'> {
  /**
   * Optional data to be exported.
   */
  data?: T extends 'staff' ? Staff[] | undefined : any;
  /**
   * The type of report to export.
   */
  type?: T;
  /**
   * The variant of the button.
   */
  variant?: 'default' | 'outline' | 'ghost';
  /**
   * The size of the button.
   */
  size?: 'default' | 'sm' | 'lg';
  /**
   * Additional CSS class names for the button.
   */
  className?: string;
}

/**
 * A button component that triggers the export report dialog.
 * @template T - The type of data being exported ('staff', 'performance', 'training', or 'financial').
 * @param {ExportReportButtonProps<T>} props - The component props.
 * @returns {JSX.Element} The ExportReportButton component.
 */
export const ExportReportButton = <T extends 'staff' | 'performance' | 'training' | 'financial'>({
  data,
  type = 'staff' as T,
  variant = 'outline',
  size = 'default',
  className
}: ExportReportButtonProps<T>) => {
  const [showExportDialog, setShowExportDialog] = useState(false);
  const { dispatch: notifyDispatch } = useNotifications();

  /**
   * Handles the export action.
   * @param {string} format - The format to export the report in.
   * @param {any} options - The export options.
   */
  const handleExport = (format: string, options: any) => {
    notifyDispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        type: 'message',
        title: 'Report Export Started',
        message: 'Your report is being generated and will be ready shortly.',
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'medium'
      }
    });
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setShowExportDialog(true)}
      >
        <DownloadIcon className="w-4 h-4 mr-2" aria-hidden="true" />
        Export Report
      </Button>

      <ExportReportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={handleExport}
        data={data}
        type={type}
      />
    </>
  );
};