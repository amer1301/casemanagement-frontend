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

        {/* ALLA SKYDDADE ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <CaseList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cases/:id"
          element={
            <ProtectedRoute>
              <CaseDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create"
          element={
            <ProtectedRoute>
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

        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;