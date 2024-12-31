import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import HomePage from "./pages/Homepage/HomePage.jsx";
import MovieDetail from "./pages/MovieDetail/MovieDetail.jsx";
import MovieWatching from "./pages/MovieWatching/MovieWatching.jsx";
import CategoryPage from "./pages/CategoryPage/CategoryPage.jsx";
import CountryPage from "./pages/CountryPage/CountryPage.jsx";
import SearchResults from "./pages/SearchResult/SearchResult.jsx";
import PageNotFound from "./pages/PageNotFound/PageNotFound.jsx";
import Membership from "./pages/Membership/Membership.jsx";
import { UserProvider } from "./Context/UserContext.jsx";
import CouponPage from "./pages/CouponPage/CouponPage.jsx";
import PaymentSuccessPage from "./pages/PaymentSuccessPage/PaymentSuccessPage.jsx";
import ChangePassword from "./pages/ChangePassword/ChangePassword.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import Admin from "./pages/admin/Admin.jsx";
import { ThemeProvider } from "./pages/admin/contextAd/ThemeContext.jsx";
import Receipt from "./pages/Receipt/Receipt.jsx";
import Favorites from "./pages/Favorites/Favorites.jsx";
import History from "./pages/History/History.jsx";
import { SidebarProvider } from "./pages/admin/contextAd/SidebarContext.jsx";
import SearchResultDetail from "./pages/SearchResultDetail/SearchResultDetail.jsx";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the ToastContainer styles
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import NoMovieComponent from "./components/NoMovieComponent/NoMovieComponent.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <Admin />
                  </SidebarProvider>
                </ProtectedRoute>
              }
            />

            {/* User Routes */}
            <Route path="/" element={<App />}>
              <Route index element={<HomePage />} />
              <Route path="/detail-watching/:id" element={<MovieDetail />} />
              <Route path="/movie-watching/:id" element={<MovieWatching />} />
              <Route path="/category/:id" element={<CategoryPage />} />
              <Route path="/country/:id" element={<CountryPage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="*" element={<PageNotFound />} />
              <Route path="/membership" element={<Membership />} />
              <Route
                path="/membership/coupon/:packageId"
                element={<CouponPage />}
              />
              <Route path="/payment-success" element={<PaymentSuccessPage />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/receipt" element={<Receipt />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/history" element={<History />} />
              <Route path="/search-results" element={<SearchResultDetail />} />
              <Route path="/no-movie" element={<NoMovieComponent />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  </StrictMode>
);
