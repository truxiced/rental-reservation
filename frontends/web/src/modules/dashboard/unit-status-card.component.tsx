import { Link } from "react-router-dom";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import ApartmentIcon from "@mui/icons-material/Apartment";
import type { RentalUnitDetail } from "../../api/types";
import { ROUTES } from "../../utils/routes";
import { formatDate } from "../../utils/date";

interface UnitStatusCardProps {
  unit: RentalUnitDetail;
}

export const UnitStatusCard = ({ unit }: UnitStatusCardProps) => {
  return (
    <Card
      variant="outlined"
      sx={{
        borderTop: 4,
        borderColor: unit.isOccupied ? "warning.main" : "success.main",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardActionArea
        component={Link}
        to={`${ROUTES.reservations}?rentalUnitId=${unit.id}`}
        sx={{ flexGrow: 1 }}
      >
        <CardContent>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "flex-start",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <ApartmentIcon color="action" fontSize="small" />
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, lineHeight: 1.2 }}
              >
                {unit.name}
              </Typography>
            </Stack>
            <Chip
              size="small"
              label={unit.isOccupied ? "Occupied" : "Vacant"}
              color={unit.isOccupied ? "warning" : "success"}
              variant="filled"
            />
          </Stack>

          {unit.address && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 1.5 }}
            >
              {unit.address}
            </Typography>
          )}

          <Divider sx={{ my: 1.5 }} />

          {unit.currentReservation ? (
            <Stack spacing={0.5}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Current guest
              </Typography>
              <Stack
                direction="row"
                spacing={0.5}
                sx={{ alignItems: "center" }}
              >
                <PersonIcon fontSize="small" color="warning" />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {unit.currentReservation.guestName}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                spacing={0.5}
                sx={{ alignItems: "center" }}
              >
                <EventIcon fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  Checks out {formatDate(unit.currentReservation.endDate)}
                </Typography>
              </Stack>
            </Stack>
          ) : (
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Currently vacant
              </Typography>
            </Box>
          )}

          {unit.nextReservation && (
            <>
              <Divider sx={{ my: 1.5 }} />
              <Stack spacing={0.5}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Next check-in
                </Typography>
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{ alignItems: "center" }}
                >
                  <PersonIcon fontSize="small" color="primary" />
                  <Typography variant="body2">
                    {unit.nextReservation.guestName}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{ alignItems: "center" }}
                >
                  <EventIcon fontSize="small" color="action" />
                  <Tooltip
                    title={`${formatDate(unit.nextReservation.startDate)} – ${formatDate(unit.nextReservation.endDate)}`}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(unit.nextReservation.startDate)}
                    </Typography>
                  </Tooltip>
                </Stack>
              </Stack>
            </>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
