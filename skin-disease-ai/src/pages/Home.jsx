import React from "react";
import {
  ArrowRight,
  Camera,
  CheckCircle,
  ShieldCheck,
  Sparkles,
  Upload,
  Activity,
  Stethoscope,
  Mail
} from "lucide-react";

import "../styles/home.css";

function Home() {
  return (
    <div className="home-page">

      {/* =========================
          HERO SECTION
      ========================== */}
      <section className="hero-section">
        <div className="container">

          <div className="row align-items-center">

            {/* HERO LEFT */}
            <div className="col-lg-7">

              <div className="hero-badge">
                <Sparkles size={16} />
                AI-Powered Skin Analysis
              </div>

              <h1 className="hero-title">
                Understand Your Skin
                <span> With AI Assistance</span>
              </h1>

              <p className="hero-description">
                Upload a skin image and receive an AI-assisted
                analysis with possible conditions, confidence
                information, symptoms and general care guidance.
              </p>

              <div className="hero-buttons">

                <a
                  href="#how-it-works"
                  className="primary-btn"
                >
                  Start Analysis
                  <ArrowRight size={19} />
                </a>

                <a
                  href="#about"
                  className="secondary-btn"
                >
                  Learn More
                </a>

              </div>

              <div className="hero-features">

                <div>
                  <CheckCircle size={18} />
                  Easy to use
                </div>

                <div>
                  <CheckCircle size={18} />
                  AI assisted
                </div>

                <div>
                  <CheckCircle size={18} />
                  Result history
                </div>

              </div>

            </div>


            {/* HERO RIGHT */}
            <div className="col-lg-5">

              <div className="ai-preview-card">

                <div className="scan-icon">
                  <Activity size={48} />
                </div>

                <h3>Skin Analysis</h3>

                <p>
                  Upload an image to begin your analysis.
                </p>

                <div className="upload-box">

                  <Upload size={30} />

                  <span>
                    Upload Skin Image
                  </span>

                  <small>
                    JPG, JPEG or PNG
                  </small>

                </div>

                <div className="analysis-status">

                  <span className="status-dot"></span>

                  AI Analysis Ready

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================
          ABOUT SECTION
      ========================== */}
      <section
        className="about-section"
        id="about"
      >

        <div className="container">

          <div className="section-heading">

            <span>
              ABOUT SKINAI
            </span>

            <h2>
              A Simple Way to Explore Skin Health
            </h2>

            <p>
              SkinAI provides AI-assisted visual analysis for
              educational and informational purposes.
            </p>

          </div>


          <div className="row g-4">

            {/* CARD 1 */}
            <div className="col-md-4">

              <div className="info-card">

                <div className="info-icon">
                  <Camera />
                </div>

                <h4>
                  Upload Image
                </h4>

                <p>
                  Select or capture a clear image of the
                  skin area you want to analyze.
                </p>

              </div>

            </div>


            {/* CARD 2 */}
            <div className="col-md-4">

              <div className="info-card">

                <div className="info-icon">
                  <Sparkles />
                </div>

                <h4>
                  AI Analysis
                </h4>

                <p>
                  The system uses an AI model to identify
                  visual patterns in the submitted image.
                </p>

              </div>

            </div>


            {/* CARD 3 */}
            <div className="col-md-4">

              <div className="info-card">

                <div className="info-icon">
                  <Stethoscope />
                </div>

                <h4>
                  General Guidance
                </h4>

                <p>
                  View general information and warning signs
                  while understanding that AI results are
                  not a medical diagnosis.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          HOW IT WORKS
      ========================== */}
      <section
        className="how-section"
        id="how-it-works"
      >

        <div className="container">

          <div className="section-heading">

            <span>
              HOW IT WORKS
            </span>

            <h2>
              Three Simple Steps
            </h2>

          </div>


          <div className="row g-4">

            {/* STEP 1 */}
            <div className="col-md-4">

              <div className="step-card">

                <div className="step-number">
                  01
                </div>

                <Upload />

                <h4>
                  Upload
                </h4>

                <p>
                  Upload a clear skin image.
                </p>

              </div>

            </div>


            {/* STEP 2 */}
            <div className="col-md-4">

              <div className="step-card">

                <div className="step-number">
                  02
                </div>

                <Sparkles />

                <h4>
                  Analyze
                </h4>

                <p>
                  AI analyzes visible image patterns.
                </p>

              </div>

            </div>


            {/* STEP 3 */}
            <div className="col-md-4">

              <div className="step-card">

                <div className="step-number">
                  03
                </div>

                <ShieldCheck />

                <h4>
                  Understand
                </h4>

                <p>
                  Review the result and general information.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          DISCLAIMER
      ========================== */}
      <section className="disclaimer-section">

        <div className="container">

          <div className="disclaimer-card">

            <ShieldCheck size={30} />

            <div>

              <h4>
                Important Information
              </h4>

              <p>
                SkinAI is an educational AI-assisted tool.
                Its results should not be considered a medical
                diagnosis. Consult a qualified healthcare
                professional for diagnosis or treatment.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          FOOTER
      ========================== */}
      <footer className="site-footer">

        <div className="container">

          <div className="footer-content">

            {/* FOOTER BRAND */}
            <div className="footer-brand">

              <div className="footer-logo">

                <Activity size={25} />

                <span>
                  SkinAI
                </span>

              </div>

              <p>
                AI-assisted skin analysis designed to help
                users explore skin health information.
              </p>

            </div>


            {/* QUICK LINKS */}
            <div className="footer-links">

              <h4>
                Quick Links
              </h4>

              <a href="#about">
                About
              </a>

              <a href="#how-it-works">
                How It Works
              </a>

              <a href="/login">
                Login
              </a>

              <a href="/register">
                Register
              </a>

            </div>


            {/* LEGAL LINKS */}
            <div className="footer-links">

              <h4>
                Legal
              </h4>

              <a href="/terms">
                Terms & Conditions
              </a>

              <a href="/privacy">
                Privacy Policy
              </a>

              
            </div>


            {/* SOCIAL MEDIA */}
            <div className="footer-social">

              <h4>
                Follow Us
              </h4>

              <div className="social-icons">

                {/* Facebook */}
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <span>
                    f
                  </span>
                </a>


                {/* Instagram */}
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <span>
                    ◎
                  </span>
                </a>


                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <span>
                    in
                  </span>
                </a>


                {/* X */}
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                >
                  <span>
                    𝕏
                  </span>
                </a>


                {/* Email */}
                <a
                  href="mailto:contact@skinai.com"
                  aria-label="Email"
                >
                  <Mail size={20} />
                </a>

              </div>

            </div>

          </div>


          {/* FOOTER BOTTOM */}
          <div className="footer-bottom">

            <p>
              © {new Date().getFullYear()} SkinAI.
              All rights reserved.
            </p>

            <p>
              AI-assisted tool • Not a medical diagnosis
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default Home;