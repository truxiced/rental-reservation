import { Routes, Route } from "react-router-dom";
import { ReservationsView } from "./reservations.view";
import { NewReservationView } from "./new-reservation.view";
import { EditReservationView } from "./edit-reservation.view";

export const ReservationRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ReservationsView />} />
      <Route path="/new" element={<NewReservationView />} />
      <Route path="/:id/edit" element={<EditReservationView />} />
    </Routes>
  );
};
