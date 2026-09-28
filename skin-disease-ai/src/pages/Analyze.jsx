import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  Upload,
  Image as ImageIcon,
  X,
  ShieldCheck,
  Info,
  CheckCircle,
  AlertTriangle,
  Activity,
  Loader2,
  RotateCcw
} from "lucide-react";

import "../styles/analyze.css";


function Analyze() {

  const navigate =
    useNavigate();


  // ==========================================
  // STATE
  // ==========================================

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [preview, setPreview] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  const getLoggedInUser = () => {

    const possibleKeys = [

      "user",

      "skinai-user",

      "userData",

      "loggedInUser",

      "currentUser"

    ];


    for (const key of possibleKeys) {

      const storedData =
        localStorage.getItem(key);


      if (!storedData) {
        continue;
      }


      try {

        const parsed =
          JSON.parse(storedData);


        /*
         * Normal user object
         *
         * {
         *   id: 3,
         *   name: "Vijay",
         *   email: "..."
         * }
         */

        if (
          parsed &&
          parsed.id
        ) {

          console.log(
            `User found from "${key}":`,
            parsed
          );

          return parsed;

        }


        /*
         * Nested user object
         *
         * {
         *   user: {
         *      id: 3
         *   }
         * }
         */

        if (
          parsed?.user?.id
        ) {

          console.log(
            `Nested user found from "${key}":`,
            parsed.user
          );

          return parsed.user;

        }


      } catch (error) {

        console.error(
          `Invalid localStorage data in "${key}":`,
          error
        );

      }

    }


    console.warn(
      "No logged-in user found in localStorage."
    );


    return null;

  };


  // ==========================================
  // HANDLE IMAGE
  // ==========================================

  const handleFileChange =
    (file) => {

      setError("");


      if (!file) {
        return;
      }


      // Allowed image types

      const allowedTypes = [

        "image/jpeg",

        "image/jpg",

        "image/png",

        "image/webp"

      ];


      if (
        !allowedTypes.includes(
          file.type
        )
      ) {

        setError(
          "Please select a JPG, JPEG, PNG or WEBP image."
        );

        return;

      }


      // Maximum 10 MB

      if (
        file.size >
        10 * 1024 * 1024
      ) {

        setError(
          "Image size must be less than 10MB."
        );

        return;

      }


      setSelectedFile(file);


      const imageUrl =
        URL.createObjectURL(file);


      setPreview(imageUrl);

    };


  // ==========================================
  // FILE INPUT
  // ==========================================

  const handleInputChange =
    (event) => {

      const file =
        event.target.files?.[0];


      handleFileChange(file);

    };


  // ==========================================
  // REMOVE IMAGE
  // ==========================================

  const removeImage = () => {

    if (preview) {

      URL.revokeObjectURL(
        preview
      );

    }


    setSelectedFile(null);

    setPreview(null);

    setError("");

  };


  // ==========================================
  // ANALYZE IMAGE
  // ==========================================

  const handleAnalyze =
    async () => {

      setError("");


      // ======================================
      // CHECK IMAGE
      // ======================================

      if (!selectedFile) {

        setError(
          "Please select a skin image first."
        );

        return;

      }


      // ======================================
      // GET USER
      // ======================================

      const user =
        getLoggedInUser();


      console.log(
        "Logged-in user:",
        user
      );


      // ======================================
      // CHECK USER
      // ======================================

      if (
        !user ||
        !user.id
      ) {

        setError(
          "User information is missing. Please login again."
        );

        return;

      }


      // ======================================
      // START LOADING
      // ======================================

      setLoading(true);


      try {


        // ====================================
        // FORM DATA
        // ====================================

        const formData =
          new FormData();


        formData.append(
          "userId",
          String(user.id)
        );


        formData.append(
          "image",
          selectedFile
        );


        console.log(
          "================================"
        );


        console.log(
          "Sending analysis request"
        );


        console.log(
          "User ID:",
          user.id
        );


        console.log(
          "User Name:",
          user.name
        );


        console.log(
          "Image:",
          selectedFile.name
        );


        console.log(
          "Image Size:",
          selectedFile.size
        );


        console.log(
          "================================"
        );


        // ====================================
        // BACKEND REQUEST
        // ====================================

        const response =
          await fetch(
            "http://localhost:8080/api/analysis/analyze",
            {
              method: "POST",
              body: formData
            }
          );


        // ====================================
        // RESPONSE
        // ====================================

        const responseText =
          await response.text();


        console.log(
          "Backend status:",
          response.status
        );


        console.log(
          "Backend response:",
          responseText
        );


        // ====================================
        // ERROR
        // ====================================

        if (!response.ok) {

          let errorMessage =
            responseText ||
            "Analysis failed.";


          try {

            const errorData =
              JSON.parse(
                responseText
              );


            if (
              typeof errorData ===
              "string"
            ) {

              errorMessage =
                errorData;

            } else if (
              errorData.message
            ) {

              errorMessage =
                errorData.message;

            }

          } catch {
            // Keep responseText
          }


          throw new Error(
            errorMessage
          );

        }


        // ====================================
        // PARSE RESULT
        // ====================================

        let result;


        try {

          result =
            JSON.parse(
              responseText
            );

        } catch {

          throw new Error(
            "Backend returned an invalid response."
          );

        }


        console.log(
          "Analysis result:",
          result
        );


        // ====================================
        // NAVIGATE RESULT
        // ====================================

        navigate(
          "/result",
          {
            state: {

              image:
                preview,

              fileName:
                selectedFile.name,

              result:
                result

            }
          }
        );


      } catch (error) {

        console.error(
          "Analysis error:",
          error
        );


        setError(
          error.message ||
          "Unable to analyze image. Please try again."
        );


      } finally {

        setLoading(false);

      }

    };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="analyze-page">


      {/* ======================================
          HEADER
      ====================================== */}

      <div className="analyze-header">

        <div>

          <div className="analyze-title">

            <Activity size={24} />

            <h1>
              Analyze Skin
            </h1>

          </div>


          <p>

            Upload a clear image of the skin
            area for AI-assisted analysis.

          </p>

        </div>

      </div>


      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <div className="analyze-content">


        {/* ====================================
            UPLOAD CARD
        ==================================== */}

        <div className="analyze-upload-card">


          <div className="upload-card-header">

            <div>

              <div className="upload-title">

                <ImageIcon size={20} />

                <h2>
                  Upload Skin Image
                </h2>

              </div>


              <p>
                Choose a clear image of the skin area.
              </p>

            </div>

          </div>


          {/* ==================================
              IMAGE AREA
          ================================== */}

          {!preview ? (

            <label className="upload-dropzone">


              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={
                  handleInputChange
                }
                hidden
              />


              <div className="upload-icon">

                <Upload size={32} />

              </div>


              <h3>
                Click to upload image
              </h3>


              <p>
                JPG, JPEG, PNG or WEBP
              </p>


              <span>
                Maximum size: 10MB
              </span>


            </label>

          ) : (

            <div className="preview-container">


              <img
                src={preview}
                alt="Selected skin"
                className="skin-preview"
              />


              <button
                type="button"
                className="remove-image-btn"
                onClick={
                  removeImage
                }
                disabled={loading}
              >

                <X size={18} />

              </button>


            </div>

          )}


          {/* ==================================
              FILE INFORMATION
          ================================== */}

          {selectedFile && (

            <div className="selected-file">


              <ImageIcon size={18} />


              <div>

                <strong>
                  {selectedFile.name}
                </strong>


                <small>

                  {(
                    selectedFile.size /
                    1024 /
                    1024
                  ).toFixed(2)}{" "}
                  MB

                </small>

              </div>


            </div>

          )}


          {/* ==================================
              ERROR
          ================================== */}

          {error && (

            <div className="analyze-error">

              <AlertTriangle size={18} />

              <span>
                {error}
              </span>

            </div>

          )}


          {/* ==================================
              BUTTONS
          ================================== */}

          <div className="analyze-actions">


            <button
              type="button"
              className="clear-btn"
              onClick={
                removeImage
              }
              disabled={loading}
            >

              <RotateCcw size={17} />

              Clear

            </button>


            <button
              type="button"
              className="analyze-btn"
              onClick={
                handleAnalyze
              }
              disabled={
                !selectedFile ||
                loading
              }
            >

              {loading ? (

                <>

                  <Loader2
                    size={18}
                    className="spin"
                  />

                  Analyzing...

                </>

              ) : (

                <>

                  <Activity
                    size={18}
                  />

                  Analyze Image

                </>

              )}

            </button>


          </div>


        </div>


        {/* ====================================
            INFORMATION SIDE
        ==================================== */}

        <div className="analyze-info">


          {/* QUALITY */}

          <div className="info-card">


            <div className="info-card-header">

              <ShieldCheck
                size={20}
              />

              <h3>
                Get Better Results
              </h3>

            </div>


            <ul>


              <li>

                <CheckCircle
                  size={16}
                />

                Use a clear and focused image

              </li>


              <li>

                <CheckCircle
                  size={16}
                />

                Use good lighting

              </li>


              <li>

                <CheckCircle
                  size={16}
                />

                Keep the affected area visible

              </li>


              <li>

                <CheckCircle
                  size={16}
                />

                Avoid heavily blurred images

              </li>


            </ul>


          </div>


          {/* IMPORTANT */}

          <div
            className={
              "info-card important-card"
            }
          >


            <div className="info-card-header">

              <Info size={20} />

              <h3>
                Important
              </h3>

            </div>


            <p>

              AI-assisted results are for
              educational information only and
              should not replace professional
              medical advice.

            </p>


          </div>


          {/* SUPPORTED */}

          <div className="info-card">


            <div className="info-card-header">

              <ImageIcon size={20} />

              <h3>
                Supported Images
              </h3>

            </div>


            <p>
              JPG, JPEG, PNG and WEBP
            </p>


            <small>
              Maximum size: 10MB
            </small>


          </div>


        </div>


      </div>


    </div>

  );

}


export default Analyze;