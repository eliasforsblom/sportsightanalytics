import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled UI error:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-6">
          <div className="surface-card max-w-md p-8 text-center">
            <p className="eyebrow mb-3">Something broke</p>
            <h1 className="mb-3 text-2xl font-bold">This page hit an error</h1>
            <p className="mb-6 text-sm text-muted-foreground">
              {this.state.error.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => window.location.assign("/")}
              className="rounded-full bg-gradient-primary px-6 py-2.5 font-display text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              Back to home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
