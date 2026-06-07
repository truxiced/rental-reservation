import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { App } from "./app";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // cached data stays fresh for 30 s before a background refetch is triggered
      retry: 1,          // retry failed requests once before surfacing an error to the UI
    },
  },
});

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#f57c00" },
  },
  shape: { borderRadius: 8 },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </LocalizationProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
