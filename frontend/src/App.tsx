import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./components/Login";
import NotesList from "./components/NotesList";
import {ProtectedRoute} from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";


function App() {
  return (
    <AuthProvider>
      <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}>
        <Routes>
          <Route path="/" element={
            <Navigate to="/login" replace />
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/notes" element={
            <ProtectedRoute>
              <NotesList />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
