import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { ColorManagement } from "./ColorManagement";

interface BrandingConfig {
  mission: string;
  vision: string;
  values: string[];
  tone: {
    primary: string;
    secondary: string[];
  };
  targetAudience: {
    demographics: {
      ageRange: string[];
      income: string[];
      location: string[];
      education: string[];
    };
    psychographics: {
      interests: string[];
      lifestyle: string[];
      values: string[];
    };
  };
  brandGuidelines: {
    logoUsage: string;
    typography: {
      primary: string;
      secondary: string;
      body: string;
    };
    imageStyle: string;
    voiceAndTone: string;
  };
}

export const BrandingSettings = () => {
  const [branding, setBranding] = useState<BrandingConfig>({
    mission:
      "To revolutionize dental care through innovative technology and compassionate service.",
    vision:
      "To be the leading provider of modern, patient-centered dental care solutions.",
    values: [
      "Innovation",
      "Compassion",
      "Excellence",
      "Integrity",
      "Patient-First",
    ],
    tone: {
      primary: "Professional yet approachable",
      secondary: ["Confident", "Empathetic", "Educational", "Trustworthy"],
    },
    targetAudience: {
      demographics: {
        ageRange: ["25-45", "46-65"],
        income: ["Middle income", "Upper-middle income"],
        location: ["Urban", "Suburban"],
        education: ["College educated", "Professional degree"],
      },
      psychographics: {
        interests: ["Health-conscious", "Technology-savvy", "Quality-focused"],
        lifestyle: ["Busy professionals", "Family-oriented", "Health-focused"],
        values: ["Preventive care", "Quality service", "Modern solutions"],
      },
    },
    brandGuidelines: {
      logoUsage:
        "Logo should always maintain clear space and never be altered in color or proportion",
      typography: {
        primary: "Montserrat",
        secondary: "Open Sans",
        body: "Inter",
      },
      imageStyle: "Clean, modern, and professional with a warm, welcoming feel",
      voiceAndTone:
        "Professional yet approachable, focusing on education and patient comfort",
    },
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateValues = (values: string[]) => {
    setBranding((prev) => ({
      ...prev,
      values,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Brand Identity */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-6">Brand Identity</h2>

        <div className="space-y-6">
          {/* Logo Management */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Practice Logo
            </label>
            <div className="flex items-center gap-4">
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Practice Logo"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <Icons.Image className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <Button
                  variant="outline"
                  onClick={() =>
                    document.getElementById("logo-upload")?.click()
                  }
                >
                  <Icons.Upload className="w-4 h-4 mr-2" />
                  Upload Logo
                </Button>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Recommended size: 512x512px. Max file size: 2MB
                </p>
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mission Statement
              </label>
              <textarea
                value={branding.mission}
                onChange={(e) =>
                  setBranding((prev) => ({ ...prev, mission: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vision Statement
              </label>
              <textarea
                value={branding.vision}
                onChange={(e) =>
                  setBranding((prev) => ({ ...prev, vision: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                rows={3}
              />
            </div>
          </div>

          {/* Core Values */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Core Values
            </label>
            <div className="flex flex-wrap gap-2">
              {branding.values.map((value, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full"
                >
                  <span>{value}</span>
                  <button
                    onClick={() =>
                      updateValues(
                        branding.values.filter((_, i) => i !== index),
                      )
                    }
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Icons.X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newValue = prompt("Enter new core value");
                  if (newValue) {
                    updateValues([...branding.values, newValue]);
                  }
                }}
              >
                <Icons.Plus className="w-4 h-4 mr-2" />
                Add Value
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Color Management */}
      <ColorManagement />

      {/* Target Audience */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-6">Target Audience</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Demographics */}
          <div>
            <h3 className="text-md font-medium mb-4">Demographics</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age Range
                </label>
                <div className="flex flex-wrap gap-2">
                  {branding.targetAudience.demographics.ageRange.map(
                    (range, index) => (
                      <div
                        key={index}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {range}
                      </div>
                    ),
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Income Level
                </label>
                <div className="flex flex-wrap gap-2">
                  {branding.targetAudience.demographics.income.map(
                    (income, index) => (
                      <div
                        key={index}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {income}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Psychographics */}
          <div>
            <h3 className="text-md font-medium mb-4">Psychographics</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interests
                </label>
                <div className="flex flex-wrap gap-2">
                  {branding.targetAudience.psychographics.interests.map(
                    (interest, index) => (
                      <div
                        key={index}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {interest}
                      </div>
                    ),
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lifestyle
                </label>
                <div className="flex flex-wrap gap-2">
                  {branding.targetAudience.psychographics.lifestyle.map(
                    (style, index) => (
                      <div
                        key={index}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {style}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voice & Tone */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-6">Voice & Tone</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Tone
            </label>
            <input
              type="text"
              value={branding.tone.primary}
              onChange={(e) =>
                setBranding((prev) => ({
                  ...prev,
                  tone: { ...prev.tone, primary: e.target.value },
                }))
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Secondary Tones
            </label>
            <div className="flex flex-wrap gap-2">
              {branding.tone.secondary.map((tone, index) => (
                <div
                  key={index}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {tone}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-6">Typography</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Font
            </label>
            <input
              type="text"
              value={branding.brandGuidelines.typography.primary}
              onChange={(e) =>
                setBranding((prev) => ({
                  ...prev,
                  brandGuidelines: {
                    ...prev.brandGuidelines,
                    typography: {
                      ...prev.brandGuidelines.typography,
                      primary: e.target.value,
                    },
                  },
                }))
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Secondary Font
            </label>
            <input
              type="text"
              value={branding.brandGuidelines.typography.secondary}
              onChange={(e) =>
                setBranding((prev) => ({
                  ...prev,
                  brandGuidelines: {
                    ...prev.brandGuidelines,
                    typography: {
                      ...prev.brandGuidelines.typography,
                      secondary: e.target.value,
                    },
                  },
                }))
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Body Font
            </label>
            <input
              type="text"
              value={branding.brandGuidelines.typography.body}
              onChange={(e) =>
                setBranding((prev) => ({
                  ...prev,
                  brandGuidelines: {
                    ...prev.brandGuidelines,
                    typography: {
                      ...prev.brandGuidelines.typography,
                      body: e.target.value,
                    },
                  },
                }))
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Save Changes */}
      <div className="flex justify-end">
        <Button className="bg-primary hover:bg-primary/90">
          <Icons.Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </motion.div>
  );
};
