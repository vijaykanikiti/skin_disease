import React, { useState } from "react";
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
  Stethoscope,
  Phone,
  MapPin,
} from "lucide-react";

import "../styles/result.css";
import "../styles/specialist.css";
import { getUserLocation } from "../services/locationService";


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
  // USER LOCATION STATE
  // --------------------------------------------------

  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  // --------------------------------------------------
  // NEARBY DOCTOR STATE
  // --------------------------------------------------

  const [nearbyDoctors, setNearbyDoctors] = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [nearbyError, setNearbyError] = useState("");

  // --------------------------------------------------
  // REAL BACKEND DATA
  // --------------------------------------------------

  const conditionName =
    backendResult?.conditionName ||
    "Uncertain / Needs Professional Review";

  const confidence = Number(
    backendResult?.confidence || 0
  );

  const information =
    backendResult?.information ||
    "No additional information is available.";

  // --------------------------------------------------
  // DISEASE → SPECIALIST MAPPING
  // --------------------------------------------------

  const getSpecialistType = (condition) => {

    if (!condition) {
      return "Dermatologist";
    }

    const disease = condition
      .toLowerCase()
      .trim();

    // Acne
    if (
      disease.includes("acne") ||
      disease.includes("pimple")
    ) {
      return "Dermatologist";
    }

    // Eczema
    if (
      disease.includes("eczema") ||
      disease.includes("dermatitis")
    ) {
      return "Dermatologist";
    }

    // Psoriasis
    if (
      disease.includes("psoriasis")
    ) {
      return "Dermatologist";
    }

    // Fungal infection
    if (
      disease.includes("fungal") ||
      disease.includes("ringworm") ||
      disease.includes("tinea")
    ) {
      return "Dermatologist";
    }

    // Skin allergy
    if (
      disease.includes("allergy") ||
      disease.includes("allergic") ||
      disease.includes("urticaria") ||
      disease.includes("hives")
    ) {
      return "Dermatologist";
    }

    // Suspicious mole / lesion
    if (
      disease.includes("mole") ||
      disease.includes("lesion") ||
      disease.includes("melanoma")
    ) {
      return "Dermatologist";
    }

    // Vitiligo
    if (
      disease.includes("vitiligo")
    ) {
      return "Dermatologist";
    }

    // General fallback
    return "Dermatologist";
  };

  const recommendedSpecialist =
    getSpecialistType(conditionName);

  // --------------------------------------------------
  // GET USER LOCATION
  // --------------------------------------------------

  const handleFindNearbyDoctors = async () => {
    try {
      setLocationLoading(true);
      setNearbyLoading(true);
      setLocationError("");
      setNearbyError("");
      setNearbyDoctors([]);

      // 1. Get user's current browser location
      const locationData = await getUserLocation();

      setUserLocation(locationData);

      console.log("User Latitude:", locationData.latitude);
      console.log("User Longitude:", locationData.longitude);

      // 2. Send location + AI-selected specialist to Spring Boot
      const response = await fetch(
        "http://localhost:8080/api/doctors/nearby",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            specialistType: recommendedSpecialist,
          }),
        }
      );

      if (!response.ok) {
        let errorMessage = "Unable to find nearby specialists.";

        try {
          const errorText = await response.text();
          if (errorText) {
            console.error("Nearby Doctor API Response:", errorText);
          }
        } catch (readError) {
          console.error("Could not read API error:", readError);
        }

        throw new Error(errorMessage);
      }

      // 3. Read nearby places returned by Spring Boot
      const data = await response.json();

      console.log("Nearby doctors:", data);

      setNearbyDoctors(
        Array.isArray(data) ? data : []
      );

    } catch (error) {
      console.error("Nearby Doctor Error:", error);

      // Location-specific messages
      if (error?.code === 1) {
        setLocationError(
          "Location permission was denied. Please allow location access in your browser."
        );
      } else if (error?.code === 2) {
        setLocationError(
          "Your location could not be determined."
        );
      } else if (error?.code === 3) {
        setLocationError(
          "Location request timed out. Please try again."
        );
      } else {
        setNearbyError(
          error?.message ||
          "Unable to find nearby specialists. Please try again."
        );
      }

      if (!userLocation) {
        setUserLocation(null);
      }

    } finally {
      setLocationLoading(false);
      setNearbyLoading(false);
    }
  };

  // --------------------------------------------------
  // DISTANCE CALCULATION
  // --------------------------------------------------

  const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
  ) => {
    if (
      lat1 == null ||
      lon1 == null ||
      lat2 == null ||
      lon2 == null
    ) {
      return null;
    }

    const toRadians = (value) =>
      (value * Math.PI) / 180;

    const earthRadiusKm = 6371;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const distance =
      2 *
      earthRadiusKm *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return distance;
  };

  const formatDistance = (doctor) => {
    if (!userLocation) {
      return null;
    }

    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      doctor.latitude,
      doctor.longitude
    );

    if (distance == null) {
      return null;
    }

    if (distance < 1) {
      return `${Math.round(distance * 1000)} m away`;
    }

    return `${distance.toFixed(1)} km away`;
  };
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
      .filter(
        (item) => item.length > 0
      );
  };

  // --------------------------------------------------
  // SYMPTOMS
  // --------------------------------------------------

  const symptoms =
    convertToList(
      backendResult.symptoms
    );

  // --------------------------------------------------
  // WARNING SIGNS
  // --------------------------------------------------

  const warningSigns =
    convertToList(
      backendResult.warningSigns
    );

  // --------------------------------------------------
  // PREVENTION
  // --------------------------------------------------

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

  const safeConfidence =
    Math.min(
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


        {/* =================================================
            SPECIALIST RECOMMENDATION
        ================================================= */}

        <section className="specialist-recommendation-section">

          {/* HEADER */}

          <div className="specialist-section-header">

            <div className="specialist-header-icon">
              <Stethoscope size={24} />
            </div>

            <div>

              <h2>
                Recommended Specialist
              </h2>

              <p>
                Based on the AI-assisted screening result,
                you may consider consulting a qualified
                healthcare professional.
              </p>

            </div>

          </div>


          {/* SPECIALIST TYPE */}

          <div className="recommended-specialist-type">

            <div className="specialist-type-icon">
              <Stethoscope size={20} />
            </div>

            <div>

              <span>
                Suggested Specialist
              </span>

              <strong>
                {recommendedSpecialist}
              </strong>

            </div>

          </div>

          {/* USER LOCATION / NEARBY DOCTORS */}

          <div className="nearby-doctors-location-box">

            <div className="nearby-doctors-location-content">

              <div className="nearby-doctors-location-icon">
                <MapPin size={20} />
              </div>

              <div>
                <h3>Find Specialists Near You</h3>

                <p>
                  Find nearby specialists based on your current location
                  and the AI-recommended specialist type.
                </p>
              </div>

            </div>

            <button
              type="button"
              className="specialist-location-btn"
              onClick={handleFindNearbyDoctors}
              disabled={locationLoading || nearbyLoading}
            >
              <MapPin size={17} />

              {locationLoading
                ? "Getting Location..."
                : nearbyLoading
                  ? "Finding Specialists..."
                  : userLocation
                    ? "Search Again"
                    : "Find Nearby Doctors"}
            </button>

          </div>

          {locationError && (
            <div className="specialist-error">
              <AlertTriangle size={18} />
              <span>{locationError}</span>
            </div>
          )}

          {nearbyError && (
            <div className="specialist-error">
              <AlertTriangle size={18} />
              <span>{nearbyError}</span>
            </div>
          )}

          {userLocation && !locationError && (
            <div className="location-success-message">
              <CheckCircle size={17} />
              <span>
                Your location was detected successfully. Searching within
                the nearby area for {recommendedSpecialist.toLowerCase()}s.
              </span>
            </div>
          )}

          {/* NEARBY GOOGLE PLACES RESULTS */}

          {nearbyLoading && (
            <div className="specialist-loading">

              <div className="specialist-loader"></div>

              <span>
                Finding nearby {recommendedSpecialist.toLowerCase()}s...
              </span>

            </div>
          )}

          {!nearbyLoading &&
            !nearbyError &&
            nearbyDoctors.length > 0 && (

              <div className="nearby-doctors-results">

                <div className="nearby-doctors-results-header">
                  <div>
                    <h3>Nearby Specialists</h3>

                    <p>
                      Real nearby places returned from the location search.
                    </p>
                  </div>

                  <span className="nearby-count">
                    {nearbyDoctors.length} found
                  </span>
                </div>

                <div className="nearby-doctor-grid">

                  {nearbyDoctors.map((doctor, index) => {

                    const distance =
                      formatDistance(doctor);

                    return (
                      <div
                        className="nearby-doctor-card"
                        key={
                          doctor.id ||
                          `${doctor.name}-${index}`
                        }
                      >

                        <div className="nearby-doctor-header">

                          <div className="nearby-doctor-icon">
                            <Stethoscope size={23} />
                          </div>

                          <div>

                            <h4>
                              {doctor.name ||
                                "Doctor / Clinic"}
                            </h4>

                            <span>
                              {recommendedSpecialist}
                            </span>

                          </div>

                        </div>

                        <div className="nearby-doctor-detail">

                          <MapPin size={17} />

                          <div>
                            <small>Address</small>

                            <strong>
                              {doctor.address ||
                                "Address unavailable"}
                            </strong>
                          </div>

                        </div>

                        {distance && (
                          <div className="nearby-doctor-distance">

                            <MapPin size={16} />

                            <span>
                              {distance}
                            </span>

                          </div>
                        )}

                        {doctor.rating != null && (
                          <div className="nearby-doctor-rating">
                            ⭐ {doctor.rating}
                          </div>
                        )}

                        {doctor.phone && (
                          <div className="nearby-doctor-phone">
                            <strong>Phone:</strong>{" "}
                            {doctor.phone}
                          </div>
                        )}

                        <div className="nearby-doctor-actions">

                          {doctor.phone && (
                            <a
                              href={`tel:${doctor.phone}`}
                              className="nearby-call-btn"
                            >
                              <Phone size={16} />
                              Call
                            </a>
                          )}

                          {doctor.mapsUrl && (
                            <a
                              href={doctor.mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="nearby-directions-btn"
                            >
                              <MapPin size={16} />
                              Directions
                            </a>
                          )}

                        </div>

                      </div>
                    );
                  })}

                </div>

              </div>
            )}

          {!nearbyLoading &&
            !nearbyError &&
            userLocation &&
            nearbyDoctors.length === 0 && (

              <div className="nearby-empty">

                <Stethoscope size={30} />

                <h3>
                  No nearby specialists found
                </h3>

                <p>
                  No suitable places were returned near your current
                  location. Try the search again or consult a qualified
                  healthcare professional.
                </p>

              </div>
            )}

          {/* MEDICAL NOTE */}

          <div className="specialist-medical-note">

            <Info size={17} />

            <span>
              The specialist recommendation is based on
              the category of the AI-assisted screening
              result. It is not a medical diagnosis.
            </span>

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