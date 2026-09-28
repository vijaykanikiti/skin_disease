import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  ArrowLeft,
  CheckCircle,
  Loader2
} from "lucide-react";

import "../styles/auth.css";

function VerifyOtp() {

  const navigate = useNavigate();

  const email =
    sessionStorage.getItem("resetEmail");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:8080/api/auth";

  const handleVerify = async (e) => {

    e.preventDefault();

    setError("");

    if (!email) {
      setError(
        "Reset session expired. Please request a new OTP."
      );
      return;
    }

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must contain exactly 6 digits.");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        `${API_URL}/verify-otp`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: email,
            otp: otp.trim()
          })
        }
      );

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data);
      }

      // OTP verified
      sessionStorage.setItem(
        "otpVerified",
        "true"
      );

      navigate("/reset-password");

    } catch (error) {

      setError(
        error.message ||
        "OTP verification failed."
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-container">

        <button
          type="button"
          className="back-button"
          onClick={() =>
            navigate("/forgot-password")
          }
        >
          <ArrowLeft size={18} />
          Back
        </button>


        <div className="auth-card">

          <div className="auth-icon">
            <ShieldCheck size={32} />
          </div>

          <h2>Verify OTP</h2>

          <p className="auth-subtitle">
            Enter the 6-digit OTP sent to
            <br />
            <strong>{email}</strong>
          </p>


          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}


          <form onSubmit={handleVerify}>

            <div className="form-group">

              <label>Verification OTP</label>

              <div className="input-wrapper">

                <CheckCircle size={19} />

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength="6"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) =>
                    setOtp(
                      e.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                  disabled={loading}
                />

              </div>

            </div>


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
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle size={19} />
                  Verify OTP
                </>
              )}

            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default VerifyOtp;