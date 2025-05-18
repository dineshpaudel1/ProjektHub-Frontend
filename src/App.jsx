import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import Projects from "./pages/user/Projects";
import Services from "./pages/user/Services";
import About from "./pages/user/About";
import UserLogin from "./pages/user/UserLogin";
import AdminProjects from "./pages/admin/AdminProjects";
import MasterPage from "./pages/user/MasterPage";

import SellerProjects from "./pages/seller/SellerProjects";
import AllProjectDetail from "./pages/admin/AllProjectDetail";
import UserProjectDetail from "./pages/user/UserProjectDetail";
import ForgotPassword from "./pages/user/ForgetPassword";
import EditProject from "./pages/seller/SellerProjetsDetail";

// ✅ New Seller imports
import SellerLogin from "./pages/seller/SellerLogin";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProfile from "./pages/seller/SellerProfile";
import SellerLayout from "./layouts/SellerLayout";
import AdminPrivateRoute from "./utils/AdminPrivateRoute";
import SellerPrivateRoute from "./utils/SellerPrivateRoute";
import EditMyProject from "./pages/seller/EditMyProject";
import AdminProfile from "./pages/admin/AdminProfile";
import UserProfile from "./pages/user/UserProfile";
import ApproveSeller from "./pages/admin/ApproveSeller";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ User Routes */}
        <Route
          path="/"
          element={
            <UserProvider>
              <UserLayout />
            </UserProvider>
          }
        >
          <Route index element={<MasterPage />} />
          <Route path="projects" element={<Projects />} />
          <Route path="services" element={<Services />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<UserLogin />} />
          <Route path="userprofile" element={<UserProfile />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="project/:id" element={<UserProjectDetail />} />
        </Route>

        {/* ✅ Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <AdminPrivateRoute>
              <AdminLayout />
            </AdminPrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="adminproject" element={<AdminProjects />} />
          <Route path="project/:id" element={<AllProjectDetail />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="approve-seller/:sellerId" element={<ApproveSeller />} />
        </Route>

        {/* ✅ Seller Routes */}
        <Route path="/seller/login" element={<SellerLogin />} />
        <Route
          path="/seller"
          element={
            <SellerPrivateRoute>
              <SellerLayout />
            </SellerPrivateRoute>
          }
        >
          <Route index element={<SellerDashboard />} />
          <Route path="sellerdashboard" element={<SellerDashboard />} />
          <Route path="profile" element={<SellerProfile />} />
          <Route path="sellerproject" element={<SellerProjects />} />
          <Route path="projects/:id" element={<EditProject />} />
          {/* <Route path="projects/:id" element={<SellerProjectDetail />} />  */}
          <Route path="editprojects/:id" element={<EditMyProject />} />



          {/* Add more seller-specific routes as needed */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
