import React from 'react';
import { Toggle } from '../../../../components/ui/toggle';
import { useSettings } from '../../../../contexts/SettingsContext';
import type { Settings } from '../../../../types/settings';

interface SettingsToggleProps {
  section: keyof Settings;
  setting: string;
  title: string;
  description: string;
}

export const SettingsToggle: React.FC<SettingsToggleProps> = ({
  section,
  setting,
  title,
  description
}) => {
  const { state, updateSettings } = useSettings();
  const { settings } = state;

  const handleToggle = async (checked: boolean) => {
    await updateSettings({
      [section]: {
        ...settings[section],
        [setting]: checked
      }
    });
  };

  const isEnabled = settings[section]?.[setting] as boolean;

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <Toggle
        checked={isEnabled}
        onChange={handleToggle}
        defaultChecked={isEnabled}
      />
    </div>
  );
};