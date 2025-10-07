'use client'

import React, { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Update state with error info
    this.setState({
      error,
      errorInfo
    })

    // TODO: Send to error tracking service (e.g., Sentry)
    // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-base">
          <div className="glass-card p-8 max-w-2xl w-full text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-danger/10 border-2 border-danger/30 flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-danger" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-text">
              Упс! Щось пішло не так
            </h1>

            {/* Description */}
            <p className="text-text-muted text-lg">
              Сталася неочікувана помилка. Ми вже працюємо над її виправленням.
            </p>

            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left bg-surface/50 rounded-xl p-4 mt-6">
                <summary className="cursor-pointer font-semibold text-sm text-text-muted mb-2">
                  Деталі помилки (тільки для розробників)
                </summary>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-danger font-mono">
                      {this.state.error.toString()}
                    </p>
                  </div>
                  {this.state.errorInfo && (
                    <div className="mt-2">
                      <p className="text-xs text-text-muted font-mono whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </p>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <button
                onClick={this.handleReset}
                className="btn-primary"
              >
                <RefreshCw className="w-5 h-5" />
                Спробувати ще раз
              </button>

              <button
                onClick={this.handleReload}
                className="btn-secondary"
              >
                <RefreshCw className="w-5 h-5" />
                Перезавантажити сторінку
              </button>

              <button
                onClick={this.handleGoHome}
                className="btn-ghost"
              >
                <Home className="w-5 h-5" />
                На головну
              </button>
            </div>

            {/* Help Text */}
            <p className="text-sm text-text-dim mt-6">
              Якщо проблема не зникає, будь ласка, зв'яжіться з підтримкою
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

// Simplified error fallback for inline use
export const ErrorFallback = ({ error, reset }: { error?: Error; reset?: () => void }) => (
  <div className="glass-card p-6 text-center space-y-4">
    <div className="flex justify-center">
      <AlertTriangle className="w-12 h-12 text-danger" />
    </div>
    <div>
      <h3 className="text-lg font-bold text-text mb-2">Помилка завантаження</h3>
      <p className="text-sm text-text-muted">
        {error?.message || 'Не вдалося завантажити дані'}
      </p>
    </div>
    {reset && (
      <button onClick={reset} className="btn-primary">
        <RefreshCw className="w-4 h-4" />
        Спробувати ще раз
      </button>
    )}
  </div>
)
