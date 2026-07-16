import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import { Navbar, Footer, ErrorBoundary } from "./components";
import { Home, About, Projects, Contacts, Blog } from "./pages";

const AdminLogin = lazy(() => import("./admin/AdminLogin"));
const AdminLayout = lazy(() => import("./admin/AdminLayout"));
const ProtectedRoute = lazy(() => import("./admin/ProtectedRoute"));

function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={null}>
              <AdminLogin />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={null}>
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            </Suspense>
          }
        />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <main className="bg-slate-300/20 h-full">
      <ErrorBoundary>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ErrorBoundary>
    </main>
  );
}

export default App;
