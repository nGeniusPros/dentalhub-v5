import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import type {
  Provider,
  ProviderCredential,
} from "../../../../../types/provider";

interface ProviderCredentialsFormProps {
  provider?: Provider;
  isOpen: boolean;
  onClose: () => void;
  onSave: (provider: Partial<Provider>) => void;
}

export const ProviderCredentialsForm: React.FC<
  ProviderCredentialsFormProps
> = ({ provider, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Provider>>(
    provider || {
      personalInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        ssn: "",
        dateOfBirth: "",
      },
      credentials: {
        license: [],
        dea: [],
        npi: [],
        taxId: "",
        specialtyCertifications: [],
      },
    },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleAddCredential = (type: keyof Provider["credentials"]) => {
    if (Array.isArray(formData.credentials?.[type])) {
      setFormData({
        ...formData,
        credentials: {
          ...formData.credentials,
          [type]: [
            ...(formData.credentials?.[type] as ProviderCredential[]),
            {
              id: Date.now().toString(),
              type: type as ProviderCredential["type"],
              number: "",
              issueDate: "",
              expirationDate: "",
              status: "pending",
            },
          ],
        },
      });
    }
  };

  const handleRemoveCredential = (
    type: keyof Provider["credentials"],
    id: string,
  ) => {
    if (Array.isArray(formData.credentials?.[type])) {
      setFormData({
        ...formData,
        credentials: {
          ...formData.credentials,
          [type]: (formData.credentials[type] as ProviderCredential[]).filter(
            (cred) => cred.id !== id,
          ),
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Provider Credentials</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Personal Information */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.personalInfo?.firstName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personalInfo: {
                        ...formData.personalInfo!,
                        firstName: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.personalInfo?.lastName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personalInfo: {
                        ...formData.personalInfo!,
                        lastName: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SSN
                </label>
                <input
                  type="password"
                  value={formData.personalInfo?.ssn}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personalInfo: {
                        ...formData.personalInfo!,
                        ssn: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.personalInfo?.dateOfBirth}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personalInfo: {
                        ...formData.personalInfo!,
                        dateOfBirth: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>
            </div>
          </section>

          {/* License Information */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">License Information</h3>
              <Button
                type="button"
                onClick={() => handleAddCredential("license")}
              >
                <Icons.Plus className="w-4 h-4 mr-2" />
                Add License
              </Button>
            </div>
            <div className="space-y-4">
              {formData.credentials?.license?.map((license, index) => (
                <div key={license.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        License Number
                      </label>
                      <input
                        type="text"
                        value={license.number}
                        onChange={(e) => {
                          const newLicenses = [
                            ...formData.credentials!.license,
                          ];
                          newLicenses[index] = {
                            ...license,
                            number: e.target.value,
                          };
                          setFormData({
                            ...formData,
                            credentials: {
                              ...formData.credentials!,
                              license: newLicenses,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        value={license.state}
                        onChange={(e) => {
                          const newLicenses = [
                            ...formData.credentials!.license,
                          ];
                          newLicenses[index] = {
                            ...license,
                            state: e.target.value,
                          };
                          setFormData({
                            ...formData,
                            credentials: {
                              ...formData.credentials!,
                              license: newLicenses,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Issue Date
                      </label>
                      <input
                        type="date"
                        value={license.issueDate}
                        onChange={(e) => {
                          const newLicenses = [
                            ...formData.credentials!.license,
                          ];
                          newLicenses[index] = {
                            ...license,
                            issueDate: e.target.value,
                          };
                          setFormData({
                            ...formData,
                            credentials: {
                              ...formData.credentials!,
                              license: newLicenses,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiration Date
                      </label>
                      <input
                        type="date"
                        value={license.expirationDate}
                        onChange={(e) => {
                          const newLicenses = [
                            ...formData.credentials!.license,
                          ];
                          newLicenses[index] = {
                            ...license,
                            expirationDate: e.target.value,
                          };
                          setFormData({
                            ...formData,
                            credentials: {
                              ...formData.credentials!,
                              license: newLicenses,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() =>
                        handleRemoveCredential("license", license.id)
                      }
                      className="text-red-600 hover:text-red-700"
                    >
                      <Icons.Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* DEA Registration */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">DEA Registration</h3>
              <Button type="button" onClick={() => handleAddCredential("dea")}>
                <Icons.Plus className="w-4 h-4 mr-2" />
                Add DEA
              </Button>
            </div>
            <div className="space-y-4">
              {formData.credentials?.dea?.map((dea, index) => (
                <div key={dea.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        DEA Number
                      </label>
                      <input
                        type="text"
                        value={dea.number}
                        onChange={(e) => {
                          const newDEAs = [...formData.credentials!.dea];
                          newDEAs[index] = { ...dea, number: e.target.value };
                          setFormData({
                            ...formData,
                            credentials: {
                              ...formData.credentials!,
                              dea: newDEAs,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiration Date
                      </label>
                      <input
                        type="date"
                        value={dea.expirationDate}
                        onChange={(e) => {
                          const newDEAs = [...formData.credentials!.dea];
                          newDEAs[index] = {
                            ...dea,
                            expirationDate: e.target.value,
                          };
                          setFormData({
                            ...formData,
                            credentials: {
                              ...formData.credentials!,
                              dea: newDEAs,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleRemoveCredential("dea", dea.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Icons.Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* NPI Information */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">NPI Information</h3>
              <Button type="button" onClick={() => handleAddCredential("npi")}>
                <Icons.Plus className="w-4 h-4 mr-2" />
                Add NPI
              </Button>
            </div>
            <div className="space-y-4">
              {formData.credentials?.npi?.map((npi, index) => (
                <div key={npi.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        NPI Number
                      </label>
                      <input
                        type="text"
                        value={npi.number}
                        onChange={(e) => {
                          const newNPIs = [...formData.credentials!.npi];
                          newNPIs[index] = { ...npi, number: e.target.value };
                          setFormData({
                            ...formData,
                            credentials: {
                              ...formData.credentials!,
                              npi: newNPIs,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Verification Date
                      </label>
                      <input
                        type="date"
                        value={npi.verificationDate}
                        onChange={(e) => {
                          const newNPIs = [...formData.credentials!.npi];
                          newNPIs[index] = {
                            ...npi,
                            verificationDate: e.target.value,
                          };
                          setFormData({
                            ...formData,
                            credentials: {
                              ...formData.credentials!,
                              npi: newNPIs,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleRemoveCredential("npi", npi.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Icons.Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tax ID */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Tax Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax ID Number
              </label>
              <input
                type="text"
                value={formData.credentials?.taxId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    credentials: {
                      ...formData.credentials!,
                      taxId: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>
          </section>

          {/* CPR Certification */}
          <section>
            <h3 className="text-lg font-semibold mb-4">CPR Certification</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certification Number
                  </label>
                  <input
                    type="text"
                    value={formData.credentials?.cprCertification?.number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        credentials: {
                          ...formData.credentials!,
                          cprCertification: {
                            ...formData.credentials?.cprCertification,
                            id:
                              formData.credentials?.cprCertification?.id ||
                              Date.now().toString(),
                            type: "cpr",
                            number: e.target.value,
                            status: "active",
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    value={
                      formData.credentials?.cprCertification?.expirationDate
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        credentials: {
                          ...formData.credentials!,
                          cprCertification: {
                            ...formData.credentials?.cprCertification,
                            expirationDate: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Credentials</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
