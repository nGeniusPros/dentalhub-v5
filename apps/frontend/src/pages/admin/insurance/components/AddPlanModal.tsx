import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select } from '../../../../components/ui/select';
import type { InsurancePlan, InsuranceProvider } from '../../../../types/insurance';

interface AddPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (plan: Partial<InsurancePlan>) => void;
  providers: InsuranceProvider[];
}

export const AddPlanModal = ({
  isOpen,
  onClose,
  onSubmit,
  providers
}: AddPlanModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    providerId: '',
    planType: 'PPO',
    groupNumber: '',
    planNumber: '',
    deductible: {
      individual: 0,
      family: 0,
      preventive: false
    },
    maximumBenefit: {
      annual: 0,
      lifetime: 0,
      preventive: false
    },
    preAuthorizationRequired: false,
    preAuthorizationThreshold: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Insurance Plan</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Plan Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Select
                id="provider"
                value={formData.providerId}
                onValueChange={(value) =>
                  setFormData({ ...formData, providerId: value })
                }
                required
              >
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="planType">Plan Type</Label>
              <Select
                id="planType"
                value={formData.planType}
                onValueChange={(value) =>
                  setFormData({ ...formData, planType: value })
                }
              >
                <option value="PPO">PPO</option>
                <option value="HMO">HMO</option>
                <option value="EPO">EPO</option>
                <option value="Indemnity">Indemnity</option>
                <option value="Medicare">Medicare</option>
                <option value="Medicaid">Medicaid</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="groupNumber">Group Number</Label>
              <Input
                id="groupNumber"
                value={formData.groupNumber}
                onChange={(e) =>
                  setFormData({ ...formData, groupNumber: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Individual Deductible</Label>
              <Input
                type="number"
                value={formData.deductible.individual}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deductible: {
                      ...formData.deductible,
                      individual: Number(e.target.value)
                    }
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Family Deductible</Label>
              <Input
                type="number"
                value={formData.deductible.family}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deductible: {
                      ...formData.deductible,
                      family: Number(e.target.value)
                    }
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Annual Maximum</Label>
              <Input
                type="number"
                value={formData.maximumBenefit.annual}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maximumBenefit: {
                      ...formData.maximumBenefit,
                      annual: Number(e.target.value)
                    }
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Lifetime Maximum</Label>
              <Input
                type="number"
                value={formData.maximumBenefit.lifetime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maximumBenefit: {
                      ...formData.maximumBenefit,
                      lifetime: Number(e.target.value)
                    }
                  })
                }
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Plan</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
