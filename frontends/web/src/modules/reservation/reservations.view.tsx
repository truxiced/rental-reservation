import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker } from "@mui/x-date-pickers";
import {
  useReservations,
  useDeleteReservation,
  useRentalUnits,
  useMutationWithErrorState,
} from "../../hooks";
import { LoadingSpinner, ErrorAlert } from "../../components";
import { ROUTES } from "../../utils/routes";
import { formatDate, toDateString, today } from "../../utils/date";

export const ReservationsView = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [rentalUnitId, setRentalUnitId] = useState(
    searchParams.get("rentalUnitId") ?? "",
  );
  const [filterStart, setFilterStart] = useState<Date | null>(null);
  const [filterEnd, setFilterEnd] = useState<Date | null>(null);
  const [page, setPage] = useState(1);

  const { data: units } = useRentalUnits();
  const { data, isLoading, error } = useReservations({
    rentalUnitId: rentalUnitId || undefined,
    startDate: filterStart ? toDateString(filterStart) : undefined,
    endDate: filterEnd ? toDateString(filterEnd) : undefined,
    page,
    limit: 20,
  });

  const deleteMutation = useDeleteReservation();
  const { execute: executeDelete, error: deleteError, isExecuting: isDeletingReservation } =
    useMutationWithErrorState(deleteMutation);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this reservation?")) return;
    await executeDelete(id);
  };

  const handleRentalUnitChange = (id: string) => {
    setRentalUnitId(id);
    setPage(1);
    if (id) {
      setSearchParams({ rentalUnitId: id });
    } else {
      setSearchParams({});
    }
  };

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
            Reservations
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage guest bookings across all units.
          </Typography>
        </Box>
        <Button
          component={Link}
          to={ROUTES.newReservation}
          variant="contained"
          startIcon={<AddIcon />}
        >
          New Reservation
        </Button>
      </Stack>

      {/* Filters */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ alignItems: "center" }}
        >
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="unit-filter-label">Filter by unit</InputLabel>
            <Select
              labelId="unit-filter-label"
              value={rentalUnitId}
              label="Filter by unit"
              onChange={(e) => handleRentalUnitChange(e.target.value)}
            >
              <MenuItem value="">All units</MenuItem>
              {(units ?? []).map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <DatePicker
            label="From"
            value={filterStart}
            onChange={(d) => {
              setFilterStart(d);
              setPage(1);
            }}
            slotProps={{ textField: { size: "small" } }}
          />
          <DatePicker
            label="To"
            value={filterEnd}
            onChange={(d) => {
              setFilterEnd(d);
              setPage(1);
            }}
            minDate={filterStart ?? undefined}
            slotProps={{ textField: { size: "small" } }}
          />

          {(rentalUnitId || filterStart || filterEnd) && (
            <Button
              size="small"
              onClick={() => {
                setRentalUnitId("");
                setFilterStart(null);
                setFilterEnd(null);
                setSearchParams({});
                setPage(1);
              }}
            >
              Clear
            </Button>
          )}
        </Stack>
      </Paper>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorAlert message="Failed to load reservations." />}
      {deleteError && <ErrorAlert message={deleteError} title="Delete failed" />}

      {!isLoading && data?.items.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No reservations found.
          </Typography>
          <Button
            component={Link}
            to={ROUTES.newReservation}
            variant="outlined"
            startIcon={<AddIcon />}
          >
            Create first reservation
          </Button>
        </Box>
      )}

      {data && data.items.length > 0 && (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Rental Unit</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Guest</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Check-in</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Check-out</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.items.map((res) => {
                  const todayStr = today();
                  const isActive =
                    res.startDate <= todayStr && res.endDate > todayStr;
                  const isPast = res.endDate <= todayStr;

                  return (
                    <TableRow key={res.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {res.rentalUnitName}
                        </Typography>
                      </TableCell>
                      <TableCell>{res.guestName}</TableCell>
                      <TableCell>{formatDate(res.startDate)}</TableCell>
                      <TableCell>{formatDate(res.endDate)}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={
                            isActive ? "Active" : isPast ? "Past" : "Upcoming"
                          }
                          color={
                            isActive
                              ? "warning"
                              : isPast
                                ? "default"
                                : "primary"
                          }
                          variant={isPast ? "outlined" : "filled"}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton
                            component={Link}
                            to={ROUTES.editReservation(res.id)}
                            size="small"
                            color="primary"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            disabled={isDeletingReservation(res.id)}
                            onClick={() => handleDelete(res.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {data.meta.totalPages > 1 && (
            <Stack sx={{ alignItems: "center", mt: 3 }}>
              <Pagination
                count={data.meta.totalPages}
                page={page}
                onChange={(_, p) => setPage(p)}
                color="primary"
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                {data.meta.total} reservations total
              </Typography>
            </Stack>
          )}
        </>
      )}
    </Box>
  );
};
