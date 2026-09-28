import React from "react";
import { ArrowLeft, FileText, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import "../styles/legal.css";

function Terms() {
  return (
    <div className="legal-page">

      <div className="legal-container">

        <Link to="/" className="back-home">
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="legal-header">

          <div className="legal-icon">
            <FileText size={30} />
          </div>

          <h1>Terms & Conditions</h1>

          <p>
            Please read these terms carefully before using SkinAI.
          </p>

        </div>


        <div className="legal-card">

          <h2>1. Introduction</h2>

          <p>
            SkinAI is an AI-assisted skin image analysis application
            designed for educational and informational purposes.
            By accessing or using this application, you agree to
            these Terms & Conditions.
          </p>


          <h2>2. Use of the Application</h2>

          <p>
            Users may upload skin images for AI-assisted visual
            analysis. The application is intended to provide
            general information and should not be used as a
            replacement for professional medical advice.
          </p>


          <h2>3. AI-Generated Results</h2>

          <p>
            SkinAI uses artificial intelligence to identify visual
            patterns in submitted images. AI results may not always
            be accurate and should not be considered a confirmed
            medical diagnosis.
          </p>


          <h2>4. User Responsibility</h2>

          <p>
            Users are responsible for providing appropriate images
            and using the information provided by SkinAI responsibly.
            Users should consult a qualified healthcare professional
            when medical advice, diagnosis, or treatment is required.
          </p>


          <h2>5. Prohibited Use</h2>

          <p>
            Users should not misuse the application, upload illegal
            content, attempt to interfere with the application, or
            use the application for purposes other than its intended
            educational and informational functionality.
          </p>


          <h2>6. Limitation of Liability</h2>

          <p>
            SkinAI does not guarantee that AI-generated results will
            be accurate, complete, or suitable for a particular
            individual. Users should not make medical decisions
            solely based on the application's output.
          </p>


          <h2>7. Changes to These Terms</h2>

          <p>
            These Terms & Conditions may be updated when necessary.
            Continued use of SkinAI after changes means that the
            updated terms apply.
          </p>


          <h2>8. Contact</h2>

          <p>
            For questions regarding these terms, users may contact
            the SkinAI support team.
          </p>


          <div className="legal-notice">

            <ShieldCheck size={22} />

            <span>
              SkinAI is an educational AI-assisted application and
              is not a substitute for professional medical care.
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Terms;