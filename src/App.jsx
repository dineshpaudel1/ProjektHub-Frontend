import { HashRouter as Router, Routes, Route } from "react-router-dom";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import ScrollToTop from "./components/ScrollToTop";
import SellerLayout from "./layouts/SellerLayout";
import AdminPrivateRoute from "./utils/AdminPrivateRoute";
import SellerPrivateRoute from "./utils/SellerPrivateRoute";
import { UserProvider } from "./context/UserContext";

import { AdminLogin, Dashboard, AdminProjects, AllProjectDetail, AdminProfile, OrderSummary, ApproveSeller, AdminOrderDetails } from "./pages/admin";
import { SellerLogin, SellerDashboard, SellerProfile, SellerProjects, EditProject } from "./pages/seller";
import { MasterPage, Projects, Services, About, UserLogin, ForgotPassword, UserProfile, UserProjectDetail, SeeAllProject, SeeSellerProfile, MyOrder } from "./pages/user";


function App() {
  return (
    <Router>
      <ScrollToTop />
      <ToastContainer />
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
          <Route path="userprofile" element={<UserProfile />} />
          <Route path="/project/:id" element={<UserProjectDetail />} />
          <Route path="seeallproject" element={<SeeAllProject />} />
          <Route path="/seller/:id" element={<SeeSellerProfile />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="my-orders" element={<MyOrder />} />
        </Route>

        {/* ✅ Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
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
          <Route path="ordersummary" element={<OrderSummary />} />
          <Route path="approve-seller/:sellerId" element={<ApproveSeller />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
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
          {/* <Route path="editprojects/:id" element={<EditMyProject />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
