import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useReservation } from "../../hooks";
import { ReservationForm } from "./reservation-form.component";
import { LoadingSpinner, ErrorAlert } from "../../components";
import { ROUTES } from "../../utils/routes";

export const EditReservationView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useReservation(id ?? "");

  if (isLoading) return <LoadingSpinner />;
  if (error || !data) return <ErrorAlert message="Reservation not found." />;

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(ROUTES.reservations)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Edit Reservation
      </Typography>
      <ReservationForm existing={data} />
    </Box>
  );
};
