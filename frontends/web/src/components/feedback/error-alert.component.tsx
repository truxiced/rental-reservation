import { Alert, AlertTitle } from "@mui/material";

interface ErrorAlertProps {
  message: string;
  title?: string;
}

export const ErrorAlert = ({ message, title = "Error" }: ErrorAlertProps) => {
  return (
    <Alert severity="error" sx={{ my: 2 }}>
      <AlertTitle>{title}</AlertTitle>
      {message}
    </Alert>
  );
};
