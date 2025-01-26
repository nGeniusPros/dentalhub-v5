import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../../components/ui/button";
import { cn } from "../../../../../lib/utils";
import { TrainingAssignmentButton } from "../../../../../components/staff/TrainingAssignmentButton";
import { formatCurrency } from "../../../../../lib/utils/currency";

interface ViewProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: {
    name: string;
    role: string;
    department: string;
    email: string;
    phone: string;
    status: string;
    startDate: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
    payrollInfo?: {
      salary: string;
      payFrequency: string;
      lastReviewDate?: string;
      nextReviewDate?: string;
    };
    bonusStructure?: {
      enrolled: boolean;
      type: string;
      frequency: string;
      targets: Array<{
        metric: string;
        target: number;
        bonus: number;
      }>;
      customPayoutDates?: string[];
      notes?: string;
    };
    notes?: Array<{
      id: string;
      content: string;
      category: string;
      date: string;
      author: string;
    }>;
    credentials?: {
      licenses?: Array<{
        type: string;
        number: string;
        expirationDate: string;
      }>;
      certifications?: Array<{
        name: string;
        issuedDate: string;
        expirationDate: string;
      }>;
    };
    emergencyContact?: {
      name: string;
      relationship: string;
      phone: string;
      email?: string;
    };
    documents?: Array<{
      id: string;
      name: string;
      type: string;
      uploadDate: string;
      status: string;
    }>;
  };
}

export const ViewProfileModal: React.FC<ViewProfileModalProps> = ({
  isOpen,
  onClose,
  staff,
}) => {
  const navigate = useNavigate();

  if (!isOpen || !staff) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Icons.User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {staff.name}
                </h2>
                <p className="text-gray-500">
                  {staff.role} - {staff.department}
                </p>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  onClose();
                  navigate("/admin-dashboard/resources");
                }}
              >
                <Icons.BookOpen className="w-4 h-4 mr-2" />
                Resources
              </Button>
              <Button variant="outline">
                <Icons.GraduationCap className="w-4 h-4 mr-2" />
                Learning Center
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Status Banner */}
          <div
            className={cn(
              "p-4 rounded-lg",
              staff.status === "active" ? "bg-green-50" : "bg-gray-50",
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icons.CircleDot
                  className={cn(
                    "w-4 h-4",
                    staff.status === "active"
                      ? "text-green-500"
                      : "text-gray-500",
                  )}
                />
                <span className="font-medium capitalize">{staff.status}</span>
              </div>
              <div className="text-sm text-gray-500">
                Started {new Date(staff.startDate).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="font-medium">{staff.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Phone</label>
                <p className="font-medium">{staff.phone}</p>
              </div>
              {staff.address && (
                <div className="col-span-2">
                  <label className="text-sm text-gray-500">Address</label>
                  <p className="font-medium">
                    {staff.address.street}
                    <br />
                    {staff.address.city}, {staff.address.state}{" "}
                    {staff.address.zip}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Employment Details */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Employment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Department</label>
                <p className="font-medium">{staff.department}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Role</label>
                <p className="font-medium">{staff.role}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Start Date</label>
                <p className="font-medium">
                  {new Date(staff.startDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Status</label>
                <p className="font-medium capitalize">{staff.status}</p>
              </div>
            </div>
          </section>

          {/* Payroll Information */}
          {staff.payrollInfo && (
            <section>
              <h3 className="text-lg font-semibold mb-4">
                Payroll Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Salary/Rate</label>
                  <p className="font-medium">
                    {formatCurrency(parseFloat(staff.payrollInfo.salary))}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Pay Frequency</label>
                  <p className="font-medium capitalize">
                    {staff.payrollInfo.payFrequency}
                  </p>
                </div>
                {staff.payrollInfo.lastReviewDate && (
                  <div>
                    <label className="text-sm text-gray-500">Last Review</label>
                    <p className="font-medium">
                      {new Date(
                        staff.payrollInfo.lastReviewDate,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {staff.payrollInfo.nextReviewDate && (
                  <div>
                    <label className="text-sm text-gray-500">Next Review</label>
                    <p className="font-medium">
                      {new Date(
                        staff.payrollInfo.nextReviewDate,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Bonus Structure */}
          {staff.bonusStructure && (
            <section>
              <h3 className="text-lg font-semibold mb-4">Bonus Structure</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Icons.CheckCircle2
                    className={cn(
                      "w-5 h-5",
                      staff.bonusStructure.enrolled
                        ? "text-green-500"
                        : "text-gray-400",
                    )}
                  />
                  <span className="font-medium">
                    {staff.bonusStructure.enrolled
                      ? "Enrolled in Bonus Program"
                      : "Not Enrolled in Bonus Program"}
                  </span>
                </div>

                {staff.bonusStructure.enrolled && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500">
                          Bonus Type
                        </label>
                        <p className="font-medium capitalize">
                          {staff.bonusStructure.type}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">
                          Payout Frequency
                        </label>
                        <p className="font-medium capitalize">
                          {staff.bonusStructure.frequency}
                        </p>
                      </div>
                    </div>

                    {staff.bonusStructure.targets.length > 0 && (
                      <div>
                        <label className="text-sm text-gray-500 block mb-2">
                          Bonus Targets
                        </label>
                        <div className="space-y-2">
                          {staff.bonusStructure.targets.map((target, index) => (
                            <div
                              key={index}
                              className="p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <label className="text-xs text-gray-500">
                                    Metric
                                  </label>
                                  <p className="font-medium">{target.metric}</p>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500">
                                    Target
                                  </label>
                                  <p className="font-medium">{target.target}</p>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500">
                                    Bonus
                                  </label>
                                  <p className="font-medium">
                                    {formatCurrency(target.bonus)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {staff.bonusStructure.customPayoutDates &&
                      staff.bonusStructure.customPayoutDates.length > 0 && (
                        <div>
                          <label className="text-sm text-gray-500 block mb-2">
                            Custom Payout Dates
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {staff.bonusStructure.customPayoutDates.map(
                              (date, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                                >
                                  {date}
                                </span>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                    {staff.bonusStructure.notes && (
                      <div>
                        <label className="text-sm text-gray-500 block mb-2">
                          Bonus Notes
                        </label>
                        <p className="text-sm bg-gray-50 p-3 rounded-lg">
                          {staff.bonusStructure.notes}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </section>
          )}

          {/* Credentials & Licenses */}
          {staff.credentials && (
            <section>
              <h3 className="text-lg font-semibold mb-4">
                Credentials & Licenses
              </h3>
              <div className="space-y-4">
                {staff.credentials.licenses?.map((license, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm text-gray-500">Type</label>
                        <p className="font-medium">{license.type}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Number</label>
                        <p className="font-medium">{license.number}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">
                          Expiration
                        </label>
                        <p className="font-medium">
                          {new Date(
                            license.expirationDate,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {staff.credentials.certifications?.map((cert, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm text-gray-500">
                          Certification
                        </label>
                        <p className="font-medium">{cert.name}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">
                          Issued Date
                        </label>
                        <p className="font-medium">
                          {new Date(cert.issuedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">
                          Expiration
                        </label>
                        <p className="font-medium">
                          {new Date(cert.expirationDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Emergency Contact */}
          {staff.emergencyContact && (
            <section>
              <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Name</label>
                  <p className="font-medium">{staff.emergencyContact.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Relationship</label>
                  <p className="font-medium">
                    {staff.emergencyContact.relationship}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <p className="font-medium">{staff.emergencyContact.phone}</p>
                </div>
                {staff.emergencyContact.email && (
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="font-medium">
                      {staff.emergencyContact.email}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Documents */}
          {staff.documents && staff.documents.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold mb-4">Documents</h3>
              <div className="space-y-2">
                {staff.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Icons.FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">
                          Uploaded{" "}
                          {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full",
                        doc.status === "valid" && "bg-green-100 text-green-800",
                        doc.status === "expired" && "bg-red-100 text-red-800",
                        doc.status === "pending" &&
                          "bg-yellow-100 text-yellow-800",
                      )}
                    >
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Notes */}
          {staff.notes && staff.notes.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold mb-4">Staff Notes</h3>
              <div className="space-y-4">
                {staff.notes.map((note) => (
                  <div key={note.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-200 rounded-full">
                        {note.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(note.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{note.content}</p>
                    <p className="text-sm text-gray-500">
                      Added by {note.author}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <TrainingAssignmentButton
              staffId={staff.id}
              staffName={staff.name}
              onAssign={(modules) => {
                console.log("Assigned modules:", modules);
                // Handle module assignment
              }}
            />
            <Button>
              <Icons.Printer className="w-4 h-4 mr-2" />
              Print Profile
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
