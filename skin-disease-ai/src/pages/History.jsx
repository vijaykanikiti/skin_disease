import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  Eye,
  History as HistoryIcon,
  Loader2,
  Search,
  Trash2,
  X
} from "lucide-react";

import "../styles/history.css";

function History() {

  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedAnalysis, setSelectedAnalysis] =
    useState(null);

  // --------------------------------------------------
  // GET LOGGED-IN USER
  // --------------------------------------------------

  const getLoggedInUser = () => {

    const possibleKeys = [
      "user",
      "userData",
      "loggedInUser",
      "currentUser"
    ];

    for (const key of possibleKeys) {

      const data = localStorage.getItem(key);

      if (!data) {
        continue;
      }

      try {

        const parsed = JSON.parse(data);

        if (parsed?.id) {
          return parsed;
        }

        if (parsed?.user?.id) {
          return parsed.user;
        }

      } catch (error) {

        console.log(
          "Invalid localStorage data:",
          key
        );

      }
    }

    return null;
  };


  // --------------------------------------------------
  // LOAD HISTORY
  // --------------------------------------------------

  const loadHistory = async () => {

    setLoading(true);
    setError("");

    const user = getLoggedInUser();

    console.log("History user:", user);

    if (!user || !user.id) {

      setError(
        "User information is missing. Please login again."
      );

      setLoading(false);

      return;
    }


    try {

      const response = await fetch(
        `http://localhost:8080/api/analysis/user/${user.id}`
      );


      const responseText =
        await response.text();


      console.log(
        "History backend response:",
        responseText
      );


      if (!response.ok) {

        throw new Error(
          responseText ||
          "Unable to load analysis history."
        );

      }


      let data;

      try {

        data = JSON.parse(responseText);

      } catch {

        throw new Error(
          "Backend returned invalid history data."
        );

      }


      console.log(
        "Analysis history:",
        data
      );


      setHistory(
        Array.isArray(data) ? data : []
      );

      setFilteredHistory(
        Array.isArray(data) ? data : []
      );


    } catch (error) {

      console.error(
        "History error:",
        error
      );

      setError(
        error.message ||
        "Unable to load analysis history."
      );

    } finally {

      setLoading(false);

    }

  };


  // --------------------------------------------------
  // LOAD ON PAGE OPEN
  // --------------------------------------------------

  useEffect(() => {

    loadHistory();

  }, []);


  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  useEffect(() => {

    const search = searchTerm
      .toLowerCase()
      .trim();


    if (!search) {

      setFilteredHistory(history);

      return;

    }


    const filtered = history.filter(
      (item) =>
        item.conditionName
          ?.toLowerCase()
          .includes(search) ||

        item.imageName
          ?.toLowerCase()
          .includes(search)
    );


    setFilteredHistory(filtered);

  }, [searchTerm, history]);


  // --------------------------------------------------
  // DELETE ANALYSIS
  // --------------------------------------------------

  const deleteAnalysis = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this analysis?"
      );


    if (!confirmDelete) {
      return;
    }


    try {

      const response = await fetch(
        `http://localhost:8080/api/analysis/${id}`,
        {
          method: "DELETE"
        }
      );


      const responseText =
        await response.text();


      if (!response.ok) {

        throw new Error(
          responseText ||
          "Unable to delete analysis."
        );

      }


      // Remove from UI immediately

      const updatedHistory =
        history.filter(
          (item) => item.id !== id
        );


      setHistory(updatedHistory);

      setFilteredHistory(
        updatedHistory
      );


      // Close modal if open

      if (
        selectedAnalysis?.id === id
      ) {

        setSelectedAnalysis(null);

      }


    } catch (error) {

      console.error(
        "Delete error:",
        error
      );

      alert(
        error.message ||
        "Unable to delete analysis."
      );

    }

  };


  // --------------------------------------------------
  // FORMAT DATE
  // --------------------------------------------------

  const formatDate = (dateValue) => {

    if (!dateValue) {
      return "Unknown date";
    }


    try {

      return new Date(
        dateValue
      ).toLocaleString();

    } catch {

      return dateValue;

    }

  };


  // --------------------------------------------------
  // CONFIDENCE
  // --------------------------------------------------

  const formatConfidence = (
    confidence
  ) => {

    const value =
      Number(confidence || 0);

    return `${value.toFixed(2)}%`;

  };


  // --------------------------------------------------
  // EMPTY / LOADING
  // --------------------------------------------------

  if (loading) {

    return (

      <div className="history-page">

        <div className="history-loading">

          <Loader2
            size={35}
            className="history-spinner"
          />

          <h2>
            Loading Analysis History...
          </h2>

          <p>
            Please wait while we load your
            previous analyses.
          </p>

        </div>

      </div>

    );

  }


  return (

    <div className="history-page">


      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="history-header">

        <div className="history-header-left">

          <button
            className="history-back-btn"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <ArrowLeft size={18} />
          </button>


          <div>

            <div className="history-title">

              <HistoryIcon size={22} />

              <h1>
                Analysis History
              </h1>

            </div>


            <p>
              View your previous skin-image analyses
            </p>

          </div>

        </div>


        <button
          className="history-new-btn"
          onClick={() =>
            navigate("/analyze")
          }
        >
          <Activity size={17} />
          New Analysis
        </button>

      </header>


      {/* ==================================================
          CONTENT
      ================================================== */}

      <main className="history-content">


        {/* ERROR */}

        {error && (

          <div className="history-error">

            <AlertTriangle size={19} />

            <span>
              {error}
            </span>

          </div>

        )}


        {/* ==================================================
            SEARCH
        ================================================== */}

        <div className="history-toolbar">

          <div className="history-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search by condition or file name..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />

          </div>


          <div className="history-count">

            {filteredHistory.length}

            {" "}

            {filteredHistory.length === 1
              ? "Analysis"
              : "Analyses"}

          </div>

        </div>


        {/* ==================================================
            EMPTY
        ================================================== */}

        {filteredHistory.length === 0 ? (

          <div className="history-empty">

            <div className="history-empty-icon">

              <HistoryIcon size={35} />

            </div>


            <h2>
              No Analysis Found
            </h2>


            <p>

              {searchTerm
                ? "No analysis matches your search."
                : "You haven't completed any skin analyses yet."}

            </p>


            {!searchTerm && (

              <button
                className="history-new-btn"
                onClick={() =>
                  navigate("/analyze")
                }
              >

                <Activity size={17} />

                Start Your First Analysis

              </button>

            )}

          </div>

        ) : (


          /* ==================================================
             HISTORY CARDS
          ================================================== */

          <div className="history-list">

            {filteredHistory.map(
              (item) => (

                <div
                  className="history-card"
                  key={item.id}
                >


                  {/* LEFT */}

                  <div className="history-card-main">

                    <div className="history-card-icon">

                      <CheckCircle size={23} />

                    </div>


                    <div className="history-card-info">

                      <span className="history-status">

                        {item.status ||
                          "COMPLETED"}

                      </span>


                      <h3>

                        {item.conditionName ||
                          "Unknown Result"}

                      </h3>


                      <div className="history-meta">

                        <span>

                          <CalendarDays
                            size={14}
                          />

                          {formatDate(
                            item.createdAt
                          )}

                        </span>


                        {item.imageName && (

                          <span>

                            {item.imageName}

                          </span>

                        )}

                      </div>

                    </div>

                  </div>


                  {/* CONFIDENCE */}

                  <div className="history-confidence">

                    <span>
                      Confidence
                    </span>

                    <strong>
                      {formatConfidence(
                        item.confidence
                      )}
                    </strong>

                  </div>


                  {/* ACTIONS */}

                  <div className="history-card-actions">

                    <button
                      className="history-view-btn"
                      onClick={() =>
                        setSelectedAnalysis(
                          item
                        )
                      }
                    >

                      <Eye size={17} />

                      View

                    </button>


                    <button
                      className="history-delete-btn"
                      onClick={() =>
                        deleteAnalysis(
                          item.id
                        )
                      }
                    >

                      <Trash2 size={17} />

                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </main>


      {/* ==================================================
          DETAILS MODAL
      ================================================== */}

      {selectedAnalysis && (

        <div
          className="history-modal-overlay"
          onClick={() =>
            setSelectedAnalysis(null)
          }
        >

          <div
            className="history-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >


            <div className="history-modal-header">

              <div>

                <h2>
                  Analysis Details
                </h2>

                <span>
                  {formatDate(
                    selectedAnalysis.createdAt
                  )}
                </span>

              </div>


              <button
                className="history-modal-close"
                onClick={() =>
                  setSelectedAnalysis(null)
                }
              >

                <X size={20} />

              </button>

            </div>


            <div className="history-modal-body">


              <div className="modal-result-icon">

                <CheckCircle size={28} />

              </div>


              <span className="prediction-label">
                AI-ASSISTED RESULT
              </span>


              <h3>

                {selectedAnalysis.conditionName ||
                  "Unknown Result"}

              </h3>


              <div className="modal-confidence">

                <span>
                  AI Confidence
                </span>

                <strong>
                  {formatConfidence(
                    selectedAnalysis.confidence
                  )}
                </strong>

              </div>


              <div className="modal-section">

                <h4>
                  General Information
                </h4>

                <p>
                  {selectedAnalysis.information ||
                    "No information available."}
                </p>

              </div>


              <div className="modal-section">

                <h4>
                  Symptoms
                </h4>

                <p>
                  {selectedAnalysis.symptoms ||
                    "No symptom information available."}
                </p>

              </div>


              <div className="modal-section">

                <h4>
                  Warning Signs
                </h4>

                <p>
                  {selectedAnalysis.warningSigns ||
                    "No warning information available."}
                </p>

              </div>


              <div className="modal-section">

                <h4>
                  Preventive Care
                </h4>

                <p>
                  {selectedAnalysis.prevention ||
                    "No prevention information available."}
                </p>

              </div>


            </div>


            <div className="history-modal-footer">

              <button
                className="history-delete-modal-btn"
                onClick={() =>
                  deleteAnalysis(
                    selectedAnalysis.id
                  )
                }
              >

                <Trash2 size={17} />

                Delete Analysis

              </button>


              <button
                className="history-secondary-btn"
                onClick={() =>
                  setSelectedAnalysis(null)
                }
              >

                Close

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}

export default History;