import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import DoctorSigin from "./pages/Auth/DoctorSignin";
import DoctorSignup from "./pages/Auth/DoctorSignup";
import PatientSignin from "./pages/Auth/PatientSigin";
import PatientSignup from "./pages/Auth/PatientSignup";
import MultiStepConsultationForm from "./pages/Patient/ConsultationForm";
import Profile from "./pages/Doctor/Profile";
import Consultations from "./pages/Doctor/Consultations";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/doctor">
                <Route path="auth/signin" element={<DoctorSigin />} />
                <Route path="auth/signup" element={<DoctorSignup />} />
                <Route
                  path="consultations/:doctorId"
                  element={<Consultations />}
                />
                <Route path=":doctorId" element={<Profile />} />
              </Route>
              <Route path="/patient">
                <Route path="auth/signin" element={<PatientSignin />} />
                <Route path="auth/signup" element={<PatientSignup />} />
                <Route
                  path="consult/:doctorId"
                  element={<MultiStepConsultationForm />}
                />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
