import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { RequireAdmin } from "@/components/RequireAdmin";
import { AdminPage } from "@/pages/AdminPage";
import { AdminRoomsPage } from "@/pages/AdminRoomsPage";
import { HomePage } from "@/pages/HomePage";
import { JoinPage } from "@/pages/JoinPage";
import { LoginPage } from "@/pages/LoginPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/join/:roomSlug" element={<JoinPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminRoomsPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/:roomSlug"
          element={
            <RequireAdmin>
              <AdminPage />
            </RequireAdmin>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster
        theme="dark"
        position="top-center"
        toastOptions={{
          classNames: {
            toast: "border border-white/10 bg-[#0d1117] text-white",
          },
        }}
      />
    </BrowserRouter>
  );
}
