import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import Profile from "./pages/admin/Profile";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import Projects from "./pages/user/Projects";
import Services from "./pages/user/Services";
import About from "./pages/user/About";
import PrivateRoute from "./utils/PrivateRoute";
import UserLogin from "./pages/user/UserLogin";
import AdminProjects from "./pages/admin/AdminProjects";
import MasterPage from "./pages/user/MasterPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* User routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<MasterPage />} />
          <Route path="projects" element={<Projects />} />
          <Route path="services" element={<Services />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<UserLogin />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="adminproject" element={<AdminProjects />} />
        </Route>
      </Routes>
    </Router>

  );
}

export default App;
