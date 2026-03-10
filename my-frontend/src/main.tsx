import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import LoginForm from "./page/login/form.tsx";
import SignupPage from "./page/signup/page.tsx";
import AdminLayout from "./page/Admin/layout.tsx";
import AdminIndexPage from "./page/Admin/page.tsx";
import ServicePage from "./page/Admin/service/page.tsx";
import JobInboxPage from "./page/Admin/jobinbox/page.tsx";
import HistoryPage from "./page/Admin/history/page.tsx";
import { Dashboard } from "./page/dashboard/dashboard-page.tsx";
import GuestPage from "./page/guest/page.tsx";
const RedirectFromSignin = () => {
  let navigate = useNavigate();
  useEffect(() => {
    navigate("/");
  }, [navigate]);
  return <></>;
};
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<RedirectFromSignin />} />
        <Route index element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="Admin" element={<AdminLayout />}>
          <Route index element={<AdminIndexPage />} />
          <Route path="service" element={<ServicePage />} />
          <Route path="job" element={<JobInboxPage />} />
          <Route path="history" element={<HistoryPage />} />
        </Route>
        <Route path="/guest" element={<GuestPage />} />
      </Routes>
    </BrowserRouter>
    ,
  </StrictMode>,
);
