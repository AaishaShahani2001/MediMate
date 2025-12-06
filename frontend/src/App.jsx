import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import DoctorDetails from "./pages/DoctorDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";

function Chrome({ children }) {
  const { pathname } = useLocation();
  const isAdminArea = pathname.startsWith("/admin");
  return (
    <>
      {!isAdminArea && <Navbar />}
      {children}
      {!isAdminArea && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Chrome>
        <Routes>
          {/* public */}
          <Route index element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctor/:id" element={<DoctorDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* patient/doctor demos (not protected here, but you can) */}
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/doctor" element={<DoctorDashboard />} />

          {/* admin auth + protected dashboard */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<ProtectedRoute requireRole="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Chrome>
    </BrowserRouter>
  );
}
