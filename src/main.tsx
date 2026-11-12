import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { ScrollToHash } from "./components/common/ScrollToHash";
import AppointmentPage from "./pages/AppointmentPage";
import AttendanceResponse from "./pages/AttendanceResponse";
import HomePage from "./pages/HomePage";
import "./i18n";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/appointment" element={<AppointmentPage />} />
        <Route path="/presence" element={<AttendanceResponse />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster richColors closeButton position="top-right" />
    </BrowserRouter>
  </React.StrictMode>,
);
