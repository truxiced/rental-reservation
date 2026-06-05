import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout, ErrorBoundary } from "./components";
import { DashboardRoutes } from "./modules/dashboard";
import { RentalUnitRoutes } from "./modules/rental-unit";
import { ReservationRoutes } from "./modules/reservation";

export const App = () => {
  return (
    <AppLayout>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<DashboardRoutes />} />
          <Route path="/rental-units/*" element={<RentalUnitRoutes />} />
          <Route path="/reservations/*" element={<ReservationRoutes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </AppLayout>
  );
};
