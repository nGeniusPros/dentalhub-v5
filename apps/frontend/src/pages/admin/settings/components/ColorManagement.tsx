import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../components/ui/button';

interface ColorGroup {
  id: string;
  name: string;
  colors: Color[];
}

interface Color {
  id: string;
  name: string;
  value: string;
  description?: string;
}

export const ColorManagement = () => {
  const [colorGroups, setColorGroups] = useState<ColorGroup[]>([
    {
      id: 'main',
      name: 'Main Colors',
      colors: [
        { id: '1', name: 'Primary', value: '#1B2B5B', description: 'Primary brand color' },
        { id: '2', name: 'Secondary', value: '#40E0D0', description: 'Secondary brand color' },
        { id: '3', name: 'Accent', value: '#C5A572', description: 'Accent color' }
      ]
    },
    {
      id: 'accent',
      name: 'Accent Colors',
      colors: [
        { id: '4', name: 'Success', value: '#41B38A', description: 'Success states' },
        { id: '5', name: 'Warning', value: '#F59E0B', description: 'Warning states' },
        { id: '6', name: 'Error', value: '#EF4444', description: 'Error states' }
      ]
    },
    {
      id: 'neutral',
      name: 'Neutral Tones',
      colors: [
        { id: '7', name: 'Gray Dark', value: '#1F2937', description: 'Dark text' },
        { id: '8', name: 'Gray', value: '#6B7280', description: 'Body text' },
        { id: '9', name: 'Gray Light', value: '#E5E7EB', description: 'Borders' }
      ]
    },
    {
      id: 'gradients',
      name: 'Gradients',
      colors: [
        { id: '10', name: 'Ocean', value: 'linear-gradient(135deg, #1B2B5B 0%, #40E0D0 100%)', description: 'Ocean gradient' },
        { id: '11', name: 'Sunset', value: 'linear-gradient(135deg, #6B4C9A 0%, #C5A572 100%)', description: 'Sunset gradient' }
      ]
    }
  ]);

  const totalColors = colorGroups.reduce((sum, group) => sum + group.colors.length, 0);

  const addColor = (groupId: string) => {
    if (totalColors >= 30) {
      alert('Maximum color limit (30) reached');
      return;
    }

    setColorGroups(groups => groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          colors: [
            ...group.colors,
            {
              id: Date.now().toString(),
              name: 'New Color',
              value: '#000000'
            }
          ]
        };
      }
      return group;
    }));
  };

  const updateColor = (groupId: string, colorId: string, updates: Partial<Color>) => {
    setColorGroups(groups => groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          colors: group.colors.map(color => {
            if (color.id === colorId) {
              return { ...color, ...updates };
            }
            return color;
          })
        };
      }
      return group;
    }));
  };

  const deleteColor = (groupId: string, colorId: string) => {
    setColorGroups(groups => groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          colors: group.colors.filter(color => color.id !== colorId)
        };
      }
      return group;
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Color Management</h2>
          <p className="text-sm text-gray-500">Manage your brand's color palette ({totalColors}/30 colors used)</p>
        </div>
      </div>

      <div className="space-y-8">
        {colorGroups.map(group => (
          <div key={group.id}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">{group.name}</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addColor(group.id)}
                disabled={totalColors >= 30}
              >
                <Icons.Plus className="w-4 h-4 mr-2" />
                Add Color
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.colors.map(color => (
                <div
                  key={color.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg border border-gray-200"
                      style={{
                        background: color.value,
                        backgroundImage: color.value.includes('gradient') ? color.value : 'none'
                      }}
                    />
                    <input
                      type="text"
                      value={color.name}
                      onChange={(e) => updateColor(group.id, color.id, { name: e.target.value })}
                      className="flex-1 px-3 py-1 border border-gray-200 rounded-lg text-sm"
                      placeholder="Color name"
                    />
                  </div>

                  <div className="flex gap-2 mb-3">
                    <input
                      type={color.value.includes('gradient') ? 'text' : 'color'}
                      value={color.value}
                      onChange={(e) => updateColor(group.id, color.id, { value: e.target.value })}
                      className="flex-1 px-3 py-1 border border-gray-200 rounded-lg text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteColor(group.id, color.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Icons.Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <input
                    type="text"
                    value={color.description || ''}
                    onChange={(e) => updateColor(group.id, color.id, { description: e.target.value })}
                    className="w-full px-3 py-1 border border-gray-200 rounded-lg text-sm"
                    placeholder="Color description"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};