import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useCreateRentalUnit } from "../../hooks";
import type { ApiRequestError } from "../../api/client";

interface CreateRentalUnitDialogProps {
  open: boolean;
  onClose: () => void;
}

export const CreateRentalUnitDialog = ({
  open,
  onClose,
}: CreateRentalUnitDialogProps) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [nameError, setNameError] = useState("");

  const createMutation = useCreateRentalUnit();

  const handleClose = () => {
    setName("");
    setAddress("");
    setNameError("");
    createMutation.reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError("Name is required");
      return;
    }
    setNameError("");

    await createMutation.mutateAsync(
      { name: name.trim(), address: address.trim() || undefined },
      { onSuccess: handleClose },
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add Rental Unit</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={Boolean(nameError)}
              helperText={nameError}
              autoFocus
              required
              fullWidth
            />
            <TextField
              label="Address (optional)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              fullWidth
            />
            {createMutation.error && (
              <TextField
                error
                multiline
                disabled
                value={
                  (createMutation.error as ApiRequestError).message ??
                  "An error occurred"
                }
                fullWidth
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={createMutation.isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Saving…" : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
