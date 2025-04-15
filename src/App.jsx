import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import Home from "./pages/user/Home";
import Projects from "./pages/user/Projects";
import Services from "./pages/user/Services";
import About from "./pages/user/About";
import PrivateRoute from "./utils/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route: User Home (no auth check) */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Admin Protected Route */}
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* User Panel - Public Routes (no auth check) */}
        <Route
          path="/home"
          element={
            <UserLayout>
              <Home />
            </UserLayout>
          }
        />
        <Route
          path="/projects"
          element={
            <UserLayout>
              <Projects />
            </UserLayout>
          }
        />
        <Route
          path="/services"
          element={
            <UserLayout>
              <Services />
            </UserLayout>
          }
        />
        <Route
          path="/about"
          element={
            <UserLayout>
              <About />
            </UserLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
