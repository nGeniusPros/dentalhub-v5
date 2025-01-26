import React from 'react';
import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const getVariantStyles = (variant: ButtonVariant) => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: #1d4ed8;
        color: white;
        border: none;
        &:hover {
          background-color: #1e40af;
        }
        &:active {
          background-color: #1e3a8a;
        }
      `;
    case 'secondary':
      return css`
        background-color: white;
        color: #1d4ed8;
        border: 1px solid #1d4ed8;
        &:hover {
          background-color: #f8fafc;
        }
        &:active {
          background-color: #f1f5f9;
        }
      `;
    case 'ghost':
      return css`
        background-color: transparent;
        color: #64748b;
        border: none;
        &:hover {
          background-color: #f1f5f9;
        }
        &:active {
          background-color: #e2e8f0;
        }
      `;
  }
};

const getSizeStyles = (size: ButtonSize) => {
  switch (size) {
    case 'small':
      return css`
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
      `;
    case 'medium':
      return css`
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
      `;
    case 'large':
      return css`
        padding: 1rem 2rem;
        font-size: 1.125rem;
      `;
  }
};

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.2s;
  cursor: pointer;
  width: ${props => props.fullWidth ? '100%' : 'auto'};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${props => getVariantStyles(props.variant || 'primary')}
  ${props => getSizeStyles(props.size || 'medium')}
`;

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <StyledButton {...props}>
      {children}
    </StyledButton>
  );
};
