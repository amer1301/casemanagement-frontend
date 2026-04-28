import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import CaseList from "./pages/CaseList/CaseList";
import CaseDetail from "./pages/CaseDetail/CaseDetail";
import CreateCase from "./pages/CreateCase/CreateCase";
import Dashboard from "./pages/Dashboard/Dashboard";
import Register from "./pages/Register/Register";
import MyCases from "./pages/MyCases/MyCases";
import Notifications from "./pages/Notifications/Notifications";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRequests from "./pages/AdminRequest/AdminRequests";

/**
 * App-komponenten definierar alla routes i applikationen.
 *
 * - Publika routes (login/register)
 * - Skyddade routes via ProtectedRoute
 * - Rollbaserad access (USER, ADMIN, MANAGER)
 */
function App() {
  return (
    <Router>
      <Routes>

        {/* Publika routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ADMIN + MANAGER */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <CaseList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/my-cases"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <MyCases />
            </ProtectedRoute>
          }
        />

        {/* USER */}
        <Route
          path="/user/my-cases"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <MyCases />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <CreateCase />
            </ProtectedRoute>
          }
        />

        {/* MANAGER */}
        <Route
          path="/admin-requests"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <AdminRequests />
            </ProtectedRoute>
          }
        />

        {/* Alla inloggade */}
        <Route
          path="/cases/:id"
          element={
            <ProtectedRoute>
              <CaseDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;