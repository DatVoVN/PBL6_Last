import { useState } from "react";
import axios from "axios";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
const Register = () => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:7000/api/auth/register",
        {
          email,
          userName,
          password,
          confirmPassword,
          gender,
          dateOfBirth,
        },
        { withCredentials: true }
      );
      console.log("Response:", response);
      if (response.status >= 200 && response.status < 300) {
        setSuccess("Registration successful! Redirecting to login...");
        setError(null);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      if (err.response) {
        console.log("Response data:", err.response.data);
        console.log("Response status:", err.response.status);
        if (err.response.data.errors) {
          setError(JSON.stringify(err.response.data.errors));
        } else {
          setError("Registration failed. Please try again.");
        }
        setSuccess(null);
      } else {
        setError("An unexpected error occurred.");
        setSuccess(null);
      }
    }
  };

  return (
    <div className="register">
      <div className="image-wrapper">
        <img
          src="./img/normal-breadcrumb.jpg"
          alt="Background"
          className="background-image"
        />
        <div className="text-content">
          <h1>REGISTER</h1>
          <p>WELCOME TO THE OFFICIAL ANIME BLOG</p>
        </div>
      </div>
      <div className="register-form">
        <div className="container">
          <div className="row">
            <div className="register__form">
              {error && <p style={{ color: "red" }}>{error}</p>}
              {success && <p style={{ color: "green" }}>{success}</p>}
              <form onSubmit={handleRegister}>
                <div className="input__group">
                  <div className="input__item">
                    <input
                      type="text"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input__item">
                    <input
                      type="text"
                      placeholder="Username"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="input__group">
                  <div className="input__item">
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input__item">
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="input__item">
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}>
                    <option className="options" value="Male">
                      Male
                    </option>
                    <option className="options" value="Female">
                      Female
                    </option>
                    <option className="options" value="Other">
                      Other
                    </option>
                  </select>
                </div>
                <div className="input__item">
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                  />
                </div>
                <div className="text1">
                  <h4>ALREADY HAVE A ACCOUNT?</h4>
                  <span>
                    <Link to={"/login"} className="textlink">
                      LOGIN
                    </Link>
                  </span>
                </div>
                <button type="submit" className="site-btn">
                  REGISTER NOW
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
