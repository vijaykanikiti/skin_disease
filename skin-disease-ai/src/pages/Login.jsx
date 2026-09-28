import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import {
  Activity,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowLeft,
  LogIn,
  LoaderCircle
} from "lucide-react";

import "../styles/auth.css";

const API_URL = "http://localhost:8080/api/auth";

function Login() {
  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setError("");
  };

  // ==========================================
  // SAVE USER
  // ==========================================

  const saveUserAndRedirect = (loggedInUser) => {
    if (!loggedInUser || !loggedInUser.id) {
      throw new Error(
        "Login successful, but user information was not returned by the server."
      );
    }

    console.log("Logged in user:", loggedInUser);

    // Clear old user data
    localStorage.removeItem("user");
    localStorage.removeItem("skinai-user");
    localStorage.removeItem("userData");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("currentUser");

    // Convert user to JSON
    const userJSON = JSON.stringify(loggedInUser);

    // Save user
    localStorage.setItem("user", userJSON);
    localStorage.setItem("skinai-user", userJSON);
    localStorage.setItem("userData", userJSON);
    localStorage.setItem("loggedInUser", userJSON);
    localStorage.setItem("currentUser", userJSON);

    console.log(
      "Saved user:",
      JSON.parse(localStorage.getItem("user"))
    );

    console.log("Saved user ID:", loggedInUser.id);
    console.log("Saved user role:", loggedInUser.role);

    // Redirect
    if (
      String(loggedInUser.role || "").toUpperCase() === "ADMIN"
    ) {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  // ==========================================
  // NORMAL LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password
        })
      });

      // Read backend response
      const responseText = await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        data = responseText;
      }

      console.log("Login response:", data);

      // Login error
      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data.message || "Login failed."
        );
      }

      // Normalize user object
      let loggedInUser = data;

      if (data && data.user && data.user.id) {
        loggedInUser = data.user;
      }

      // Save user and redirect
      saveUserAndRedirect(loggedInUser);

    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.message ||
          "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GOOGLE LOGIN
  // ==========================================

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);

    try {
      console.log(
        "Google credential received:",
        credentialResponse
      );

      if (!credentialResponse?.credential) {
        throw new Error(
          "Google did not return a valid credential."
        );
      }

      const response = await fetch(`${API_URL}/google`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          credential: credentialResponse.credential
        })
      });

      const responseText = await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        data = responseText;
      }

      console.log("Google login response:", data);

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data.message || "Google login failed."
        );
      }

      // Backend may return:
      // { user: {...} }
      // or directly return user object

      let loggedInUser = data;

      if (data && data.user && data.user.id) {
        loggedInUser = data.user;
      }

      // Save user and redirect
      saveUserAndRedirect(loggedInUser);

    } catch (error) {
      console.error("Google login error:", error);

      setError(
        error.message ||
          "Google login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GOOGLE LOGIN ERROR
  // ==========================================

  const handleGoogleError = () => {
    console.error("Google Login Failed");

    setError(
      "Google login was cancelled or failed. Please try again."
    );
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="auth-page">

      <div className="auth-container">

        {/* ==================================
            LEFT SIDE
        ================================== */}

        <div className="auth-info">

          <Link
            to="/"
            className="auth-back"
          >
            <ArrowLeft size={17} />

            Back to Home
          </Link>

          <div className="auth-brand">

            <div className="auth-logo">
              <Activity size={27} />
            </div>

            <span>
              Skin<span>AI</span>
            </span>

          </div>

          <div className="auth-info-content">

            <h1>
              Welcome
              <span>
                Back!
              </span>
            </h1>

            <p>
              Sign in to continue exploring
              your AI-assisted skin analysis
              dashboard.
            </p>

            <div className="auth-points">

              <div>
                <span>✓</span>
                AI-assisted image analysis
              </div>

              <div>
                <span>✓</span>
                Keep your analysis history
              </div>

              <div>
                <span>✓</span>
                Simple and easy dashboard
              </div>

            </div>

          </div>

        </div>

        {/* ==================================
            RIGHT SIDE
        ================================== */}

        <div className="auth-form-area">

          <div className="auth-form-card">

            {/* MOBILE LOGO */}

            <div className="mobile-auth-logo">

              <div className="auth-logo">
                <Activity size={25} />
              </div>

              <span>
                Skin<span>AI</span>
              </span>

            </div>

            {/* HEADING */}

            <div className="auth-heading">

              <h2>
                Sign In
              </h2>

              <p>
                Enter your details to access
                your account.
              </p>

            </div>

            {/* ERROR */}

            {error && (
              <div className="auth-message error">
                {error}
              </div>
            )}

            {/* FORM */}

            <form onSubmit={handleSubmit}>

              {/* EMAIL */}

              <div className="form-group">

                <label>
                  Email Address
                </label>

                <div className="input-wrapper">

                  <Mail size={19} />

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div className="form-group">

                <div className="password-label">

                  <label>
                    Password
                  </label>

                  <Link to="/forgot-password">
                    Forgot Password?
                  </Link>

                </div>

                <div className="input-wrapper">

                  <LockKeyhole size={19} />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >

                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}

                  </button>

                </div>

              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <LoaderCircle
                      size={19}
                      className="loading-icon"
                    />

                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn size={19} />

                    Sign In
                  </>
                )}

              </button>

            </form>

            {/* DIVIDER */}

            <div className="auth-divider">
              <span>
                OR
              </span>
            </div>

            {/* GOOGLE LOGIN */}

            <div
              className="google-login-wrapper"
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center"
              }}
            >

              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                text="continue_with"
                shape="rectangular"
                width="100%"
              />

            </div>

            {/* REGISTER */}

            <p className="auth-switch">

              Don't have an account?

              <Link to="/register">
                Create Account
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;