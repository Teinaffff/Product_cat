import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home"; // Adjust the path as necessary
import LoginPage from "./pages/login";
import { AuthProvider } from "./context/Authcontext"; // Adjust the path if necessary
import ProtectedRoute from "./context/ProtectedRoute"; // Adjust the path if necessary
import Main from "./components/main";  // Adjust the path as necessary
import Faq from '../src/admin/faq';
import Dashboard from "./admin/Dashboard";
import Pdf from "./pages/pdf";


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <MainContent />
      </Router>
    </AuthProvider>
  );
};

const MainContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/start" element={<Main />} />
      <Route path="/faq" element={<Faq />} />
      <Route path = "/pdf" element={<Pdf/>}/>
      {/* <Route path="/dashboard" element={<Dashboard/>} /> */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

export default App;
