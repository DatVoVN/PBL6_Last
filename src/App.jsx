import { Navigate, Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import Cookies from "js-cookie";
import Footer from "./components/Footer/Footer";
import $ from "jquery";
window.$ = $;
window.jQuery = $;
export default function App() {
  const isLoggedIn = !!Cookies.get("authToken");

  return (
    <div className="App">
      {isLoggedIn && <Header />}
      {isLoggedIn ? (
        <>
          <Outlet /> <Footer />
        </>
      ) : (
        <Navigate to="/login" replace />
      )}
    </div>
  );
}
