import React from "react";
import { ArrowLeft, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import "../styles/legal.css";

function Privacy() {
  return (
    <div className="legal-page">

      <div className="legal-container">

        <Link to="/" className="back-home">
          <ArrowLeft size={18} />
          Back to Home
        </Link>


        <div className="legal-header">

          <div className="legal-icon">
            <LockKeyhole size={30} />
          </div>

          <h1>Privacy Policy</h1>

          <p>
            Information about how SkinAI handles user information.
          </p>

        </div>


        <div className="legal-card">

          <h2>1. Information We Collect</h2>

          <p>
            SkinAI may collect information required for account
            registration and application functionality, such as
            name, email address, and account information.
          </p>


          <h2>2. Uploaded Images</h2>

          <p>
            Images uploaded for analysis may be processed by the
            application to generate an AI-assisted analysis result.
            Users should avoid uploading unnecessary personal or
            identifying information in images.
          </p>


          <h2>3. Account Information</h2>

          <p>
            Registration information may be stored in the application's
            database to provide authentication and account-related
            functionality.
          </p>


          <h2>4. How Information Is Used</h2>

          <p>
            Information may be used to provide authentication,
            process analysis requests, maintain analysis history,
            and improve the functionality of the application.
          </p>


          <h2>5. Data Protection</h2>

          <p>
            Reasonable technical measures are used to protect
            application data. However, no online system can guarantee
            complete security.
          </p>


          <h2>6. Third-Party Services</h2>

          <p>
            If external services or APIs are used for AI processing,
            certain information or uploaded content may be processed
            by those services according to their applicable policies.
          </p>


          <h2>7. User Rights</h2>

          <p>
            Users may request information about their account data
            and may contact the application administrator regarding
            questions about their information.
          </p>


          <h2>8. Policy Updates</h2>

          <p>
            This Privacy Policy may be updated from time to time to
            reflect changes in application functionality or data
            handling practices.
          </p>


          <div className="legal-notice">

            <ShieldCheck size={22} />

            <span>
              Please avoid uploading unnecessary personal information
              in skin images.
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Privacy;