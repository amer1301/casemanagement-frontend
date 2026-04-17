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

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <CaseList />
            </ProtectedRoute>
          }
        />

<Route
  path="/my-cases"
  element={
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <MyCases />
    </ProtectedRoute>
  }
/>

<Route
  path="/user/my-cases"
  element={
    <ProtectedRoute allowedRoles={["USER"]}>
      <CaseList isMyCases />
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
            <ProtectedRoute allowedRoles={["USER"]}>
              <CreateCase />
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

        <Route
  path="/notifications"
  element={
    <ProtectedRoute>
      <Notifications />
    </ProtectedRoute>
  }
/>

        <Route path="/register" element={<Register />} />

<Route path="/admin-requests" element={<CaseList />} />
      </Routes>
    </Router>
  );
}

export default App;