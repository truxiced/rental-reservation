import { Routes, Route } from "react-router-dom";
import { RentalUnitsView } from "./rental-units.view";

export const RentalUnitRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RentalUnitsView />} />
    </Routes>
  );
};
