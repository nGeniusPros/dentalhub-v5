import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../../components/ui/button";

interface CreateCampaignDialogProps {
  open: boolean;
  onClose: () => void;
}

export const CreateCampaignDialog: React.FC<CreateCampaignDialogProps> = ({
  open,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [campaignType, setCampaignType] = useState("");
  const [patientSelection, setPatientSelection] = useState("group");
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<Date | null>(null);
  const [customCriteria, setCustomCriteria] = useState<
    Array<{
      field: string;
      operator: string;
      value: string;
    }>
  >([]);

  if (!open) return null;

  const campaignTypes = [
    {
      id: "recall",
      name: "Recall",
      icon: "RotateCcw",
      description: "Contact patients due for regular checkups",
    },
    {
      id: "reactivation",
      name: "Reactivation",
      icon: "UserPlus",
      description: "Re-engage inactive patients",
    },
    {
      id: "treatment",
      name: "Treatment",
      icon: "Stethoscope",
      description: "Follow up on pending treatments",
    },
    {
      id: "appointment",
      name: "Appointment",
      icon: "Calendar",
      description: "Remind about upcoming appointments",
    },
    {
      id: "event",
      name: "Event",
      icon: "Calendar",
      description: "Promote practice events or specials",
    },
    {
      id: "custom",
      name: "Custom",
      icon: "Settings",
      description: "Create a custom campaign",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Create Voice Campaign
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
          <div className="mt-4 flex gap-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex items-center gap-2 ${
                  s === step ? "text-primary" : "text-gray-500"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    s === step ? "bg-primary text-white" : "bg-gray-100"
                  }`}
                >
                  {s}
                </div>
                <span className="text-sm font-medium">
                  {s === 1
                    ? "Campaign Type"
                    : s === 2
                      ? "Patient Selection"
                      : "Schedule"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaignTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setCampaignType(type.id)}
                  className={`p-4 rounded-lg border ${
                    campaignType === type.id
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-primary/50"
                  } text-left transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    {React.createElement(
                      Icons[type.icon as keyof typeof Icons],
                      {
                        className: `w-5 h-5 ${
                          campaignType === type.id
                            ? "text-primary"
                            : "text-gray-400"
                        }`,
                      },
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900">{type.name}</h3>
                      <p className="text-sm text-gray-500">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex gap-4">
                <button
                  onClick={() => setPatientSelection("group")}
                  className={`flex-1 p-4 rounded-lg border ${
                    patientSelection === "group"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-primary/50"
                  }`}
                >
                  <h3 className="font-medium text-gray-900">Patient Group</h3>
                  <p className="text-sm text-gray-500">
                    Select patients based on criteria
                  </p>
                </button>
                <button
                  onClick={() => setPatientSelection("individual")}
                  className={`flex-1 p-4 rounded-lg border ${
                    patientSelection === "individual"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-primary/50"
                  }`}
                >
                  <h3 className="font-medium text-gray-900">
                    Individual Patients
                  </h3>
                  <p className="text-sm text-gray-500">
                    Select specific patients
                  </p>
                </button>
                <button
                  onClick={() => setPatientSelection("upload")}
                  className={`flex-1 p-4 rounded-lg border ${
                    patientSelection === "upload"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-primary/50"
                  }`}
                >
                  <h3 className="font-medium text-gray-900">Upload List</h3>
                  <p className="text-sm text-gray-500">
                    Import patient list from file
                  </p>
                </button>
              </div>

              {patientSelection === "group" && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Patient Criteria
                      </label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCustomCriteria([
                            ...customCriteria,
                            { field: "", operator: "", value: "" },
                          ])
                        }
                      >
                        <Icons.Plus className="w-4 h-4 mr-2" />
                        Add Criteria
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {/* Predefined Criteria */}
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                          <option value="">
                            Select predefined criteria...
                          </option>
                          <option>Last visit more than 6 months ago</option>
                          <option>Unscheduled treatment plans</option>
                          <option>Missed appointments</option>
                          <option>Due for recall</option>
                        </select>
                      </div>

                      {/* Custom Criteria */}
                      {customCriteria.map((criteria, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex gap-3">
                            <select
                              value={criteria.field}
                              onChange={(e) => {
                                const newCriteria = [...customCriteria];
                                newCriteria[index].field = e.target.value;
                                setCustomCriteria(newCriteria);
                              }}
                              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                            >
                              <option value="">Select field...</option>
                              <optgroup label="Patient Info">
                                <option value="age">Age</option>
                                <option value="gender">Gender</option>
                                <option value="insurance">Insurance</option>
                                <option value="zipCode">ZIP Code</option>
                              </optgroup>
                              <optgroup label="Clinical">
                                <option value="lastVisit">
                                  Last Visit Date
                                </option>
                                <option value="nextRecall">
                                  Next Recall Date
                                </option>
                                <option value="treatmentValue">
                                  Treatment Value
                                </option>
                                <option value="procedureCodes">
                                  Procedure Codes
                                </option>
                              </optgroup>
                              <optgroup label="Financial">
                                <option value="accountBalance">
                                  Account Balance
                                </option>
                                <option value="insuranceType">
                                  Insurance Type
                                </option>
                                <option value="paymentPlan">
                                  Payment Plan
                                </option>
                              </optgroup>
                              <optgroup label="Communication">
                                <option value="preferredContact">
                                  Preferred Contact
                                </option>
                                <option value="language">Language</option>
                                <option value="marketingConsent">
                                  Marketing Consent
                                </option>
                              </optgroup>
                            </select>

                            <select
                              value={criteria.operator}
                              onChange={(e) => {
                                const newCriteria = [...customCriteria];
                                newCriteria[index].operator = e.target.value;
                                setCustomCriteria(newCriteria);
                              }}
                              className="w-40 px-4 py-2 border border-gray-200 rounded-lg"
                            >
                              <option value="">Operator...</option>
                              <option value="equals">Equals</option>
                              <option value="notEquals">Does not equal</option>
                              <option value="contains">Contains</option>
                              <option value="greaterThan">Greater than</option>
                              <option value="lessThan">Less than</option>
                              <option value="between">Between</option>
                              <option value="in">In list</option>
                            </select>

                            <input
                              type="text"
                              value={criteria.value}
                              onChange={(e) => {
                                const newCriteria = [...customCriteria];
                                newCriteria[index].value = e.target.value;
                                setCustomCriteria(newCriteria);
                              }}
                              placeholder="Value"
                              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                            />

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newCriteria = customCriteria.filter(
                                  (_, i) => i !== index,
                                );
                                setCustomCriteria(newCriteria);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Icons.Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Filters
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">
                          Include inactive patients
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">
                          Only patients with valid phone numbers
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">
                          Exclude patients who opted out
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">
                          Only patients with marketing consent
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {patientSelection === "individual" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search Patients
                  </label>
                  <div className="relative">
                    <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, phone, or ID..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>
              )}

              {patientSelection === "upload" && (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8">
                  <div className="flex flex-col items-center">
                    <Icons.Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-500 mb-4 text-center">
                      Drag and drop your patient list here, or click to browse.
                      <br />
                      Supported formats: CSV, Excel
                    </p>
                    <Button variant="outline">Browse Files</Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule Campaign
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Call Settings
                </label>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Maximum Attempts
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                      <option>1 attempt</option>
                      <option>2 attempts</option>
                      <option>3 attempts</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Time Between Attempts
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                      <option>1 hour</option>
                      <option>2 hours</option>
                      <option>4 hours</option>
                      <option>1 day</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message Preview
                </label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    "Hello, this is [Practice Name] calling to remind you about
                    your upcoming dental appointment..."
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between">
          <Button
            variant="outline"
            onClick={() => (step > 1 ? setStep(step - 1) : onClose)}
          >
            {step > 1 ? "Previous" : "Cancel"}
          </Button>
          <Button
            onClick={() => (step < 3 ? setStep(step + 1) : onClose)}
            disabled={step === 1 && !campaignType}
          >
            {step < 3 ? "Next" : "Create Campaign"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
