import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./components/Login";
import NotesList from "./components/NotesList";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          localStorage.getItem("token")
          ? <Navigate to="/notes" />
          : <Navigate to="/login" />
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/notes" element={
          <ProtectedRoute>
            <NotesList />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
