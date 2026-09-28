import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  FileText,
  History,
  Info,
  ShieldCheck,
  Sparkles,
  Stethoscope
} from "lucide-react";

import "../styles/result.css";

function Result() {
  const navigate = useNavigate();
  const location = useLocation();

  // --------------------------------------------------
  // DATA RECEIVED FROM ANALYZE PAGE
  // --------------------------------------------------

  const image = location.state?.image;
  const fileName = location.state?.fileName;
  const backendResult = location.state?.result;


  // --------------------------------------------------
  // IF NO RESULT IS AVAILABLE
  // --------------------------------------------------

  if (!backendResult) {
    return (
      <div className="result-page">

        <header className="result-header">

          <div className="result-header-left">

            <button
              className="result-back-btn"
              onClick={() => navigate("/analyze")}
            >
              <ArrowLeft size={18} />
            </button>

            <div>

              <div className="result-title">
                <Sparkles size={21} />

                <h1>
                  Analysis Result
                </h1>
              </div>

              <p>
                AI-assisted visual analysis summary
              </p>

            </div>

          </div>

        </header>


        <main className="result-content">

          <section className="result-card">

            <div className="result-card-heading">

              <div className="result-card-icon orange">
                <AlertTriangle size={20} />
              </div>

              <div>

                <h3>
                  No Analysis Result
                </h3>

                <span>
                  No result is available for this session.
                </span>

              </div>

            </div>


            <p>
              Please upload a skin image and perform an
              analysis first.
            </p>


            <button
              className="result-primary-btn"
              onClick={() => navigate("/analyze")}
            >
              <Activity size={17} />
              Analyze Skin
            </button>

          </section>

        </main>

      </div>
    );
  }


  // --------------------------------------------------
  // REAL BACKEND DATA
  // --------------------------------------------------

  const conditionName =
    backendResult.conditionName ||
    "Uncertain / Needs Professional Review";


  const confidence = Number(
    backendResult.confidence || 0
  );


  const information =
    backendResult.information ||
    "No additional information is available.";


  // --------------------------------------------------
  // CONVERT STRING TO LIST
  // --------------------------------------------------

  const convertToList = (value) => {

    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      return value;
    }

    return value
      .split(/[.;]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

  };


  const symptoms =
    convertToList(
      backendResult.symptoms
    );


  const warningSigns =
    convertToList(
      backendResult.warningSigns
    );


  const prevention =
    backendResult.prevention ||
    "Follow general skin-care practices and consult a qualified healthcare professional when appropriate.";


  // --------------------------------------------------
  // DATE
  // --------------------------------------------------

  const createdAt = backendResult.createdAt
    ? new Date(
        backendResult.createdAt
      ).toLocaleString()
    : "Current session";


  // --------------------------------------------------
  // SAFE CONFIDENCE VALUE
  // --------------------------------------------------

  const safeConfidence = Math.min(
    Math.max(confidence, 0),
    100
  );


  // --------------------------------------------------
  // RESULT PAGE
  // --------------------------------------------------

  return (
    <div className="result-page">


      {/* ==========================================
          HEADER
      ========================================== */}

      <header className="result-header">

        <div className="result-header-left">

          <button
            className="result-back-btn"
            onClick={() => navigate("/analyze")}
          >
            <ArrowLeft size={18} />
          </button>


          <div>

            <div className="result-title">

              <Sparkles size={21} />

              <h1>
                Analysis Result
              </h1>

            </div>


            <p>
              AI-assisted visual analysis summary
            </p>

          </div>

        </div>


        <button
          className="history-header-btn"
          onClick={() => navigate("/history")}
        >
          <History size={17} />

          History

        </button>

      </header>



      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <main className="result-content">


        {/* ========================================
            RESULT SUMMARY
        ======================================== */}

        <section className="result-summary-card">


          {/* IMAGE */}

          <div className="result-image-section">

            {image ? (

              <img
                src={image}
                alt="Analyzed skin"
                className="result-image"
              />

            ) : (

              <div className="result-image-placeholder">

                <Activity size={42} />

                <span>
                  No image preview
                </span>

              </div>

            )}


            {fileName && (

              <div className="result-file-name">

                <FileText size={14} />

                <span>
                  {fileName}
                </span>

              </div>

            )}

          </div>



          {/* RESULT INFORMATION */}

          <div className="result-main-info">


            {/* SUCCESS */}

            <div className="result-success-badge">

              <CheckCircle size={16} />

              Analysis Completed

            </div>


            {/* LABEL */}

            <span className="prediction-label">

              AI-ASSISTED RESULT

            </span>


            {/* CONDITION */}

            <h2>
              {conditionName}
            </h2>


            {/* DESCRIPTION */}

            <p className="prediction-description">

              The uploaded image was analyzed using
              the application's AI image-classification
              system.

              <br />

              This result is provided for educational
              information only and is not a medical
              diagnosis.

            </p>



            {/* ====================================
                CONFIDENCE
            ==================================== */}

            <div className="confidence-section">


              <div className="confidence-header">

                <span>
                  AI Classification Score
                </span>


                <strong>
                  {safeConfidence.toFixed(2)}%
                </strong>

              </div>


              <div className="confidence-track">

                <div
                  className="confidence-fill"
                  style={{
                    width: `${safeConfidence}%`
                  }}
                />

              </div>


              <small>

                This score represents the model's
                classification score and should not
                be interpreted as medical certainty.

              </small>

            </div>

          </div>

        </section>



        {/* ========================================
            INFORMATION GRID
        ======================================== */}

        <section className="result-grid">


          {/* ======================================
              GENERAL INFORMATION
          ====================================== */}

          <div className="result-card">

            <div className="result-card-heading">

              <div className="result-card-icon blue">

                <Info size={20} />

              </div>


              <div>

                <h3>
                  General Information
                </h3>

                <span>
                  About this result
                </span>

              </div>

            </div>


            <p>
              {information}
            </p>

          </div>



          {/* ======================================
              SYMPTOMS
          ====================================== */}

          <div className="result-card">

            <div className="result-card-heading">

              <div className="result-card-icon orange">

                <Activity size={20} />

              </div>


              <div>

                <h3>
                  Common Symptoms
                </h3>

                <span>
                  Things that may be observed
                </span>

              </div>

            </div>


            {symptoms.length > 0 ? (

              <ul className="result-list">

                {symptoms.map(
                  (symptom, index) => (

                    <li key={index}>

                      <CheckCircle size={16} />

                      <span>
                        {symptom}
                      </span>

                    </li>

                  )
                )}

              </ul>

            ) : (

              <p>
                No symptom information was returned
                for this result.
              </p>

            )}

          </div>



          {/* ======================================
              WARNING SIGNS
          ====================================== */}

          <div className="result-card warning-card">

            <div className="result-card-heading">

              <div className="result-card-icon red">

                <AlertTriangle size={20} />

              </div>


              <div>

                <h3>
                  Warning Signs
                </h3>

                <span>
                  Seek professional advice if present
                </span>

              </div>

            </div>


            {warningSigns.length > 0 ? (

              <ul className="result-list warning-list">

                {warningSigns.map(
                  (warning, index) => (

                    <li key={index}>

                      <AlertTriangle size={16} />

                      <span>
                        {warning}
                      </span>

                    </li>

                  )
                )}

              </ul>

            ) : (

              <p>
                No warning-sign information was returned.
              </p>

            )}

          </div>



          {/* ======================================
              PREVENTION
          ====================================== */}

          <div className="result-card">

            <div className="result-card-heading">

              <div className="result-card-icon green">

                <ShieldCheck size={20} />

              </div>


              <div>

                <h3>
                  General Preventive Care
                </h3>

                <span>
                  Basic skin-care guidance
                </span>

              </div>

            </div>


            <p>
              {prevention}
            </p>

          </div>

        </section>



        {/* ========================================
            ANALYSIS INFORMATION
        ======================================== */}

        <section className="result-actions-card">

          <div>

            <div className="result-actions-title">

              <CalendarDays size={18} />

              <strong>
                Analysis Information
              </strong>

            </div>


            <span>
              Analysis generated: {createdAt}
            </span>

          </div>


          <div className="result-buttons">


            <button
              className="result-secondary-btn"
              onClick={() => navigate("/history")}
            >
              <History size={17} />

              View History

            </button>


            <button
              className="result-primary-btn"
              onClick={() => navigate("/analyze")}
            >
              <Activity size={17} />

              New Analysis

            </button>

          </div>

        </section>



        {/* ========================================
            MEDICAL DISCLAIMER
        ======================================== */}

        <section className="medical-disclaimer">


          <div className="medical-disclaimer-icon">

            <Stethoscope size={23} />

          </div>


          <div>

            <h3>
              Important Medical Disclaimer
            </h3>


            <p>

              This application provides AI-assisted
              visual information for educational
              purposes only.

              The result is not a medical diagnosis
              and should not be used as a substitute
              for advice, examination, diagnosis, or
              treatment from a qualified healthcare
              professional.

            </p>


            <p>

              If you have concerning, persistent,
              painful, rapidly changing, or severe
              skin symptoms, consult an appropriate
              healthcare professional.

            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Result;