import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { parseISO } from "date-fns";
import {
  useRentalUnits,
  useCreateReservation,
  useUpdateReservation,
} from "../../hooks";
import { ApiRequestError } from "../../api/client";
import type { Reservation } from "../../api/types";
import { ROUTES } from "../../utils/routes";
import { toDateString } from "../../utils/date";
import { ErrorAlert } from "../../components";

interface ReservationFormProps {
  /**
   * When provided the form is in edit mode; the fields are pre-populated
   * and a PATCH request is made instead of POST.
   */
  existing?: Reservation;
  defaultRentalUnitId?: string;
}

export const ReservationForm = ({
  existing,
  defaultRentalUnitId,
}: ReservationFormProps) => {
  const navigate = useNavigate();
  const isEdit = Boolean(existing);

  const [rentalUnitId, setRentalUnitId] = useState(
    existing?.rentalUnitId ?? defaultRentalUnitId ?? "",
  );
  const [guestName, setGuestName] = useState(existing?.guestName ?? "");
  const [startDate, setStartDate] = useState<Date | null>(
    existing ? parseISO(existing.startDate) : null,
  );
  const [endDate, setEndDate] = useState<Date | null>(
    existing ? parseISO(existing.endDate) : null,
  );

  const [validationError, setValidationError] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [conflictError, setConflictError] = useState<{
    message: string;
    details?: Record<string, unknown>;
  } | null>(null);

  const { data: units } = useRentalUnits();
  const createMutation = useCreateReservation();
  const updateMutation = useUpdateReservation(existing?.id ?? "");
  const mutation = isEdit ? updateMutation : createMutation;

  const validate = (): string => {
    if (!isEdit && !rentalUnitId) return "Please select a rental unit.";
    if (!guestName.trim()) return "Guest name is required.";
    if (!startDate) return "Check-in date is required.";
    if (!endDate) return "Check-out date is required.";
    if (endDate <= startDate) return "Check-out must be after check-in.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setValidationError(err);
      return;
    }
    setValidationError("");
    setConflictError(null);
    setSubmitError(null);

    try {
      if (isEdit && existing) {
        await updateMutation.mutateAsync({
          guestName: guestName.trim(),
          startDate: toDateString(startDate!),
          endDate: toDateString(endDate!),
        });
      } else {
        await createMutation.mutateAsync({
          rentalUnitId,
          guestName: guestName.trim(),
          startDate: toDateString(startDate!),
          endDate: toDateString(endDate!),
        });
      }
      navigate(ROUTES.reservations);
    } catch (error) {
      if (error instanceof ApiRequestError && error.statusCode === 409) {
        setConflictError({
          message: error.apiError.message,
          details: error.apiError.details,
        });
      } else {
        setSubmitError(
          error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
        );
      }
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 3, maxWidth: 560 }}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {isEdit ? "Edit Reservation" : "New Reservation"}
          </Typography>

          {!isEdit && (
            <FormControl fullWidth required>
              <InputLabel id="unit-label">Rental Unit</InputLabel>
              <Select
                labelId="unit-label"
                value={rentalUnitId}
                label="Rental Unit"
                onChange={(e) => {
                  setRentalUnitId(e.target.value);
                  setConflictError(null);
                }}
              >
                {(units ?? []).map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {isEdit && (
            <TextField
              label="Rental Unit"
              value={existing?.rentalUnitName ?? ""}
              disabled
              fullWidth
            />
          )}

          <TextField
            label="Guest Name"
            value={guestName}
            onChange={(e) => {
              setGuestName(e.target.value);
              setConflictError(null);
            }}
            required
            fullWidth
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <DatePicker
              label="Check-in"
              value={startDate}
              onChange={(v) => {
                setStartDate(v);
                setConflictError(null);
              }}
              maxDate={endDate ?? undefined}
              slotProps={{ textField: { fullWidth: true, required: true } }}
            />
            <DatePicker
              label="Check-out"
              value={endDate}
              onChange={(v) => {
                setEndDate(v);
                setConflictError(null);
              }}
              minDate={startDate ?? undefined}
              slotProps={{ textField: { fullWidth: true, required: true } }}
            />
          </Stack>

          {validationError && (
            <Alert severity="warning">{validationError}</Alert>
          )}

          {submitError && <ErrorAlert message={submitError} />}

          {/* Booking conflict — highlighted prominently */}
          {conflictError && (
            <Alert severity="error">
              <AlertTitle>Booking Conflict</AlertTitle>
              {conflictError.message}
              {conflictError.details && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" component="div">
                    Conflicting reservation ID:{" "}
                    <strong>
                      {String(
                        conflictError.details["conflictingReservationId"],
                      )}
                    </strong>
                  </Typography>
                  <Typography variant="caption" component="div">
                    Dates:{" "}
                    <strong>
                      {String(conflictError.details["conflictingStartDate"])} –{" "}
                      {String(conflictError.details["conflictingEndDate"])}
                    </strong>
                  </Typography>
                </Box>
              )}
            </Alert>
          )}

          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: "flex-end" }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate(ROUTES.reservations)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Saving…" : isEdit ? "Update" : "Create"}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Paper>
  );
};
