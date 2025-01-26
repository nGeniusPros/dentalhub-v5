import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { useNotifications } from "../../../../../contexts/NotificationContext";

interface AddProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (provider: any) => void;
}

export const AddProviderModal: React.FC<AddProviderModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    license: "",
    expiration: "",
    documents: [] as Array<{
      type: string;
      number: string;
      expirationDate: string;
      file?: File;
    }>,
    email: "",
    phone: "",
    specialty: "",
    startDate: "",
  });

  const { dispatch: notifyDispatch } = useNotifications();

  const documentTypes = [
    "State License",
    "DEA Registration",
    "Malpractice Insurance",
    "Board Certification",
    "CPR Certification",
    "Controlled Substance License",
    "HIPAA Certification",
    "Continuing Education Records",
    "Professional References",
    "Background Check",
    "Immunization Records",
    "COVID-19 Vaccination",
  ];

  const handleFileUpload = (index: number, file: File) => {
    const newDocuments = [...formData.documents];
    newDocuments[index] = { ...newDocuments[index], file };
    setFormData({ ...formData, documents: newDocuments });
  };

  const addDocument = () => {
    setFormData({
      ...formData,
      documents: [
        ...formData.documents,
        { type: "", number: "", expirationDate: "" },
      ],
    });
  };

  const removeDocument = (index: number) => {
    const newDocuments = formData.documents.filter((_, i) => i !== index);
    setFormData({ ...formData, documents: newDocuments });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create notifications for document expirations
    formData.documents.forEach((doc) => {
      const expirationDate = new Date(doc.expirationDate);
      const thirtyDaysBefore = new Date(expirationDate);
      thirtyDaysBefore.setDate(thirtyDaysBefore.getDate() - 30);

      notifyDispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          id: Date.now().toString(),
          type: "alert",
          title: "Document Expiration Reminder",
          message: `${doc.type} for ${formData.name} expires on ${doc.expirationDate}`,
          timestamp: thirtyDaysBefore.toISOString(),
          read: false,
          priority: "high",
          metadata: {
            providerName: formData.name,
            documentType: doc.type,
            expirationDate: doc.expirationDate,
          },
        },
      });
    });

    onAdd(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Add New Provider</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provider Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Number
              </label>
              <input
                type="text"
                value={formData.license}
                onChange={(e) =>
                  setFormData({ ...formData, license: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialty
              </label>
              <input
                type="text"
                value={formData.specialty}
                onChange={(e) =>
                  setFormData({ ...formData, specialty: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>
          </div>

          {/* Documents Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Required Documents</h3>
              <Button type="button" onClick={addDocument}>
                <Icons.Plus className="w-4 h-4 mr-2" />
                Add Document
              </Button>
            </div>

            <div className="space-y-4">
              {formData.documents.map((doc, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Document Type
                      </label>
                      <select
                        value={doc.type}
                        onChange={(e) => {
                          const newDocs = [...formData.documents];
                          newDocs[index] = { ...doc, type: e.target.value };
                          setFormData({ ...formData, documents: newDocs });
                        }}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                        required
                      >
                        <option value="">Select type...</option>
                        {documentTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Document Number
                      </label>
                      <input
                        type="text"
                        value={doc.number}
                        onChange={(e) => {
                          const newDocs = [...formData.documents];
                          newDocs[index] = { ...doc, number: e.target.value };
                          setFormData({ ...formData, documents: newDocs });
                        }}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiration Date
                      </label>
                      <input
                        type="date"
                        value={doc.expirationDate}
                        onChange={(e) => {
                          const newDocs = [...formData.documents];
                          newDocs[index] = {
                            ...doc,
                            expirationDate: e.target.value,
                          };
                          setFormData({ ...formData, documents: newDocs });
                        }}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex-1">
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(index, file);
                          }
                        }}
                        className="hidden"
                        id={`file-upload-${index}`}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                      <label
                        htmlFor={`file-upload-${index}`}
                        className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        <Icons.Upload className="w-4 h-4 mr-2" />
                        {doc.file ? doc.file.name : "Upload Document"}
                      </label>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Icons.Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Provider</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
