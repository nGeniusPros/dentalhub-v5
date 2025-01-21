import React from 'react';
import { createAvatar } from '@dicebear/core';
import * as avatarStyles from '@dicebear/collection';

interface AvatarProps {
  seed: string;
  style?: keyof typeof avatarStyles;
  size?: number;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  seed, 
  style = 'initials',
  size = 40,
  className 
}) => {
  const avatar = createAvatar(avatarStyles[style], {
    seed,
    size,
  });

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: avatar.toDataUriSync() }} 
    />
  );
};