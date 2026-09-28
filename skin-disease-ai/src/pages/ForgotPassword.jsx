import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  ArrowLeft,
  Send,
  ShieldCheck,
  Loader2
} from "lucide-react";

import "../styles/auth.css";

function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:8080/api/auth";

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        `${API_URL}/forgot-password`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: email.trim()
          })
        }
      );

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data);
      }

      // Store email temporarily for the next page
      sessionStorage.setItem(
        "resetEmail",
        email.trim()
      );

      // Go to OTP page
      navigate("/verify-otp");

    } catch (error) {

      setError(
        error.message ||
        "Unable to send OTP. Please try again."
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-container">

        {/* Back to Login */}

        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/login")}
        >
          <ArrowLeft size={18} />
          Back to Login
        </button>


        {/* Card */}

        <div className="auth-card">

          <div className="auth-icon">
            <ShieldCheck size={32} />
          </div>

          <h2>Forgot Password?</h2>

          <p className="auth-subtitle">
            Enter your registered email address and
            we'll send you a verification OTP.
          </p>


          {/* Error */}

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}


          <form onSubmit={handleSubmit}>

            {/* Email */}

            <div className="form-group">

              <label>Email Address</label>

              <div className="input-wrapper">

                <Mail size={19} />

                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  disabled={loading}
                  autoComplete="email"
                />

              </div>

            </div>


            {/* Send OTP */}

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <Loader2
                    size={19}
                    className="spin"
                  />
                  Sending OTP...
                </>
              ) : (
                <>
                  <Send size={19} />
                  Send OTP
                </>
              )}

            </button>

          </form>


          <p className="auth-footer-text">
            Remember your password?{" "}

            <button
              type="button"
              className="auth-link-button"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

          </p>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;