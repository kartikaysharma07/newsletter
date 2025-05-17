import React, { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
          <div className="bg-neutral-800/50 backdrop-blur-md border border-neutral-700/30 rounded-xl p-8 shadow-lg">
            <p className="text-red-200 bg-red-500/20 p-4 rounded-lg text-center" role="alert">
              Something went wrong. Please refresh the page or try again later.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;