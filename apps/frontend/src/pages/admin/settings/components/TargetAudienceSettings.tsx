import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Toggle } from "../../../../components/ui/toggle";
import { useSettings } from "../../../../contexts/SettingsContext";
import type { Settings } from "../../../../types/settings";

interface DemographicSection {
  title: string;
  key: keyof Settings["targetAudience"]["demographics"];
  placeholder: string;
  icon: keyof typeof Icons;
  description: string;
}

const demographicSections: DemographicSection[] = [
  {
    title: "Age Groups",
    key: "ageRanges",
    placeholder: "Add age range...",
    icon: "CalendarDays",
    description: "Target specific age demographics",
  },
  {
    title: "Household Types",
    key: "householdTypes",
    placeholder: "Add household type...",
    icon: "Users",
    description: "Define household compositions",
  },
  {
    title: "Education Levels",
    key: "education",
    placeholder: "Add education level...",
    icon: "GraduationCap",
    description: "Educational background of patients",
  },
  {
    title: "Occupations",
    key: "occupations",
    placeholder: "Add occupation...",
    icon: "Briefcase",
    description: "Professional backgrounds",
  },
  {
    title: "Income Ranges",
    key: "incomeRanges",
    placeholder: "Add income range...",
    icon: "DollarSign",
    description: "Financial demographics",
  },
  {
    title: "Locations",
    key: "locations",
    placeholder: "Add location type...",
    icon: "MapPin",
    description: "Geographic targeting",
  },
];

export const TargetAudienceSettings = () => {
  const { state, updateSettings } = useSettings();
  const { settings } = state;

  const [newValues, setNewValues] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<{
    section: string;
    index: number;
    value: string;
  } | null>(null);

  const handleAdd = (
    section: keyof Settings["targetAudience"]["demographics"],
  ) => {
    if (!newValues[section]) return;

    const updatedDemographics = {
      ...settings.targetAudience.demographics,
      [section]: [
        ...settings.targetAudience.demographics[section],
        newValues[section],
      ],
    };

    updateSettings({
      targetAudience: {
        ...settings.targetAudience,
        demographics: updatedDemographics,
      },
    });

    setNewValues((prev) => ({ ...prev, [section]: "" }));
  };

  const handleRemove = (
    section: keyof Settings["targetAudience"]["demographics"],
    index: number,
  ) => {
    const updatedDemographics = {
      ...settings.targetAudience.demographics,
      [section]: settings.targetAudience.demographics[section].filter(
        (_, i) => i !== index,
      ),
    };

    updateSettings({
      targetAudience: {
        ...settings.targetAudience,
        demographics: updatedDemographics,
      },
    });
  };

  const handleEdit = (
    section: keyof Settings["targetAudience"]["demographics"],
    index: number,
    newValue: string,
  ) => {
    const updatedValues = [...settings.targetAudience.demographics[section]];
    updatedValues[index] = newValue;

    const updatedDemographics = {
      ...settings.targetAudience.demographics,
      [section]: updatedValues,
    };

    updateSettings({
      targetAudience: {
        ...settings.targetAudience,
        demographics: updatedDemographics,
      },
    });

    setEditing(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text">
            Target Demographics
          </h2>
          <p className="text-gray-500">
            Define your ideal patient demographics
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Icons.Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Icons.Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {demographicSections.map((section) => (
          <motion.div
            key={section.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                {React.createElement(Icons[section.icon], {
                  className: "w-5 h-5 text-primary",
                })}
              </div>
              <div>
                <h3 className="text-md font-semibold text-gray-900">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>
              <Toggle
                checked={
                  settings.targetAudience.demographics[section.key].length > 0
                }
                onChange={(checked) => {
                  if (!checked) {
                    const updatedDemographics = {
                      ...settings.targetAudience.demographics,
                      [section.key]: [],
                    };
                    updateSettings({
                      targetAudience: {
                        ...settings.targetAudience,
                        demographics: updatedDemographics,
                      },
                    });
                  }
                }}
                className="ml-auto"
              />
            </div>

            <div className="flex flex-wrap gap-2 min-h-[80px] mb-4 bg-gray-50 p-4 rounded-lg">
              {settings.targetAudience.demographics[section.key].map(
                (value, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200 shadow-sm group hover:border-primary hover:shadow-md transition-all duration-200"
                  >
                    {editing?.section === section.key &&
                    editing.index === index ? (
                      <input
                        type="text"
                        value={editing.value}
                        onChange={(e) =>
                          setEditing({ ...editing, value: e.target.value })
                        }
                        onBlur={() =>
                          handleEdit(section.key, index, editing.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleEdit(section.key, index, editing.value);
                          }
                        }}
                        className="bg-transparent border-none focus:outline-none focus:ring-0 px-0 py-0 w-full text-sm"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span
                          onClick={() =>
                            setEditing({
                              section: section.key,
                              index,
                              value,
                            })
                          }
                          className="cursor-pointer text-sm font-medium"
                        >
                          {value}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                          <button
                            onClick={() =>
                              setEditing({
                                section: section.key,
                                index,
                                value,
                              })
                            }
                            className="text-gray-400 hover:text-primary transition-colors"
                          >
                            <Icons.Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleRemove(section.key, index)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Icons.X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ),
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <input
                type="text"
                value={newValues[section.key] || ""}
                onChange={(e) =>
                  setNewValues((prev) => ({
                    ...prev,
                    [section.key]: e.target.value,
                  }))
                }
                placeholder={section.placeholder}
                className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm shadow-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAdd(section.key);
                  }
                }}
              />
              <Button
                onClick={() => handleAdd(section.key)}
                className="bg-primary hover:bg-primary/90 shadow-sm"
              >
                <Icons.Plus className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
