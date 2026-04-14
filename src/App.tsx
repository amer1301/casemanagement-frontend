import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import CaseList from "./pages/CaseList/CaseList";
import CaseDetail from "./pages/CaseDetail/CaseDetail";
import CreateCase from "./pages/CreateCase/CreateCase";
import Dashboard from "./pages/Dashboard/Dashboard";
import Register from "./pages/Register/Register";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* CASE LIST (admin/manager) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <CaseList />
            </ProtectedRoute>
          }
        />

        {/* USER – MINA ÄRENDEN */}
        <Route
          path="/my-cases"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <CaseList isMyCases />
            </ProtectedRoute>
          }
        />

        {/* CASE DETAIL */}
        <Route
          path="/cases/:id"
          element={
            <ProtectedRoute>
              <CaseDetail />
            </ProtectedRoute>
          }
        />

        {/* CREATE */}
        <Route
          path="/create"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <CreateCase />
            </ProtectedRoute>
          }
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* REGISTER */}
        <Route path="/register" element={<Register />} />

      </Routes>
    </Router>
  );
}

export default App;