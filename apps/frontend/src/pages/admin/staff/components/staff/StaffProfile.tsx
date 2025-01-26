import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import type { Employee } from "../../../../../types/employee";

interface StaffProfileProps {
  employee: Employee;
  onEdit: () => void;
  onClose: () => void;
}

export const StaffProfile: React.FC<StaffProfileProps> = ({
  employee,
  onEdit,
  onClose,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Icons.User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {employee.personalInfo.name}
              </h2>
              <p className="text-gray-500">{employee.employmentDetails.role}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onEdit}>
              <Icons.Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button variant="ghost" onClick={onClose}>
              <Icons.X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Personal Information */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Date of Birth</label>
                <p className="font-medium">
                  {employee.personalInfo.dateOfBirth}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">SSN</label>
                <p className="font-medium">
                  XXX-XX-{employee.personalInfo.ssn.slice(-4)}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="font-medium">{employee.personalInfo.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Phone</label>
                <p className="font-medium">{employee.personalInfo.phone}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm text-gray-500">Address</label>
                <p className="font-medium">{employee.personalInfo.address}</p>
              </div>
            </div>
          </section>

          {/* Employment Details */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Employment Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Department</label>
                <p className="font-medium">
                  {employee.employmentDetails.department}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Start Date</label>
                <p className="font-medium">
                  {employee.employmentDetails.startDate}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Current Pay</label>
                <p className="font-medium">
                  {formatCurrency(
                    employee.employmentDetails.compensation.currentPay,
                  )}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Pay Frequency</label>
                <p className="font-medium capitalize">
                  {employee.employmentDetails.compensation.payFrequency}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Last Raise Date</label>
                <p className="font-medium">
                  {employee.employmentDetails.compensation.lastRaiseDate ||
                    "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">
                  Next Review Date
                </label>
                <p className="font-medium">
                  {employee.employmentDetails.compensation.nextReviewDate ||
                    "N/A"}
                </p>
              </div>
            </div>
          </section>

          {/* Emergency Contact */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Name</label>
                <p className="font-medium">{employee.emergencyContact.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Relationship</label>
                <p className="font-medium">
                  {employee.emergencyContact.relationship}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Phone</label>
                <p className="font-medium">{employee.emergencyContact.phone}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="font-medium">
                  {employee.emergencyContact.email || "N/A"}
                </p>
              </div>
              {employee.emergencyContact.address && (
                <div className="col-span-2">
                  <label className="text-sm text-gray-500">Address</label>
                  <p className="font-medium">
                    {employee.emergencyContact.address}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Documents */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Documents</h3>
              <Button>
                <Icons.Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
            <div className="space-y-4">
              {employee.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Icons.FileText className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-gray-500">
                        Uploaded: {doc.uploadDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        doc.status === "valid"
                          ? "bg-green-100 text-green-800"
                          : doc.status === "expired"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {doc.status}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Icons.Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
};
