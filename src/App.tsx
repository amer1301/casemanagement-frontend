import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import CaseList from "./components/CaseList/CaseList";
import CreateCase from "./pages/CreateCase";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Skyddad route */}
        <Route
          path="/"
          element={token ? <CaseList /> : <Login />}
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
