import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  ShieldCheck,
  CheckCircle,
  Loader2
} from "lucide-react";

import "../styles/auth.css";

function ResetPassword() {

  const navigate = useNavigate();

  const email = sessionStorage.getItem("resetEmail");
  const otpVerified =
    sessionStorage.getItem("otpVerified");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:8080/api/auth";

  const handleResetPassword = async (e) => {

    e.preventDefault();

    setError("");

    // Check reset session
    if (!email || otpVerified !== "true") {

      setError(
        "OTP verification is required. Please start again."
      );

      return;
    }

    // Check password
    if (!newPassword.trim()) {

      setError(
        "Please enter a new password."
      );

      return;
    }

    if (newPassword.length < 6) {

      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }

    // Check confirmation
    if (newPassword !== confirmPassword) {

      setError(
        "Passwords do not match."
      );

      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        `${API_URL}/reset-password`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: email,
            newPassword: newPassword
          })
        }
      );

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data);
      }

      // Clear reset session
      sessionStorage.removeItem("resetEmail");
      sessionStorage.removeItem("otpVerified");

      // Go to login
      navigate("/login", {
        state: {
          message:
            "Password reset successfully. Please login with your new password."
        }
      });

    } catch (error) {

      setError(
        error.message ||
        "Password reset failed. Please try again."
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-container">

        <div className="auth-card">

          {/* Icon */}

          <div className="auth-icon">
            <ShieldCheck size={32} />
          </div>

          <h2>Reset Password</h2>

          <p className="auth-subtitle">
            Create a new password for
            <br />
            <strong>{email}</strong>
          </p>


          {/* Error */}

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}


          <form onSubmit={handleResetPassword}>

            {/* New Password */}

            <div className="form-group">

              <label>New Password</label>

              <div className="input-wrapper">

                <Lock size={19} />

                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                  disabled={loading}
                  autoComplete="new-password"
                />

              </div>

            </div>


            {/* Confirm Password */}

            <div className="form-group">

              <label>Confirm Password</label>

              <div className="input-wrapper">

                <Lock size={19} />

                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  disabled={loading}
                  autoComplete="new-password"
                />

              </div>

            </div>


            {/* Reset Button */}

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
                  Resetting Password...
                </>
              ) : (
                <>
                  <CheckCircle size={19} />
                  Reset Password
                </>
              )}

            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default ResetPassword;