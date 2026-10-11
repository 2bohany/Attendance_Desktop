import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorState } from '@/components/ui/error-state';
import { useAppStore } from '@/stores/app-store';
import { t } from '@/lib/i18n';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error.message, info.componentStack);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return <ErrorBoundaryFallback onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

function ErrorBoundaryFallback({ onRetry }: { onRetry: () => void }) {
  const locale = useAppStore((state) => state.locale);

  return (
    <div className="flex h-screen items-center justify-center p-6">
      <ErrorState
        title={t(locale, 'error.title')}
        description={t(locale, 'error.description')}
        onRetry={onRetry}
        retryLabel={t(locale, 'error.retry')}
      />
    </div>
  );
}
