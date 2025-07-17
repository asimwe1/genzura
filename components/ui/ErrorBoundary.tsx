import React from "react"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service if needed
    // console.error(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[200px] text-center p-6">
          <div className="text-4xl mb-2">😕</div>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-gray-500 mb-4">An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.</p>
        </div>
      )
    }
    return this.props.children
  }
} 