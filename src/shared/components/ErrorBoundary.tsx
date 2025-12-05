import { Component, ReactNode, ErrorInfo } from 'react';
import { ErrorDisplay } from './ErrorDisplay';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <ErrorDisplay
            message={
              this.state.error?.message || 'Something went wrong. Please try refreshing the page.'
            }
            onRetry={() => {
              this.setState({ hasError: false, error: undefined });
              window.location.reload();
            }}
            retryLabel="Reload Page"
          />
        )
      );
    }

    return this.props.children;
  }
}
