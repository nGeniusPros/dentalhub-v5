/// <reference types="vitest" />
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { expect } from "vitest";
import { ExportReportButton } from "./ExportReportButton";
import { useNotifications } from "../contexts/NotificationContext";
import { act } from "react-dom/test-utils";
import { vi } from "vitest";

// Mock the useNotifications hook
vi.mock("../contexts/NotificationContext", () => ({
  useNotifications: () => ({
    dispatch: vi.fn(),
  }),
}));

describe("ExportReportButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the button with default props", () => {
    render(<ExportReportButton />);
    expect(
      screen.getByRole("button", { name: "Export Report" }),
    ).toBeInTheDocument();
  });

  it("should render the button with custom variant and size", () => {
    render(<ExportReportButton variant="ghost" size="sm" />);
    const button = screen.getByRole("button", { name: "Export Report" });
    expect(button).toHaveClass("ghost", "sm");
  });

  it("should render the button with custom className", () => {
    render(<ExportReportButton className="custom-class" />);
    const button = screen.getByRole("button", { name: "Export Report" });
    expect(button).toHaveClass("custom-class");
  });

  it("should open the export dialog when clicked", async () => {
    render(<ExportReportButton />);
    const button = screen.getByRole("button", { name: "Export Report" });
    await act(async () => {
      fireEvent.click(button);
    });
    expect(
      screen.getByRole("heading", { name: "Export Report" }),
    ).toBeInTheDocument();
  });

  it("should close the export dialog when onClose is called", async () => {
    render(<ExportReportButton />);
    const button = screen.getByRole("button", { name: "Export Report" });
    await act(async () => {
      fireEvent.click(button);
    });
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    await act(async () => {
      fireEvent.click(cancelButton);
    });
    expect(screen.queryByRole("heading", { name: "Export Report" })).toBeNull();
  });

  it("should dispatch a notification when export is triggered", async () => {
    const mockDispatch = jest.fn();
    (useNotifications as jest.Mock).mockReturnValue({
      dispatch: mockDispatch,
    });

    render(<ExportReportButton />);
    const button = screen.getByRole("button", { name: "Export Report" });
    await act(async () => {
      fireEvent.click(button);
    });
    const exportButton = screen.getByRole("button", { name: "Export Report" });
    await act(async () => {
      fireEvent.click(exportButton);
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "ADD_NOTIFICATION",
      payload: expect.objectContaining({
        type: "message",
        title: "Report Export Started",
        message: "Your report is being generated and will be ready shortly.",
        read: false,
        priority: "medium",
      }),
    });
  });

  it("should pass data and type props to the export dialog", async () => {
    const mockData = [
      {
        id: "1",
        firstName: "Test",
        lastName: "Staff",
        email: "test@example.com",
        phone: "1234567890",
        role: "admin",
        department: "IT",
        status: "active" as const,
        startDate: "2024-01-01",
        salary: 100000,
        payFrequency: "monthly" as const,
      },
    ];
    render(<ExportReportButton data={mockData} type="staff" />);
    const button = screen.getByRole("button", { name: "Export Report" });
    await act(async () => {
      fireEvent.click(button);
    });

    // Verify that the dialog is rendered with the correct props
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    // Try to export as CSV to verify data is passed correctly
    const formatSelect = screen.getByRole("combobox", {
      name: "Export Format",
    });
    await act(async () => {
      fireEvent.change(formatSelect, { target: { value: "csv" } });
    });
    const exportButton = screen.getByRole("button", { name: "Export Report" });
    await act(async () => {
      fireEvent.click(exportButton);
    });

    // The CSV content should be generated from the mock data
    // This is indirectly testing that the data was passed correctly
    expect(
      screen.queryByText("Error: No data available for CSV export"),
    ).toBeNull();
  });
});
