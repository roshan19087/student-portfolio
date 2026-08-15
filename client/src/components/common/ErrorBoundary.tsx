import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button.js';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in UI:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
          <div className="rounded-full bg-red-100 dark:bg-red-950/60 p-4 text-red-600 dark:text-red-400 mb-4">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Something went wrong
          </h2>
          <p className="mt-2 max-w-md text-sm text-zinc-600 dark:text-zinc-400">
            An unexpected error occurred while rendering this section. Please reload the page to
            continue.
          </p>
          <Button variant="primary" size="md" className="mt-6" onClick={this.handleReload}>
            Reload Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
