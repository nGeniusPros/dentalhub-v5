import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AgentError } from '../../lib/ai-agents/types/errors';
import { Button } from '../ui/button';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { ExclamationTriangleIcon, ReloadIcon } from '@radix-ui/react-icons';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class AIErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AI Error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    this.props.onReset?.();
  };

  private getErrorMessage(error: Error): string {
    if (error instanceof AgentError) {
      return `AI Assistant Error: ${error.message}`;
    }
    return 'An unexpected error occurred with the AI Assistant';
  }

  private isRetryable(error: Error): boolean {
    return error instanceof AgentError ? error.retryable : true;
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const error = this.state.error!;
      const message = this.getErrorMessage(error);
      const canRetry = this.isRetryable(error);

      return (
        <Alert variant="destructive" className="my-4">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            <p className="mt-2 text-sm">{message}</p>
            {canRetry && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={this.handleReset}
              >
                <ReloadIcon className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}
