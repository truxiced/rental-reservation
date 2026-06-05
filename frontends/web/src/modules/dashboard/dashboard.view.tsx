import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Search, Add } from "@mui/icons-material";
import { useRentalUnits } from "../../hooks";
import { useQuery } from "@tanstack/react-query";
import { rentalUnitApi } from "../../api/rental-unit.api";
import { ROUTES } from "../../utils/routes";
import { LoadingSpinner, ErrorAlert } from "../../components";
import { UnitStatusCard } from "./unit-status-card.component";
import type { RentalUnitDetail } from "../../api/types";

export const DashboardView = () => {
  const [search, setSearch] = useState("");

  const { data: units, isLoading, error } = useRentalUnits(search || undefined);

  // Fetch detail (with occupancy) for each unit
  const detailQueries = useQuery({
    queryKey: ["rental-units", "dashboard", units?.map((u) => u.id)],
    queryFn: async () => {
      if (!units || units.length === 0) return [];
      const details = await Promise.all(
        units.map((u) => rentalUnitApi.getById(u.id)),
      );
      return details;
    },
    enabled: Array.isArray(units) && units.length > 0,
  });

  const detailUnits: RentalUnitDetail[] = detailQueries.data ?? [];

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: { sm: "center" },
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Overview of all rental units and their current occupancy.
          </Typography>
        </Box>
      </Stack>

      <TextField
        size="small"
        placeholder="Search units…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 3, width: { xs: "100%", sm: 320 } }}
      />

      {isLoading && <LoadingSpinner />}
      {error && <ErrorAlert message="Failed to load rental units." />}

      {!isLoading && units?.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            No rental units yet.
          </Typography>
          <Button
            component={Link}
            to={ROUTES.rentalUnits}
            variant="outlined"
            startIcon={<Add />}
          >
            Create your first unit
          </Button>
        </Box>
      )}

      {detailUnits.length > 0 && (
        <Grid container spacing={2}>
          {detailUnits.map((unit) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={unit.id}>
              <UnitStatusCard unit={unit} />
            </Grid>
          ))}
        </Grid>
      )}

      {isLoading === false &&
        units &&
        units.length > 0 &&
        detailUnits.length === 0 && <LoadingSpinner />}
    </Box>
  );
};
