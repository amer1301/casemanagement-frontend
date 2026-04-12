import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import CaseList from "./pages/CaseList/CaseList";
import CreateCase from "./pages/CreateCase/CreateCase";
import CaseDetail from "./pages/CaseDetail/CaseDetail";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        {/* Öppen route */}
        <Route path="/login" element={<Login />} />

        {/* Skyddad route */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <CaseList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create"
          element={token ? <CreateCase /> : <Login />}
        />
        <Route path="/" element={<Dashboard />} />
        <Route
  path="/cases/:id"
  element={
    <ProtectedRoute>
      <CaseDetail />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
