import React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { cn } from '../../lib/utils';

export interface LinkProps extends RouterLinkProps {
  className?: string;
  variant?: 'default' | 'subtle' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <RouterLink
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'subtle',
            'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
            'h-10 px-4 py-2': size === 'default',
            'h-9 px-3': size === 'sm',
            'h-11 px-8': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
