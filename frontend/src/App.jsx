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
import About from "./pages/About";
import Contact from "./pages/ContactUs";

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
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctor/:id" element={<DoctorDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<ProtectedRoute requireRole="patient" />}>
            <Route path="/patient" element={<PatientDashboard />} />
          </Route>
          
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
