import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import CaseList from "./components/CaseList/CaseList";
import CreateCase from "./pages/CreateCase";
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
      </Routes>
    </BrowserRouter>
  );
}
export default App;
