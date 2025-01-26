import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../ui/button";
import { useSettings } from "../../contexts/SettingsContext";
import { cn } from "../../lib/utils";

interface TemplateBuilderProps {
  onSave: (template: EmailTemplate) => void;
  onCancel: () => void;
}

export const TemplateBuilder: React.FC<TemplateBuilderProps> = ({
  onSave,
  onCancel,
}) => {
  const { state } = useSettings();
  const { settings } = state;

  const [template, setTemplate] = useState<Partial<EmailTemplate>>({
    name: "",
    type: "custom",
    category: "",
    tags: [],
    content: "",
  });

  const [tag, setTag] = useState("");

  const handleAddTag = () => {
    if (tag && !template.tags?.includes(tag)) {
      setTemplate((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tag],
      }));
      setTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTemplate((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tagToRemove),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Add practice info to template content
    const practiceInfo = `
      <div style="margin-bottom: 20px;">
        ${settings.branding.logo ? `<img src="${settings.branding.logo}" alt="${settings.general.practiceName}" style="max-width: 200px; margin-bottom: 10px;" />` : ""}
        <h2 style="color: ${settings.branding.colors.primary};">${settings.general.practiceName}</h2>
        <p>${settings.general.address}</p>
        <p>Phone: ${settings.general.phone}</p>
        <p>Email: ${settings.general.email}</p>
      </div>
    `;

    onSave({
      ...template,
      id: Date.now().toString(),
      content: practiceInfo + template.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as EmailTemplate);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Template Name
          </label>
          <input
            type="text"
            value={template.name}
            onChange={(e) =>
              setTemplate((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={template.category}
            onChange={(e) =>
              setTemplate((prev) => ({ ...prev, category: e.target.value }))
            }
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            required
          >
            <option value="">Select category...</option>
            <option value="Recall">Recall</option>
            <option value="Special Events">Special Events</option>
            <option value="Newsletters">Newsletters</option>
            <option value="Events">Events</option>
            <option value="Reactivation">Reactivation</option>
            <option value="Referrals">Referrals</option>
            <option value="Custom">Custom</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={template.type}
            onChange={(e) =>
              setTemplate((prev) => ({
                ...prev,
                type: e.target.value as EmailTemplate["type"],
              }))
            }
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            required
          >
            <option value="event">Event</option>
            <option value="invite">Invite</option>
            <option value="announcement">Announcement</option>
            <option value="newsletter">Newsletter</option>
            <option value="birthday">Birthday</option>
            <option value="recall">Recall</option>
            <option value="reactivation">Reactivation</option>
            <option value="reminder">Reminder</option>
            <option value="anniversary">Anniversary</option>
            <option value="referral">Referral</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            {template.tags?.map((t) => (
              <span
                key={t}
                className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-1"
              >
                {t}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(t)}
                  className="hover:text-red-500"
                >
                  <Icons.X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
              placeholder="Add tag..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button type="button" onClick={handleAddTag}>
              Add Tag
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            value={template.content}
            onChange={(e) =>
              setTemplate((prev) => ({ ...prev, content: e.target.value }))
            }
            className="w-full h-64 px-4 py-2 border border-gray-200 rounded-lg font-mono"
            required
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Template</Button>
        </div>
      </form>
    </div>
  );
};
