import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { cn } from "../../../../lib/utils";

interface ResourceGridProps {
  searchQuery: string;
  selectedCategory: string;
  selectedFilters: string[];
}

export const ResourceGrid: React.FC<ResourceGridProps> = ({
  searchQuery,
  selectedCategory,
  selectedFilters,
}) => {
  const resources = [
    {
      id: "1",
      title: "HIPAA Compliance Guide",
      description: "Comprehensive guide to HIPAA compliance",
      type: "document",
      category: "compliance",
      lastUpdated: "2024-03-01",
      required: true,
      tags: ["compliance", "hipaa", "required"],
    },
    {
      id: "2",
      title: "Patient Intake Form",
      description: "Standard patient intake form template",
      type: "form",
      category: "clinical",
      lastUpdated: "2024-02-15",
      required: false,
      tags: ["forms", "patient", "intake"],
    },
  ];

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      selectedCategory === "all" || resource.category === selectedCategory;

    const matchesFilters =
      selectedFilters.length === 0 ||
      (selectedFilters.includes("required") && resource.required) ||
      (selectedFilters.includes("new") &&
        new Date(resource.lastUpdated) >
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

    return matchesSearch && matchesCategory && matchesFilters;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredResources.map((resource) => (
        <motion.div
          key={resource.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className={cn(
                "p-2 rounded-lg",
                resource.type === "document" && "bg-blue-100 text-blue-600",
                resource.type === "form" && "bg-green-100 text-green-600",
              )}
            >
              {resource.type === "document" && (
                <Icons.FileText className="w-5 h-5" />
              )}
              {resource.type === "form" && (
                <Icons.ClipboardList className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{resource.title}</h3>
              <p className="text-sm text-gray-500">{resource.description}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {resource.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                Updated {new Date(resource.lastUpdated).toLocaleDateString()}
              </span>
              {resource.required && (
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                  Required
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Icons.Eye className="w-4 h-4 mr-2" />
                View
              </Button>
              <Button variant="outline" className="flex-1">
                <Icons.Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
