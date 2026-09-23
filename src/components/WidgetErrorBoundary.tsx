import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { widgetName: string; children: ReactNode };
type State = { hasError: boolean };

export class WidgetErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`Widget failed: ${this.props.widgetName}`, error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div className="widget-error"><p>{this.props.widgetName} could not be rendered.</p><button onClick={() => this.setState({ hasError: false })}>Retry</button></div>;
    }
    return this.props.children;
  }
}
