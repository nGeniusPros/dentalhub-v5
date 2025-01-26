import { toast as sonnerToast, Toaster as SonnerToaster } from 'sonner';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const defaultOptions: ToastOptions = {
  duration: 5000,
  position: 'top-right',
};

export const Toaster = () => {
  return (
    <SonnerToaster
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
    />
  );
};

export const toast = {
  success: (message: string, options?: ToastOptions) => {
    sonnerToast.success(message, {
      ...defaultOptions,
      ...options,
      icon: <CheckCircle className="h-5 w-5 text-success" />,
    });
  },

  error: (message: string, options?: ToastOptions) => {
    sonnerToast.error(message, {
      ...defaultOptions,
      ...options,
      icon: <XCircle className="h-5 w-5 text-destructive" />,
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    sonnerToast.warning(message, {
      ...defaultOptions,
      ...options,
      icon: <AlertCircle className="h-5 w-5 text-warning" />,
    });
  },

  info: (message: string, options?: ToastOptions) => {
    sonnerToast.info(message, {
      ...defaultOptions,
      ...options,
      icon: <Info className="h-5 w-5 text-info" />,
    });
  },

  promise: async <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    },
    options?: ToastOptions
  ) => {
    return sonnerToast.promise(promise, {
      ...defaultOptions,
      ...options,
      loading,
      success,
      error,
    });
  },

  dismiss: (toastId?: string) => {
    sonnerToast.dismiss(toastId);
  },

  custom: (
    message: string | React.ReactNode,
    options?: ToastOptions & { icon?: React.ReactNode }
  ) => {
    sonnerToast(message, {
      ...defaultOptions,
      ...options,
    });
  },
};
