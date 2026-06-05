import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Alert, AlertTitle, Box, Button } from "@mui/material";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : "An unexpected error occurred.",
    };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("Uncaught render error:", error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, maxWidth: 560, mx: "auto", mt: 8 }}>
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={this.handleReload}>
                Reload
              </Button>
            }
          >
            <AlertTitle>Something went wrong</AlertTitle>
            {this.state.message}
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}
