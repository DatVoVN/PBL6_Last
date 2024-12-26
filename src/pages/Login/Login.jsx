import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie
import "./Login.css";
import { UserContext } from "../../Context/UserContext";
import Modal from "react-modal"; // Import Modal library

const USER = import.meta.env.VITE_USER;

const Login = () => {
  const [email, setEmail] = useState("dat246642@gmail.com");
  const [password, setPassword] = useState("01278983568aB@");
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false); // Modal state
  const [modalEmail, setModalEmail] = useState(""); // Email for modal
  const [modalMessage, setModalMessage] = useState(""); // Modal success/error message
  const [loading, setLoading] = useState(false); // Loading state
  const [resetToken, setResetToken] = useState(""); // Reset token state
  const [newPassword, setNewPassword] = useState(""); // New password state
  const [confirmNewPassword, setConfirmNewPassword] = useState(""); // Confirm new password state
  const [resetModalIsOpen, setResetModalIsOpen] = useState(false); // Reset modal state
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

        setUserData(id, token, fullName);
        Cookies.set("Bearer", token, { expires: 1 });
        Cookies.set("fullName", fullName, { expires: 1 });
        Cookies.set("userData", JSON.stringify(response.data), { expires: 1 });

        if (role === "ADMIN") navigate("/admin");
        else navigate("/");
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
        `https://localhost:7000/api/auth/forgot-password?email=${modalEmail}`,
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
      const response = await axios.post(
        `https://localhost:7000/api/auth/reset-password`,
        {
          email: modalEmail,
          token: resetToken,
          newPassword,
          confirmNewPassword,
        }
      );

      if (response.status === 200) {
        setModalMessage("Password has been reset successfully!");

        // Redirect to login page after success
        setTimeout(() => {
          setResetModalIsOpen(false); // Close modal after success
          navigate("/login"); // Redirect to login page
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
          },
        }}>
        <h2
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
            padding: "10px",
            marginBottom: "20px",
            fontSize: "16px",
          }}
        />
        <button
          onClick={handleForgotPassword}
          style={{
            backgroundColor: "#00aaff",
            color: "white",
            fontWeight: "bold",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
          }}>
          {loading ? "Sending..." : "Submit"}
        </button>
        <button
          onClick={() => setModalIsOpen(false)}
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
