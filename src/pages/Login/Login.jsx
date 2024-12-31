import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie
import "./Login.css";
import { UserContext } from "../../Context/UserContext";
import Modal from "react-modal"; // Import Modal library

const USER = import.meta.env.VITE_USER;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalEmail, setModalEmail] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [resetModalIsOpen, setResetModalIsOpen] = useState(false);
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${USER}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      if (response.status === 200) {
        const { token, user } = response.data.result;
        const role = user.role;
        const id = user.id;
        const fullName = user.fullName;

        console.log("User Role:", role);
        setUserData(id, token, fullName, role);

        // Store role and other data in cookies
        Cookies.set("Bearer", token, { expires: 1 });
        Cookies.set("fullName", fullName, { expires: 1 });
        Cookies.set("role", role, { expires: 1 }); // Store role in cookies
        Cookies.set("userData", JSON.stringify(response.data), { expires: 1 });

        // Set a 2-second delay before redirecting
        setTimeout(() => {
          // Redirect based on role
          if (role === "ADMIN") navigate("/admin");
          else navigate("/");
        }, 2000); // 2 seconds delay
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true); // Show loading spinner
    setModalMessage(""); // Clear previous messages
    try {
      const response = await axios.post(
        `${USER}/api/auth/forgot-password?email=${modalEmail}`,
        { email: modalEmail } // Send email in the request body
      );
      setTimeout(() => {
        setLoading(false);
        setModalMessage("Password reset email sent successfully!");
        setResetModalIsOpen(true); // Open reset password modal
      }, 2000);
    } catch (err) {
      setTimeout(() => {
        setLoading(false);
        console.error(err.response || err.message);
        setModalMessage(
          err.response?.data?.message || "An error occurred. Please try again."
        );
      }, 2000);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setModalMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(`${USER}/api/auth/reset-password`, {
        email: modalEmail,
        token: resetToken,
        newPassword,
        confirmNewPassword,
      });

      if (response.status === 200) {
        setModalMessage("Password has been reset successfully!");
        setTimeout(() => {
          setResetModalIsOpen(false);
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setModalMessage(
        err.response?.data?.message || "An error occurred. Please try again."
      );
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
          <p style={{ color: "white", fontWeight: "bold", fontSize: "50" }}>
            WELCOME TO THE OFFICIAL ANIME BLOG
          </p>
        </div>
      </div>
      <div className="login-form">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="login__form">
                <h3 style={{ fontWeight: "bold" }}>LOGIN</h3>
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
                    className="primary-btn"
                    style={{
                      backgroundColor: "#ff4343",
                      fontWeight: "700px",
                      width: "100%",
                    }}>
                    LOGIN NOW
                  </button>
                </form>
                <h6
                  style={{
                    color: "white",
                    fontSize: "15px",
                    marginTop: "20px",
                    textAlign: "center",
                  }}>
                  If you forget your password?{" "}
                  <span
                    style={{
                      color: "#00aaff",
                      fontWeight: "bold",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() => setModalIsOpen(true)}>
                    Click here
                  </span>
                </h6>
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

      {/* Modal for Forgot Password */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "400px" /* Set a fixed width */,
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)" /* Dimmed background */,
          },
        }}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "24px",
            fontWeight: "600",
            color: "#333",
          }}>
          Forgot Password
        </h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={modalEmail}
          onChange={(e) => setModalEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px",
            marginBottom: "20px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={handleForgotPassword}
          style={{
            width: "100%",
            backgroundColor: "#00aaff",
            color: "white",
            fontWeight: "bold",
            padding: "12px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            marginBottom: "10px",
            transition: "background-color 0.3s",
          }}>
          {loading ? "Sending..." : "Submit"}
        </button>
        <button
          onClick={() => setModalIsOpen(false)}
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #ccc",
            backgroundColor: "white",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "background-color 0.3s",
          }}>
          Close
        </button>
        {loading && (
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
            }}>
            <div className="spinner"></div>
          </div>
        )}
        {modalMessage && (
          <p style={{ marginTop: "20px", textAlign: "center", color: "#333" }}>
            {modalMessage}
          </p>
        )}
      </Modal>

      {/* Modal for Resetting Password */}
      <Modal
        isOpen={resetModalIsOpen}
        onRequestClose={() => setResetModalIsOpen(false)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}>
        <h2
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          Reset Your Password
        </h2>
        <input
          type="text"
          placeholder="Token"
          value={resetToken}
          onChange={(e) => setResetToken(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            fontSize: "16px",
          }}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            fontSize: "16px",
          }}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            fontSize: "16px",
          }}
        />
        <button
          onClick={handleResetPassword}
          style={{
            backgroundColor: "#00aaff",
            color: "white",
            fontWeight: "bold",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
          }}>
          Reset Password
        </button>
        <button
          onClick={() => setResetModalIsOpen(false)}
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            border: "1px solid #ccc",
            backgroundColor: "white",
            cursor: "pointer",
          }}>
          Close
        </button>
        {loading && (
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
            }}>
            <div className="spinner"></div>
          </div>
        )}
        {modalMessage && <p style={{ marginTop: "20px" }}>{modalMessage}</p>}
      </Modal>
    </div>
  );
};

export default Login;
