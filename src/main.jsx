import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Admin from "./pages/admin/admin.jsx";
import UpdateUser from "./pages/admin/User/UpdatedUser.jsx";
import HomeAd from "./pages/admin/AppLayout/HomeAd.jsx";
import User from "./pages/admin/User/User.jsx";
import Movies from "./pages/admin/Movies/Movies.jsx";
import CategoriesAd from "./pages/admin/Category/CategoriesAd.jsx";
import AddCategory from "./pages/admin/Category/AddCategory.jsx";
import UpdateCategory from "./pages/admin/Category/UpdateCategory.jsx";
import MoviesByCategory from "./pages/admin/Category/MovieByCategory.jsx";
import CountriesAd from "./pages/admin/Country/CountriesAd.jsx";
import AddCountry from "./pages/admin/Country/AddCountry.jsx";
import MoviesByCountry from "./pages/admin/Country/MoviesbyCountry.jsx";
import UpdateCountry from "./pages/admin/Country/UpdateCountry.jsx";
import GenreAd from "./pages/admin/Genre/GenreAd.jsx";
import AddGenre from "./pages/admin/Genre/AddGenre.jsx";
import UpdateGenre from "./pages/admin/Genre/UpdateGenre.jsx";
import MoviesByGenre from "./pages/admin/Genre/MovieByGenre.jsx";
import MovieDetailAd from "./pages/admin/MovieDetailAd/MovieDetailAd.jsx";
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

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/*ADMIN*/}
          <Route path="/admin" element={<Admin />}>
            <Route index element={<HomeAd />} />

            {/* Other Admin Routes */}
            <Route path="/admin/home" element={<HomeAd />} />
            {/* User */}
            <Route path="/admin/user" element={<User />} />
            <Route path="/admin/update-user/:id" element={<UpdateUser />} />
            {/* Movie */}
            <Route path="/admin/movies" element={<Movies />} />
            <Route path="/admin/movies/:movieId" element={<MovieDetailAd />} />
            {/*Country */}
            <Route path="/admin/countries" element={<CountriesAd />} />
            <Route path="/admin/addcountries" element={<AddCountry />} />
            <Route
              path="/admin/updatecountry/:id"
              element={<UpdateCountry />}
            />
            <Route
              path="/admin/countries/:id/movies"
              element={<MoviesByCountry />}
            />
            {/*Genre*/}
            <Route path="/admin/genre" element={<GenreAd />} />
            <Route path="/admin/addgenre" element={<AddGenre />} />
            <Route path="/admin/updategenre/:id" element={<UpdateGenre />} />
            <Route path="/admin/genre/:id/movies" element={<MoviesByGenre />} />
            {/*Category*/}
            <Route path="/admin/categories" element={<CategoriesAd />} />
            <Route path="/admin/addcategories" element={<AddCategory />} />
            <Route
              path="/admin/updatecategory/:id"
              element={<UpdateCategory />}
            />
            <Route
              path="/admin/categories/:id/movies"
              element={<MoviesByCategory />}
            />
          </Route>
          {/*USER*/}
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
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </StrictMode>
);
