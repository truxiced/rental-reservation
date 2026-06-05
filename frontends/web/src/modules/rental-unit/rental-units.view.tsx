import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Search, EventNote, Add } from "@mui/icons-material";
import { useRentalUnits } from "../../hooks/use-rental-units";
import { LoadingSpinner, ErrorAlert } from "../../components";
import { CreateRentalUnitDialog } from "./create-rental-unit-dialog.component";
import { ROUTES } from "../../utils/routes";

export const RentalUnitsView = () => {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: units, isLoading, error } = useRentalUnits(search || undefined);

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
            Rental Units
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage properties and apartments.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
        >
          Add Unit
        </Button>
      </Stack>

      <TextField
        size="small"
        placeholder="Search by name…"
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

      {!isLoading && !error && units?.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {search ? "No units match your search." : "No rental units yet."}
          </Typography>
          {!search && (
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => setDialogOpen(true)}
            >
              Create your first unit
            </Button>
          )}
        </Box>
      )}

      {units && units.length > 0 && (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Address</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {units.map((unit) => (
                <TableRow key={unit.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {unit.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {unit.address ? (
                      <Typography variant="body2" color="text.secondary">
                        {unit.address}
                      </Typography>
                    ) : (
                      <Chip
                        label="No address"
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View reservations">
                      <IconButton
                        component={Link}
                        to={`${ROUTES.reservations}?rentalUnitId=${unit.id}`}
                        size="small"
                        color="primary"
                      >
                        <EventNote fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <CreateRentalUnitDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </Box>
  );
};
