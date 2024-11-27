import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie
import { Link } from "react-router-dom";
import "./Login.css";
import { UserContext } from "../../Context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("dat246642@gmail.com");
  const [password, setPassword] = useState("01278983568aB@");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext); // Access setUserData from UserContext

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("12345");
      const response = await axios.post(
        "https://cineworld.io.vn:7000/api/auth/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Response:", response.data);

      if (response.status === 200) {
        const { token, user } = response.data.result;
        const role = user.role;
        const id = user.id;
        const fullName = user.fullName; // Get fullName from the response

        console.log("Role:", role);
        console.log("User ID:", id);
        console.log("Full Name:", fullName);

        // Set user data in context and cookies
        setUserData(id, token, fullName); // Pass fullName to setUserData

        Cookies.set("Bearer", token, { expires: 1 });
        Cookies.set("fullName", fullName, { expires: 1 }); // Save fullName in cookies

        // Save the entire response.data to a cookie
        Cookies.set("userData", JSON.stringify(response.data), { expires: 1 });

        // Navigate based on role
        if (role === "ADMIN") {
          console.log("1");
          navigate("/admin");
        } else {
          console.log("12");
          navigate("/"); // Navigate to the home page
        }
      }
    } catch (err) {
      if (err.response) {
        setError(
          err.response.data.message ||
            "Login failed. Please check your credentials."
        );
      } else {
        setError("An unexpected error occurred.");
      }
      console.error(err.response);
    }
  };

  return (
    <div className="login">
      <div className="image-wrapper">
        <img
          src="./img/normal-breadcrumb.jpg"
          alt="Background"
          className="background-image"
        />
        <div className="text-content">
          <h1>LOGIN</h1>
          <p>WELCOME TO THE OFFICIAL ANIME BLOG</p>
        </div>
      </div>
      <div className="login-form">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="login__form">
                <h3>Login</h3>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <form onSubmit={handleLogin}>
                  <div className="input__item">
                    <input
                      type="text"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="input__item">
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="site-btn123"
                    style={{ backgroundColor: "#ff4343", fontWeight: "700px" }}>
                    LOGIN NOW
                  </button>
                </form>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="login__register">
                <h3>Don’t Have An Account?</h3>
                <Link to="/register" className="primary-btn">
                  REGISTER NOW
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
