import { Box, Spinner, useColorModeValue } from "@chakra-ui/react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

// Pages & Components
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EmailVerification from "./pages/EmailVerificationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NavigationPage from "./pages/NavigationPage";
import MyCart from "./components/MyCart";
import BillingAddress from "./components/BillingAddress";
import PaymentPage from "./pages/Payement";
import NavBar from "./components/NavBar";

// Stores
import { useProductStore } from "./store/product";
import { useAuthStore } from "./store/authStore";

// ✅ Protected Routes Wrapper
const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (user && !user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  return children;
};

// ✅ Redirect if already logged in
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const { products } = useProductStore(); // Ensure this hook is not conditionally used in its store
  const {
    isAuthenticated,
    isCheckingAuth,
    checkAuth,
    user,
  } = useAuthStore();

  const bgColor = useColorModeValue("red.100", "gray.900");

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <Spinner size="xl" thickness="4px" color="green.500" />
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <HomePage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoutes>
              <CreatePage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectAuthenticatedUser>
              <RegisterPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/nav" element={<NavigationPage />} />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoutes>
              <MyCart />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoutes>
              <BillingAddress />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoutes>
              <PaymentPage />
            </ProtectedRoutes>
          }
        />
      </Routes>
      <Toaster />
    </Box>
  );
}

export default App;
