import React from "react";

type State = { hasError: boolean; error: Error | null };

export type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (import.meta.env.DEV) {
      console.warn("[ErrorBoundary]", error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="p-4 text-sm text-red-500">
            予期しないエラーが発生しました。拡張機能を再起動してください。
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
