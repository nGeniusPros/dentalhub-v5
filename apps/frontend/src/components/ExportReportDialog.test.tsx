import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ExportReportDialog from './ExportReportDialog';
import { useNotifications } from '../contexts/NotificationContext';
import { act } from 'react-dom/test-utils';

import { vi } from 'vitest';
// Mock the useNotifications hook
vi.mock('../contexts/NotificationContext', () => ({
  useNotifications: () => ({
    dispatch: jest.fn(),
  }),
}));

const mockOnExport = vi.fn();
const mockOnClose = vi.fn();

describe('ExportReportDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the dialog when isOpen is true', () => {
    render(
      <ExportReportDialog
        isOpen={true}
        onClose={mockOnClose}
        onExport={mockOnExport}
      />
    );
    expect(screen.getByRole('heading', { name: 'Export Report' })).toBeInTheDocument();
  });

  it('should not render the dialog when isOpen is false', () => {
    render(
      <ExportReportDialog
        isOpen={false}
        onClose={mockOnClose}
        onExport={mockOnExport}
      />
    );
    expect(screen.queryByRole('heading', { name: 'Export Report' })).toBeNull();
  });

  it('should call onClose when the cancel button is clicked', async () => {
    render(
      <ExportReportDialog
        isOpen={true}
        onClose={mockOnClose}
        onExport={mockOnExport}
      />
    );
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await act(async () => {
      fireEvent.click(cancelButton);
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onExport with the correct format and options when the export button is clicked', async () => {
    render(
      <ExportReportDialog
        isOpen={true}
        onClose={mockOnClose}
        onExport={mockOnExport}
      />
    );
    const exportButton = screen.getByRole('button', { name: 'Export Report' });
    await act(async () => {
      fireEvent.click(exportButton);
    });
    expect(mockOnExport).toHaveBeenCalledWith('pdf', {
      includeCharts: true,
      includeTables: true,
      dateRange: 'all',
      sections: {
        overview: true,
        details: true,
        metrics: true,
        trends: true
      },
      customDateRange: {
        start: '',
        end: ''
      }
    });
  });

  it('should update the format when the format select is changed', async () => {
    render(
      <ExportReportDialog
        isOpen={true}
        onClose={mockOnClose}
        onExport={mockOnExport}
      />
    );
    const formatSelect = screen.getByRole('combobox', { name: 'Export Format' });
    await act(async () => {
      fireEvent.change(formatSelect, { target: { value: 'csv' } });
    });
    const exportButton = screen.getByRole('button', { name: 'Export Report' });
    await act(async () => {
      fireEvent.click(exportButton);
    });
    expect(mockOnExport).toHaveBeenCalledWith('csv', {
      includeCharts: true,
      includeTables: true,
      dateRange: 'all',
      sections: {
        overview: true,
        details: true,
        metrics: true,
        trends: true
      },
      customDateRange: {
        start: '',
        end: ''
      }
    });
  });

  it('should update the date range when the date range select is changed', async () => {
    render(
      <ExportReportDialog
        isOpen={true}
        onClose={mockOnClose}
        onExport={mockOnExport}
      />
    );
    const dateRangeSelect = screen.getByRole('combobox', { name: 'Date Range' });
    await act(async () => {
      fireEvent.change(dateRangeSelect, { target: { value: 'today' } });
    });
    const exportButton = screen.getByRole('button', { name: 'Export Report' });
    await act(async () => {
      fireEvent.click(exportButton);
    });
    expect(mockOnExport).toHaveBeenCalledWith('pdf', {
      includeCharts: true,
      includeTables: true,
      dateRange: 'today',
      sections: {
        overview: true,
        details: true,
        metrics: true,
        trends: true
      },
      customDateRange: {
        start: '',
        end: ''
      }
    });
  });

  it('should update the custom date range when the custom date inputs are changed', async () => {
    render(
      <ExportReportDialog
        isOpen={true}
        onClose={mockOnClose}
        onExport={mockOnExport}
      />
    );
    const dateRangeSelect = screen.getByRole('combobox', { name: 'Date Range' });
    await act(async () => {
      fireEvent.change(dateRangeSelect, { target: { value: 'custom' } });
    });
    const startDateInput = screen.getByRole('textbox', { name: 'Start Date' });
    const endDateInput = screen.getByRole('textbox', { name: 'End Date' });
    await act(async () => {
      fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
      fireEvent.change(endDateInput, { target: { value: '2024-01-05' } });
    });
    const exportButton = screen.getByRole('button', { name: 'Export Report' });
    await act(async () => {
      fireEvent.click(exportButton);
    });
    expect(mockOnExport).toHaveBeenCalledWith('pdf', {
      includeCharts: true,
      includeTables: true,
      dateRange: 'custom',
      sections: {
        overview: true,
        details: true,
        metrics: true,
        trends: true
      },
      customDateRange: {
        start: '2024-01-01',
        end: '2024-01-05'
      }
    });
  });
});