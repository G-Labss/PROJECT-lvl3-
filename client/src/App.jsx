import AdminDashboard from "./pages/AdminDashboard";
import AboutPage from "./pages/AboutPage";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { ToastProvider } from "./context/ToastContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import LessonsPage from "./pages/LessonsPage";
import RatesPage from "./pages/RatesPage";
import RankingPage from "./pages/RankingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyProgressPage from "./pages/MyProgressPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="lessons" element={<LessonsPage />} />
              <Route path="rates" element={<RatesPage />} />
              <Route path="ranking" element={<RankingPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route element={<ProtectedRoute roles={['admin', 'coach']} />}>
                <Route path="admin" element={<AdminDashboard />} />
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route path="my-progress" element={<MyProgressPage />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Router>
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
