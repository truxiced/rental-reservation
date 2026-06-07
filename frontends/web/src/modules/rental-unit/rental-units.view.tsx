import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import DeleteIcon from "@mui/icons-material/Delete";
import { useRentalUnits, useDeleteRentalUnit } from "../../hooks/use-rental-units";
import { LoadingSpinner, ErrorAlert } from "../../components";
import { CreateRentalUnitDialog } from "./create-rental-unit-dialog.component";
import { ROUTES } from "../../utils/routes";

export const RentalUnitsView = () => {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data: units, isLoading, error } = useRentalUnits(search || undefined);
  const deleteRentalUnit = useDeleteRentalUnit();

  const handleDelete = (id: string, name: string) => {
    setConfirmDelete({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    const { id } = confirmDelete;
    setConfirmDelete(null);
    setDeleteError(null);
    setDeletingId(id);
    try {
      await deleteRentalUnit.mutateAsync(id);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete rental unit.";
      setDeleteError(message);
    } finally {
      setDeletingId(null);
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
      {deleteError && <ErrorAlert message={deleteError} />}

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
                    <Tooltip title="Delete unit">
                      <span>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(unit.id, unit.name)}
                          disabled={deletingId === unit.id}
                        >
                          {deletingId === unit.id ? (
                            <CircularProgress size={16} color="error" />
                          ) : (
                            <DeleteIcon fontSize="small" />
                          )}
                        </IconButton>
                      </span>
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

      <Dialog
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete rental unit?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete &ldquo;{confirmDelete?.name}&rdquo;? Past reservations will be removed. This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDelete(null)}
            disabled={deletingId !== null}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
            disabled={deletingId !== null}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
