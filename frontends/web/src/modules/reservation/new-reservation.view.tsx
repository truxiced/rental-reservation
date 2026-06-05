import { useSearchParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { ReservationForm } from "./reservation-form.component";

export const NewReservationView = () => {
  const [searchParams] = useSearchParams();
  const defaultUnitId = searchParams.get("rentalUnitId") ?? undefined;

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 3 }}>
        New Reservation
      </Typography>
      <ReservationForm defaultRentalUnitId={defaultUnitId} />
    </Box>
  );
};
