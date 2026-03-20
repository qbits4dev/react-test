import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, info: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    this.setState({ info })

    // Production-safe: log error details for debugging (can be hooked to external error-tracking)
    console.error('ErrorBoundary caught error:', error)
    console.error('ErrorBoundary error info:', info)

    // Example: send to logging endpoint (uncomment and replace with actual endpoint)
    // fetch('/api/logs', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ error: error.toString(), info }) })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center justify-content-center p-4">
          <div style={{ maxWidth: 640 }}>
            <h1 className="display-1">Something went wrong</h1>
            <p>We are sorry, but an unexpected error occurred. Please refresh the page or contact support.</p>
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.info?.componentStack}
            </details>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
