import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select } from '../../../../components/ui/select';
import { Checkbox } from '../../../../components/ui/checkbox';
import { Textarea } from '../../../../components/ui/textarea';
import type { ProcedureCode, ProcedureCategory } from '../../../../types/procedures';

interface AddProcedureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: Partial<ProcedureCode>) => void;
  categories: ProcedureCategory[];
}

export const AddProcedureModal = ({
  isOpen,
  onClose,
  onSubmit,
  categories
}: AddProcedureModalProps) => {
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    longDescription: '',
    category: '',
    type: 'diagnostic',
    status: 'active',
    requiresTooth: false,
    requiresSurface: false,
    requiresQuadrant: false,
    defaultFee: 0,
    ucr: 0,
    metadata: {
      ada: '',
      icd: [],
      cdt: '',
      modifiers: [],
      aliases: [],
      tags: []
    }
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
          <DialogTitle>Add Procedure Code</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
                required
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="longDescription">Long Description</Label>
              <Textarea
                id="longDescription"
                value={formData.longDescription}
                onChange={(e) =>
                  setFormData({ ...formData, longDescription: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                id="type"
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <option value="diagnostic">Diagnostic</option>
                <option value="preventive">Preventive</option>
                <option value="restorative">Restorative</option>
                <option value="endodontics">Endodontics</option>
                <option value="periodontics">Periodontics</option>
                <option value="prosthodontics">Prosthodontics</option>
                <option value="oral-surgery">Oral Surgery</option>
                <option value="orthodontics">Orthodontics</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="deprecated">Deprecated</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Default Fee</Label>
              <Input
                type="number"
                value={formData.defaultFee}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    defaultFee: Number(e.target.value)
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>UCR Fee</Label>
              <Input
                type="number"
                value={formData.ucr}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ucr: Number(e.target.value)
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requiresTooth"
                checked={formData.requiresTooth}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    requiresTooth: checked as boolean
                  })
                }
              />
              <Label htmlFor="requiresTooth">Requires Tooth</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="requiresSurface"
                checked={formData.requiresSurface}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    requiresSurface: checked as boolean
                  })
                }
              />
              <Label htmlFor="requiresSurface">Requires Surface</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="requiresQuadrant"
                checked={formData.requiresQuadrant}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    requiresQuadrant: checked as boolean
                  })
                }
              />
              <Label htmlFor="requiresQuadrant">Requires Quadrant</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Procedure</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
