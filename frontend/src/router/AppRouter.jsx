import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { LocationProvider } from "../context/LocationContext";
import ProtectedRoute from "../components/common/ProtectedRoute";

import TrustedContacts from "../pages/TrustedContacts";
import OfflineMode from "../pages/OfflineMode";
import ApiTest from "../pages/ApiTest";

import GetStarted from "../pages/GetStarted";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Sos from "../pages/Sos";
import SafetyMap from "../pages/SafetyMap";
import Alerts from "../pages/Alerts";
import EmergencyContacts from "../pages/EmergencyContacts";
import AiAssistant from "../pages/AiAssistant";
import CommunityReports from "../pages/CommunityReports";
import EvidenceCapture from "../pages/EvidenceCapture";
import EvidenceCamera from "../pages/EvidenceCamera";
import BloodBanks from "../pages/BloodBanks";

/* Blood Emergency Feature Pages */
import BloodRequest from "../pages/BloodRequest";
import DonorRegister from "../pages/DonorRegister";
import BloodDonors from "../pages/BloodDonors";

export default function AppRouter() {
  return (
    <AuthProvider>
      <LocationProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<GetStarted />} />
            <Route path="/login" element={<Login />} />
            <Route path="/offline" element={<OfflineMode />} />
            <Route path="/api-test" element={<ApiTest />} />

            {/* Protected Routes */}
            <Route path="/guardians" element={<ProtectedRoute><TrustedContacts /></ProtectedRoute>} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/sos" element={<ProtectedRoute><Sos /></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute><SafetyMap /></ProtectedRoute>} />
            <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
            <Route path="/contacts" element={<ProtectedRoute><EmergencyContacts /></ProtectedRoute>} />
            <Route path="/assistant" element={<ProtectedRoute><AiAssistant /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><CommunityReports /></ProtectedRoute>} />
            <Route path="/blood-banks" element={<BloodBanks />} />

            <Route path="/evidence" element={<EvidenceCapture />} />
            <Route path="/evidence/camera" element={<EvidenceCamera />} />

            {/* Blood Emergency Routes */}
            <Route path="/blood-request" element={<ProtectedRoute><BloodRequest /></ProtectedRoute>} />
            <Route path="/donor-register" element={<ProtectedRoute><DonorRegister /></ProtectedRoute>} />
            <Route path="/blood-donors" element={<ProtectedRoute><BloodDonors /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </LocationProvider>
    </AuthProvider>
  );
}
