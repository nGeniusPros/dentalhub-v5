import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../components/ui/button";
import { LabFeesManager } from "./components/LabFeesManager";
import { VendorForm } from "./components/VendorForm";
import { cn } from "../../../lib/utils";
import type { Vendor, VendorGroup } from "./types/vendor";

const VendorManagement = () => {
  const [vendorGroups, setVendorGroups] = useState<VendorGroup[]>([
    {
      name: "Insurance Carriers",
      vendors: [
        {
          id: "1",
          name: "Blue Cross Blue Shield",
          category: "Insurance",
          payorId: "BCBS123",
          networkStatus: "in-network",
          contactName: "Sarah Johnson",
          email: "sarah.j@bcbs.com",
          phone: "(555) 123-4567",
          website: "bcbs.com",
          notes: ["Preferred provider", "Quick claim processing"],
          credentials: {
            username: "dentaladmin",
            password: "••••••••",
          },
        },
        {
          id: "2",
          name: "Delta Dental",
          category: "Insurance",
          payorId: "DD456",
          networkStatus: "in-network",
          contactName: "Mike Wilson",
          email: "mike.w@deltadental.com",
          phone: "(555) 234-5678",
          website: "deltadental.com",
          notes: ["Annual contract renewal in June"],
          credentials: {
            username: "deltaportal",
            password: "••••••••",
          },
        },
      ],
    },
    {
      name: "Dental Supplies",
      vendors: [
        {
          id: "3",
          name: "Patterson Dental",
          category: "Supplies",
          accountNumber: "PD789",
          contactName: "David Brown",
          email: "d.brown@patterson.com",
          phone: "(555) 345-6789",
          website: "pattersondental.com",
          notes: ["Monthly supply order", "Bulk discount available"],
          credentials: {
            username: "pattersonaccount",
            password: "••••••••",
          },
        },
        {
          id: "4",
          name: "Henry Schein",
          category: "Supplies",
          accountNumber: "HS101",
          contactName: "Lisa Chen",
          email: "l.chen@henryschein.com",
          phone: "(555) 456-7890",
          website: "henryschein.com",
          notes: ["Preferred vendor for specialty items"],
        },
      ],
    },
    {
      name: "Labs",
      vendors: [
        {
          id: "5",
          name: "Acme Dental Lab",
          category: "Laboratory",
          labType: "Crown & Bridge",
          accountNumber: "ADL202",
          contactName: "Robert Taylor",
          email: "r.taylor@acmelab.com",
          phone: "(555) 567-8901",
          website: "acmelab.com",
          notes: ["Excellent quality", "5-day turnaround time"],
          labFees: [
            {
              id: "1",
              code: "PFM",
              description: "Porcelain Fused to Metal Crown",
              fee: 225.0,
              effectiveDate: "2024-01-01",
            },
            {
              id: "2",
              code: "ECAD",
              description: "E-max CAD Crown",
              fee: 275.0,
              effectiveDate: "2024-01-01",
            },
          ],
        },
        {
          id: "6",
          name: "Premier Orthodontics Lab",
          category: "Laboratory",
          labType: "Ortho",
          accountNumber: "POL303",
          contactName: "Maria Garcia",
          email: "m.garcia@premierortho.com",
          phone: "(555) 678-9012",
          website: "premierortho.com",
          notes: ["Specializes in clear aligners"],
          labFees: [
            {
              id: "3",
              code: "ALIGNER",
              description: "Clear Aligner Set",
              fee: 450.0,
              effectiveDate: "2024-01-01",
            },
          ],
        },
      ],
    },
    {
      name: "Financial Services",
      vendors: [
        {
          id: "7",
          name: "CareCredit",
          category: "Financial",
          serviceType: "financing",
          contactName: "James Wilson",
          email: "j.wilson@carecredit.com",
          phone: "(555) 789-0123",
          website: "carecredit.com",
          notes: ["Patient financing partner"],
          credentials: {
            username: "ccportal",
            password: "••••••••",
          },
          accountDetails: {
            accountNumber: "CC404",
            accountType: "merchant",
          },
        },
        {
          id: "8",
          name: "Wells Fargo Practice Finance",
          category: "Financial",
          serviceType: "banking",
          contactName: "Patricia Lee",
          email: "p.lee@wellsfargo.com",
          phone: "(555) 890-1234",
          website: "wellsfargo.com",
          notes: ["Practice loan", "Business checking"],
          accountDetails: {
            accountNumber: "WF505",
            accountType: "checking",
            routingNumber: "121000248",
          },
        },
      ],
    },
    {
      name: "Utilities",
      vendors: [
        {
          id: "9",
          name: "City Power & Light",
          category: "Utilities",
          serviceType: "Electric",
          accountNumber: "CPL606",
          contactName: "Customer Service",
          email: "service@citypower.com",
          phone: "(555) 901-2345",
          website: "citypower.com",
          notes: ["Monthly auto-pay enabled"],
        },
        {
          id: "10",
          name: "Metro Water Services",
          category: "Utilities",
          serviceType: "Water",
          accountNumber: "MWS707",
          contactName: "Support Team",
          email: "support@metrowater.com",
          phone: "(555) 012-3456",
          website: "metrowater.com",
          notes: ["Quarterly billing"],
        },
      ],
    },
    {
      name: "Miscellaneous",
      vendors: [
        {
          id: "11",
          name: "Clean Pro Services",
          category: "Miscellaneous",
          serviceType: "Cleaning",
          accountNumber: "CPS808",
          contactName: "Tom Anderson",
          email: "t.anderson@cleanpro.com",
          phone: "(555) 123-4567",
          website: "cleanpro.com",
          notes: ["Weekly cleaning service", "OSHA compliant"],
        },
        {
          id: "12",
          name: "TechCare IT Solutions",
          category: "Miscellaneous",
          serviceType: "IT Support",
          accountNumber: "TC909",
          contactName: "Alex Kim",
          email: "a.kim@techcare.com",
          phone: "(555) 234-5678",
          website: "techcare.com",
          notes: ["24/7 support available", "Monthly maintenance"],
          credentials: {
            username: "techsupport",
            password: "••••••••",
          },
        },
      ],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showCredentials, setShowCredentials] = useState<
    Record<string, boolean>
  >({});
  const [editingNote, setEditingNote] = useState<{
    vendorId: string;
    note: string;
  }>({ vendorId: "", note: "" });
  const [editingVendor, setEditingVendor] = useState<Vendor | undefined>();
  const [isAddingVendor, setIsAddingVendor] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );

  const searchVendor = (vendor: Vendor, query: string) => {
    const searchStr = query.toLowerCase();
    return (
      vendor.name?.toLowerCase().includes(searchStr) ||
      vendor.category?.toLowerCase().includes(searchStr) ||
      vendor.contactName?.toLowerCase().includes(searchStr) ||
      vendor.email?.toLowerCase().includes(searchStr) ||
      vendor.phone?.toLowerCase().includes(searchStr) ||
      vendor.accountNumber?.toLowerCase().includes(searchStr) ||
      vendor.serviceType?.toLowerCase().includes(searchStr) ||
      vendor.labType?.toLowerCase().includes(searchStr) ||
      vendor.payorId?.toLowerCase().includes(searchStr) ||
      vendor.notes?.some((note) => note.toLowerCase().includes(searchStr)) ||
      vendor.labFees?.some(
        (fee) =>
          fee.code.toLowerCase().includes(searchStr) ||
          fee.description.toLowerCase().includes(searchStr),
      )
    );
  };

  const filteredGroups = vendorGroups
    .map((group) => ({
      ...group,
      vendors: group.vendors.filter((vendor) =>
        searchVendor(vendor, searchQuery),
      ),
    }))
    .filter((group) => group.vendors.length > 0);

  const toggleCredentialsVisibility = (vendorId: string) => {
    setShowCredentials((prev) => ({
      ...prev,
      [vendorId]: !prev[vendorId],
    }));
  };

  const addNote = (groupIndex: number, vendorIndex: number, note: string) => {
    const newGroups = [...vendorGroups];
    newGroups[groupIndex].vendors[vendorIndex].notes.push(note);
    setVendorGroups(newGroups);
    setEditingNote({ vendorId: "", note: "" });
  };

  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor);
  };

  const handleDeleteVendor = (groupIndex: number, vendorIndex: number) => {
    const vendor = vendorGroups[groupIndex].vendors[vendorIndex];
    setShowDeleteConfirm(vendor.id);
  };

  const confirmDelete = (groupIndex: number, vendorIndex: number) => {
    const newGroups = [...vendorGroups];
    newGroups[groupIndex].vendors.splice(vendorIndex, 1);
    setVendorGroups(newGroups);
    setShowDeleteConfirm(null);
  };

  const handleAddVendor = (newVendor: Partial<Vendor>) => {
    const vendor: Vendor = {
      id: Date.now().toString(),
      notes: [],
      ...newVendor,
    } as Vendor;

    const groupIndex = vendorGroups.findIndex(
      (g) => g.name === getGroupName(vendor.category),
    );
    if (groupIndex !== -1) {
      const newGroups = [...vendorGroups];
      newGroups[groupIndex].vendors.push(vendor);
      setVendorGroups(newGroups);
    }
    setShowAddVendor(false);
  };

  const handleUpdateVendor = (updatedVendor: Partial<Vendor>) => {
    if (!editingVendor) return;

    const newGroups = vendorGroups.map((group) => ({
      ...group,
      vendors: group.vendors.map((vendor) =>
        vendor.id === editingVendor.id
          ? { ...vendor, ...updatedVendor }
          : vendor,
      ),
    }));

    setVendorGroups(newGroups);
    setEditingVendor(undefined);
  };

  const getGroupName = (category: string): string => {
    switch (category) {
      case "Insurance":
        return "Insurance Carriers";
      case "Laboratory":
        return "Labs";
      case "Supplies":
        return "Dental Supplies";
      default:
        return "Other";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text">
            Contact Manager
          </h1>
          <p className="text-gray-600">
            Manage all your business contacts and information
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Icons.Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button
            className="bg-gradient-to-r from-navy via-purple to-turquoise text-white"
            onClick={() => setIsAddingVendor(true)}
          >
            <Icons.UserPlus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Add/Edit Vendor Form */}
      {(isAddingVendor || editingVendor) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text">
              {editingVendor ? "Edit" : "Add"} Contact
            </h2>
            <Button
              variant="ghost"
              onClick={() => {
                setIsAddingVendor(false);
                setEditingVendor(undefined);
              }}
              className="hover:bg-gray-100"
            >
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
          <VendorForm
            vendor={editingVendor}
            onSubmit={(vendor) => {
              if (editingVendor) {
                handleUpdateVendor(vendor);
              } else {
                handleAddVendor(vendor);
              }
              setIsAddingVendor(false);
              setEditingVendor(undefined);
            }}
            onCancel={() => {
              setIsAddingVendor(false);
              setEditingVendor(undefined);
            }}
          />
        </motion.div>
      )}
      {/* Search Bar */}
      <div className="relative">
        <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          aria-label="Search contacts"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, category, contact, account number, or any other field..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this vendor? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  const groupIndex = vendorGroups.findIndex((g) =>
                    g.vendors.some((v) => v.id === showDeleteConfirm),
                  );
                  const vendorIndex = vendorGroups[
                    groupIndex
                  ].vendors.findIndex((v) => v.id === showDeleteConfirm);
                  confirmDelete(groupIndex, vendorIndex);
                }}
              >
                Delete
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {filteredGroups.map((group, groupIndex) => (
          <motion.div
            key={groupIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-navy">{group.name}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingVendor(true)}
              >
                <Icons.Plus className="w-4 h-4" />
                Add {group.name.slice(0, -1)}
              </Button>
            </div>

            <div className="space-y-4">
              {group.vendors.map((vendor, vendorIndex) => (
                <div
                  key={vendor.id}
                  className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-navy to-purple rounded-lg">
                        <Icons.Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-navy">
                          {vendor.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {vendor.category}
                          {vendor.category === "Laboratory" &&
                            vendor.labType && (
                              <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs">
                                {vendor.labType}
                              </span>
                            )}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditVendor(vendor)}
                      >
                        <Icons.Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDeleteVendor(groupIndex, vendorIndex)
                        }
                      >
                        <Icons.Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <Icons.User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{vendor.contactName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icons.Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{vendor.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icons.Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{vendor.phone}</span>
                    </div>
                  </div>

                  {/* Insurance Carrier Specific Fields */}
                  {vendor.category === "Insurance" && (
                    <div className="mt-4 space-y-3 border-t border-gray-200 pt-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icons.Key className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium">
                            Portal Credentials
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCredentialsVisibility(vendor.id)}
                        >
                          {showCredentials[vendor.id] ? (
                            <Icons.EyeOff className="w-4 h-4" />
                          ) : (
                            <Icons.Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      {vendor.credentials && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs text-gray-500">
                              Username
                            </label>
                            <p className="text-sm font-medium">
                              {vendor.credentials.username}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">
                              Password
                            </label>
                            <p className="text-sm font-medium">
                              {showCredentials[vendor.id]
                                ? vendor.credentials.password
                                : "••••••••"}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        <div>
                          <label className="text-xs text-gray-500">
                            Payor ID
                          </label>
                          <p className="text-sm font-medium">
                            {vendor.payorId}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">
                            Network Status
                          </label>
                          <span
                            className={cn(
                              "px-2 py-1 text-xs font-medium rounded-full",
                              vendor.networkStatus === "in-network"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800",
                            )}
                          >
                            {vendor.networkStatus?.replace("-", " ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Lab/Supplier Account Number */}
                  {(vendor.category === "Laboratory" ||
                    vendor.category === "Supplies") && (
                    <div className="mt-4 border-t border-gray-200 pt-3">
                      <div className="flex items-center gap-2">
                        <Icons.Hash className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          Account: {vendor.accountNumber}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Lab Fees Section */}
                  {vendor.category === "Laboratory" && (
                    <div className="mt-4 border-t border-gray-200 pt-3">
                      <LabFeesManager
                        vendor={vendor}
                        onUpdate={(fees) => {
                          const newGroups = [...vendorGroups];
                          const vendorToUpdate =
                            newGroups[groupIndex].vendors[vendorIndex];
                          vendorToUpdate.labFees = fees;
                          setVendorGroups(newGroups);
                        }}
                      />
                    </div>
                  )}

                  {/* Notes Section */}
                  <div className="mt-4 border-t border-gray-200 pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        Notes
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setEditingNote({ vendorId: vendor.id, note: "" })
                        }
                      >
                        <Icons.Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {vendor.notes.map((note, noteIndex) => (
                        <div
                          key={noteIndex}
                          className="text-sm text-gray-600 bg-gray-50 p-2 rounded"
                        >
                          {note}
                        </div>
                      ))}
                      {editingNote.vendorId === vendor.id && (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editingNote.note}
                            onChange={(e) =>
                              setEditingNote((prev) => ({
                                ...prev,
                                note: e.target.value,
                              }))
                            }
                            className="flex-1 px-3 py-1 text-sm border border-gray-200 rounded"
                            placeholder="Add a note..."
                          />
                          <Button
                            size="sm"
                            onClick={() =>
                              addNote(groupIndex, vendorIndex, editingNote.note)
                            }
                          >
                            Save
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {vendor.website && (
                    <div className="mt-2 flex items-center gap-2">
                      <Icons.Globe className="w-4 h-4 text-gray-400" />
                      <a
                        href={`https://${vendor.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple hover:text-purple-light"
                      >
                        {vendor.website}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VendorManagement;
