import React, { ErrorInfo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { EmailProvider } from './contexts/EmailContext';
import { LearningProvider } from './contexts/LearningContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { VoiceProvider } from './contexts/VoiceContext';
import { AppRoutes } from './routes';
import { TooltipProvider } from './components/ui/tooltip';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please try again later.</div>;
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <LearningProvider>
              <SettingsProvider>
                <EmailProvider>
                  <VoiceProvider>
                    <TooltipProvider>
                      <BrowserRouter
                        future={{
                          v7_startTransition: true,
                          v7_relativeSplatPath: true
                        } as any}
                      >
                        <AppRoutes />
                      </BrowserRouter>
                    </TooltipProvider>
                  </VoiceProvider>
                </EmailProvider>
              </SettingsProvider>
            </LearningProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;