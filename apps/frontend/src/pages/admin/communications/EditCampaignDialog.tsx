import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Campaign } from "../../../hooks/use-campaigns";

interface EditCampaignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  campaign?: Campaign;
  onSave: (campaign: Partial<Campaign>) => void;
}

export const EditCampaignDialog: React.FC<EditCampaignDialogProps> = ({
  isOpen,
  onClose,
  campaign,
  onSave,
}) => {
  const [formData, setFormData] = React.useState<Partial<Campaign>>({
    name: campaign?.name || "",
    script: campaign?.script || "",
    targetAudience: campaign?.targetAudience || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {campaign ? "Edit Campaign" : "Create Campaign"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Campaign Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="script">Voice Script</Label>
            <Textarea
              id="script"
              name="script"
              value={formData.script}
              onChange={handleChange}
              required
              rows={4}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input
              id="targetAudience"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{campaign ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
