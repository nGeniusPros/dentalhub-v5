```typescript
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { cn } from '../../../../../lib/utils';

interface Prize {
  id: string;
  name: string;
  description: string;
  type: 'physical' | 'digital' | 'experience';
  category: string;
  pointsCost: number;
  quantity: number;
  expirationDate?: string;
  restrictions?: string[];
  image?: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  claimLimit?: number;
  redemptionInstructions?: string;
  termsAndConditions?: string[];
}

interface AddPrizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (prize: Prize) => void;
}

export const AddPrizeModal: React.FC<AddPrizeModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [prize, setPrize] = useState<Partial<Prize>>({
    name: '',
    description: '',
    type: 'physical',
    category: '',
    pointsCost: 0,
    quantity: 1,
    status: 'active',
    restrictions: [],
    termsAndConditions: []
  });

  const [currentRestriction, setCurrentRestriction] = useState('');
  const [currentTerm, setCurrentTerm] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prize.name && prize.description && prize.pointsCost) {
      onAdd({
        ...prize,
        id: Date.now().toString(),
        restrictions: prize.restrictions || [],
        termsAndConditions: prize.termsAndConditions || []
      } as Prize);
      onClose();
    }
  };

  const handleAddRestriction = () => {
    if (currentRestriction.trim()) {
      setPrize(prev => ({
        ...prev,
        restrictions: [...(prev.restrictions || []), currentRestriction.trim()]
      }));
      setCurrentRestriction('');
    }
  };

  const handleAddTerm = () => {
    if (currentTerm.trim()) {
      setPrize(prev => ({
        ...prev,
        termsAndConditions: [...(prev.termsAndConditions || []), currentTerm.trim()]
      }));
      setCurrentTerm('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Add New Prize</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prize Name
              </label>
              <input
                type="text"
                value={prize.name}
                onChange={(e) => setPrize({ ...prize, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={prize.description}
                onChange={(e) => setPrize({ ...prize, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prize Type
              </label>
              <select
                value={prize.type}
                onChange={(e) => setPrize({ ...prize, type: e.target.value as Prize['type'] })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              >
                <option value="physical">Physical Prize</option>
                <option value="digital">Digital Prize</option>
                <option value="experience">Experience</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={prize.category}
                onChange={(e) => setPrize({ ...prize, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              >
                <option value="">Select category...</option>
                <option value="time-off">Time Off</option>
                <option value="gift-cards">Gift Cards</option>
                <option value="experiences">Experiences</option>
                <option value="merchandise">Merchandise</option>
                <option value="training">Training & Development</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Points Cost
              </label>
              <input
                type="number"
                value={prize.pointsCost}
                onChange={(e) => setPrize({ ...prize, pointsCost: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                min={0}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Quantity
              </label>
              <input
                type="number"
                value={prize.quantity}
                onChange={(e) => setPrize({ ...prize, quantity: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                min={1}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Claim Limit (per user)
              </label>
              <input
                type="number"
                value={prize.claimLimit}
                onChange={(e) => setPrize({ ...prize, claimLimit: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                min={1}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiration Date
              </label>
              <input
                type="date"
                value={prize.expirationDate}
                onChange={(e) => setPrize({ ...prize, expirationDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Restrictions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Restrictions
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentRestriction}
                  onChange={(e) => setCurrentRestriction(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="Enter restriction..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddRestriction();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddRestriction}>
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {prize.restrictions?.map((restriction, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm">{restriction}</span>
                    <button
                      type="button"
                      onClick={() => setPrize({
                        ...prize,
                        restrictions: prize.restrictions?.filter((_, i) => i !== index)
                      })}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Terms and Conditions
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentTerm}
                  onChange={(e) => setCurrentTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="Enter term..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTerm();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTerm}>
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {prize.termsAndConditions?.map((term, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm">{term}</span>
                    <button
                      type="button"
                      onClick={() => setPrize({
                        ...prize,
                        termsAndConditions: prize.termsAndConditions?.filter((_, i) => i !== index)
                      })}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Redemption Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Redemption Instructions
            </label>
            <textarea
              value={prize.redemptionInstructions}
              onChange={(e) => setPrize({ ...prize, redemptionInstructions: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              rows={3}
              placeholder="Enter instructions for redeeming this prize..."
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prize Image
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
              <div className="flex flex-col items-center">
                <Icons.Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  Drag and drop an image here, or click to browse
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setPrize({
                          ...prize,
                          image: reader.result as string
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <Button type="button" variant="outline" className="mt-2">
                  Browse Files
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!prize.name || !prize.description || !prize.pointsCost}
            >
              Create Prize
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
```