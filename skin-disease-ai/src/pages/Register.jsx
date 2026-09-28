import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
  UserPlus,
  ArrowLeft,
  CheckCircle,
  LoaderCircle
} from "lucide-react";

import "../styles/auth.css";

const API_URL = "http://localhost:8080/api/auth";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Check password
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Check password length
    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : "Registration failed."
        );
      }

      setSuccess(
        "Registration successful! Redirecting to login..."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {

      console.error("Registration error:", error);

      setError(
        error.message ||
        "Unable to connect to the backend."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-container">

        {/* LEFT SIDE */}

        <div className="auth-info">

          <Link to="/" className="auth-back">
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
              Create Your
              <span>Account</span>
            </h1>

            <p>
              Join SkinAI and keep your AI-assisted
              skin analysis results organized in one place.
            </p>

            <div className="auth-points">

              <div>
                <CheckCircle size={19} />
                Easy image analysis
              </div>

              <div>
                <CheckCircle size={19} />
                Analysis history
              </div>

              <div>
                <CheckCircle size={19} />
                Personalized dashboard
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="auth-form-area">

          <div className="auth-form-card register-card">

            <div className="mobile-auth-logo">

              <div className="auth-logo">
                <Activity size={25} />
              </div>

              <span>
                Skin<span>AI</span>
              </span>

            </div>

            <div className="auth-heading">

              <h2>Create Account</h2>

              <p>
                Fill in your details to get started.
              </p>

            </div>

            {/* ERROR */}

            {error && (
              <div className="auth-message error">
                {error}
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="auth-message success">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* NAME */}

              <div className="form-group">

                <label>Full Name</label>

                <div className="input-wrapper">

                  <User size={19} />

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div className="form-group">

                <label>Email Address</label>

                <div className="input-wrapper">

                  <Mail size={19} />

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div className="form-group">

                <label>Password</label>

                <div className="input-wrapper">

                  <LockKeyhole size={19} />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
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

              {/* CONFIRM PASSWORD */}

              <div className="form-group">

                <label>Confirm Password</label>

                <div className="input-wrapper">

                  <LockKeyhole size={19} />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

              </div>

              {/* SUBMIT */}

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
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus size={19} />
                    Create Account
                  </>
                )}

              </button>

            </form>

            <p className="auth-switch">

              Already have an account?

              <Link to="/login">
                Sign In
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;