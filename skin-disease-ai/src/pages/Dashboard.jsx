import React, {
  useContext,
  useEffect,
  useState
} from "react";

import { useNavigate } from "react-router-dom";

import {
  Activity,
  BarChart3,
  Bell,
  CalendarDays,
  ChevronRight,
  Clock3,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  ScanLine,
  Settings,
  ShieldCheck,
  Sun,
  User,
  X,
  AlertCircle
} from "lucide-react";

import { ThemeContext } from "../context/ThemeContext";

import SkinChatbot from "../components/SkinChatbot";

import "../styles/dashboard.css";


function Dashboard() {

  const navigate = useNavigate();

  const {
    darkMode,
    toggleTheme
  } = useContext(ThemeContext);


  // ==========================================
  // STATE
  // ==========================================

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [user, setUser] = useState(null);

  const [analyses, setAnalyses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  const getLoggedInUser = () => {

    const userKeys = [
      "user",
      "skinai-user",
      "userData",
      "loggedInUser",
      "currentUser"
    ];

    for (const key of userKeys) {

      const storedUser =
        localStorage.getItem(key);

      if (storedUser) {

        try {

          const parsedUser =
            JSON.parse(storedUser);

          if (parsedUser?.id) {
            return parsedUser;
          }

        } catch (error) {

          console.error(
            `Invalid data in ${key}:`,
            error
          );

        }

      }

    }

    return null;
  };


  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  useEffect(() => {

    const loggedUser =
      getLoggedInUser();

    if (!loggedUser) {

      navigate("/login");

      return;
    }

    setUser(loggedUser);

    loadAnalyses(loggedUser.id);

  }, [navigate]);


  // ==========================================
  // LOAD ANALYSIS HISTORY
  // ==========================================

  const loadAnalyses = async (userId) => {

    try {

      setLoading(true);

      setError("");


      const response = await fetch(
        `http://localhost:8080/api/analysis/user/${userId}`
      );


      if (!response.ok) {

        throw new Error(
          "Failed to load analysis data"
        );

      }


      const data =
        await response.json();


      if (Array.isArray(data)) {

        setAnalyses(data);

      } else {

        setAnalyses([]);

      }


    } catch (error) {

      console.error(
        "Dashboard API error:",
        error
      );

      setError(
        "Unable to load your analysis information."
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // STATISTICS
  // ==========================================

  const totalAnalyses =
    analyses.length;


  const completedAnalyses =
    analyses.filter(
      (analysis) =>
        analysis.status?.toUpperCase() ===
        "COMPLETED"
    ).length;


  const pendingAnalyses =
    analyses.filter(
      (analysis) =>
        analysis.status?.toUpperCase() ===
        "PENDING"
    ).length;


  // ==========================================
  // CURRENT MONTH ANALYSES
  // ==========================================

  const currentMonth =
    new Date().getMonth();


  const currentYear =
    new Date().getFullYear();


  const thisMonthAnalyses =
    analyses.filter((analysis) => {

      if (!analysis.createdAt) {
        return false;
      }

      const date =
        new Date(analysis.createdAt);

      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );

    }).length;


  // ==========================================
  // RECENT ANALYSES
  // ==========================================

  const recentAnalyses =
    analyses.slice(0, 5);


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {

    if (!date) {
      return "Date unavailable";
    }

    try {

      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric"
        }
      );

    } catch {

      return "Date unavailable";

    }

  };


  // ==========================================
  // FORMAT CONFIDENCE
  // ==========================================

  const formatConfidence = (confidence) => {

    if (
      confidence === null ||
      confidence === undefined
    ) {

      return "--";

    }


    const value =
      Number(confidence);


    if (Number.isNaN(value)) {
      return "--";
    }


    if (value <= 1) {

      return `${(
        value * 100
      ).toFixed(1)}%`;

    }


    return `${value.toFixed(1)}%`;

  };


  // ==========================================
  // USER INITIAL
  // ==========================================

  const userInitial =
    user?.name
      ? user.name
          .charAt(0)
          .toUpperCase()
      : "U";


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    localStorage.removeItem("user");

    localStorage.removeItem(
      "skinai-user"
    );

    localStorage.removeItem(
      "userData"
    );

    localStorage.removeItem(
      "loggedInUser"
    );

    localStorage.removeItem(
      "currentUser"
    );


    navigate("/login");

  };


  // ==========================================
  // CLOSE MOBILE SIDEBAR
  // ==========================================

  const closeSidebar = () => {

    setSidebarOpen(false);

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="dashboard-loading">

        <div className="loading-spinner">
        </div>

        <p>
          Loading dashboard...
        </p>

      </div>

    );

  }


  // ==========================================
  // MAIN DASHBOARD
  // ==========================================

  return (

    <div className="dashboard-page">


      {/* ======================================
          MOBILE OVERLAY
      ====================================== */}

      {sidebarOpen && (

        <div
          className="dashboard-overlay"
          onClick={closeSidebar}
        />

      )}


      {/* ======================================
          SIDEBAR
      ====================================== */}

      <aside
        className={`dashboard-sidebar ${
          sidebarOpen
            ? "sidebar-open"
            : ""
        }`}
      >

        {/* SIDEBAR TOP */}

        <div className="sidebar-top">

          <div className="dashboard-brand">

            <div className="dashboard-brand-icon">

              <Activity size={22} />

            </div>

            <span>
              Skin<span>AI</span>
            </span>

          </div>


          <button
            className="mobile-close-btn"
            onClick={closeSidebar}
          >

            <X size={21} />

          </button>

        </div>


        {/* ==================================
            MAIN MENU
        ================================== */}

        <div className="sidebar-section">

          <p className="sidebar-title">
            MAIN MENU
          </p>


          <button
            className="sidebar-link active"
            onClick={closeSidebar}
          >

            <LayoutDashboard size={19} />

            Dashboard

          </button>


          <button
            className="sidebar-link"
            onClick={() => {
              closeSidebar();
              navigate("/analyze");
            }}
          >

            <ScanLine size={19} />

            Analyze Skin

          </button>


          <button
            className="sidebar-link"
            onClick={() => {
              closeSidebar();
              navigate("/history");
            }}
          >

            <History size={19} />

            Analysis History

          </button>

        </div>


        {/* ==================================
            ACCOUNT
        ================================== */}

        <div className="sidebar-section">

          <p className="sidebar-title">
            ACCOUNT
          </p>


          <button
            className="sidebar-link"
            onClick={() => {
              closeSidebar();
              navigate("/profile");
            }}
          >

            <User size={19} />

            My Profile

          </button>


          <button
            className="sidebar-link"
            onClick={() => {
              closeSidebar();
              navigate("/profile");
            }}
          >

            <Settings size={19} />

            Settings

          </button>

        </div>


        {/* ==================================
            SIDEBAR BOTTOM
        ================================== */}

        <div className="sidebar-bottom">


          <div className="sidebar-help-card">

            <ShieldCheck size={25} />

            <div>

              <strong>
                Stay Informed
              </strong>

              <p>
                AI results are for
                informational purposes.
              </p>

            </div>

          </div>


          <button
            className="sidebar-link logout-link"
            onClick={handleLogout}
          >

            <LogOut size={19} />

            Logout

          </button>

        </div>

      </aside>


      {/* ======================================
          MAIN
      ====================================== */}

      <main className="dashboard-main">


        {/* ====================================
            TOPBAR
        ==================================== */}

        <header className="dashboard-topbar">


          <button
            className="mobile-menu-btn"
            onClick={() =>
              setSidebarOpen(true)
            }
          >

            <Menu size={23} />

          </button>


          <div className="topbar-title">

            <h2>
              Dashboard
            </h2>

            <p>
              Monitor your skin analysis
              activity.
            </p>

          </div>


          <div className="topbar-actions">


            {/* NOTIFICATION */}

            <button
              className="dashboard-icon-btn"
              title="Notifications"
            >

              <Bell size={19} />

              {analyses.length > 0 && (

                <span className="notification-dot">
                </span>

              )}

            </button>


            {/* THEME */}

            <button
              className="dashboard-icon-btn"
              onClick={toggleTheme}
              title="Toggle theme"
            >

              {darkMode ? (

                <Sun size={19} />

              ) : (

                <Moon size={19} />

              )}

            </button>


            {/* USER */}

            <div
              className="dashboard-user"
              onClick={() =>
                navigate("/profile")
              }
              style={{
                cursor: "pointer"
              }}
            >

              <div className="user-avatar">

                {userInitial}

              </div>


              <div className="user-details">

                <strong>
                  {user?.name || "User"}
                </strong>

                <span>

                  {user?.role === "ADMIN"
                    ? "Administrator"
                    : "User"}

                </span>

              </div>

            </div>

          </div>

        </header>


        {/* ====================================
            CONTENT
        ==================================== */}

        <div className="dashboard-content">


          {/* ==================================
              WELCOME
          ================================== */}

          <section className="dashboard-welcome">

            <div>

              <span className="welcome-label">
                SKINAI DASHBOARD
              </span>


              <h1>

                Welcome back,{" "}

                {user?.name || "User"}

                {" "}👋

              </h1>


              <p>
                Ready to analyze your skin?
                Upload an image to get started.
              </p>

            </div>


            <button
              className="analyze-main-btn"
              onClick={() =>
                navigate("/analyze")
              }
            >

              <ScanLine size={20} />

              Analyze Skin

            </button>

          </section>


          {/* ==================================
              ERROR MESSAGE
          ================================== */}

          {error && (

            <div className="dashboard-error">

              <AlertCircle size={20} />

              <span>
                {error}
              </span>

              <button
                onClick={() =>
                  user &&
                  loadAnalyses(user.id)
                }
              >
                Retry
              </button>

            </div>

          )}


          {/* ==================================
              STATISTICS
          ================================== */}

          <section className="dashboard-stats">


            {/* TOTAL */}

            <div className="stat-card">

              <div className="stat-icon blue">

                <ScanLine size={21} />

              </div>

              <div>

                <span>
                  Total Analyses
                </span>

                <strong>
                  {totalAnalyses}
                </strong>

                <small>
                  All time
                </small>

              </div>

            </div>


            {/* COMPLETED */}

            <div className="stat-card">

              <div className="stat-icon green">

                <BarChart3 size={21} />

              </div>

              <div>

                <span>
                  Completed
                </span>

                <strong>
                  {completedAnalyses}
                </strong>

                <small>
                  Successful analyses
                </small>

              </div>

            </div>


            {/* THIS MONTH */}

            <div className="stat-card">

              <div className="stat-icon orange">

                <Clock3 size={21} />

              </div>

              <div>

                <span>
                  This Month
                </span>

                <strong>
                  {thisMonthAnalyses}
                </strong>

                <small>
                  Analyses this month
                </small>

              </div>

            </div>


            {/* REPORTS */}

            <div className="stat-card">

              <div className="stat-icon purple">

                <FileText size={21} />

              </div>

              <div>

                <span>
                  Reports
                </span>

                <strong>
                  {completedAnalyses}
                </strong>

                <small>
                  Available reports
                </small>

              </div>

            </div>

          </section>


          {/* ==================================
              MAIN GRID
          ================================== */}

          <section className="dashboard-grid">


            {/* =================================
                RECENT ANALYSIS
            ================================= */}

            <div className="dashboard-card recent-card">


              <div className="card-header">

                <div>

                  <h3>
                    Recent Analysis
                  </h3>

                  <p>
                    Your latest skin analysis
                    activity
                  </p>

                </div>


                <button
                  onClick={() =>
                    navigate("/history")
                  }
                  className="view-all-btn"
                >

                  View All

                  <ChevronRight size={16} />

                </button>

              </div>


              <div className="analysis-list">


                {recentAnalyses.length > 0 ? (

                  recentAnalyses.map(
                    (analysis) => (

                      <div
                        className="analysis-row"
                        key={analysis.id}
                      >


                        <div className="analysis-image-placeholder">

                          <ScanLine size={21} />

                        </div>


                        <div className="analysis-info">

                          <strong>

                            {analysis.conditionName ||
                              "Analysis Completed"}

                          </strong>


                          <span>

                            <CalendarDays
                              size={14}
                            />

                            {formatDate(
                              analysis.createdAt
                            )}

                          </span>

                        </div>


                        <div className="analysis-confidence">

                          <span>
                            Confidence
                          </span>

                          <strong>

                            {formatConfidence(
                              analysis.confidence
                            )}

                          </strong>

                        </div>


                        <span
                          className={`analysis-status ${
                            (
                              analysis.status ||
                              "COMPLETED"
                            ).toLowerCase()
                          }`}
                        >

                          {analysis.status ||
                            "COMPLETED"}

                        </span>


                      </div>

                    )

                  )

                ) : (

                  <div className="empty-analysis">

                    <ScanLine size={40} />

                    <h3>
                      No analyses yet
                    </h3>

                    <p>
                      Upload a skin image
                      to start your first
                      analysis.
                    </p>


                    <button
                      onClick={() =>
                        navigate("/analyze")
                      }
                      className="start-analysis-btn"
                    >

                      Start Analysis

                      <ChevronRight
                        size={17}
                      />

                    </button>

                  </div>

                )}

              </div>

            </div>


            {/* =================================
                QUICK ACTIONS
            ================================= */}

            <div className="dashboard-card quick-card">


              <div className="card-header">

                <div>

                  <h3>
                    Quick Actions
                  </h3>

                  <p>
                    Frequently used options
                  </p>

                </div>

              </div>


              <div className="quick-actions">


                {/* NEW ANALYSIS */}

                <button
                  onClick={() =>
                    navigate("/analyze")
                  }
                  className="quick-action"
                >

                  <div className="quick-icon blue">

                    <ScanLine size={21} />

                  </div>


                  <div>

                    <strong>
                      New Analysis
                    </strong>

                    <span>
                      Upload a skin image
                    </span>

                  </div>


                  <ChevronRight size={17} />

                </button>


                {/* HISTORY */}

                <button
                  onClick={() =>
                    navigate("/history")
                  }
                  className="quick-action"
                >

                  <div className="quick-icon green">

                    <History size={21} />

                  </div>


                  <div>

                    <strong>
                      View History
                    </strong>

                    <span>
                      See previous results
                    </span>

                  </div>


                  <ChevronRight size={17} />

                </button>


                {/* PROFILE */}

                <button
                  onClick={() =>
                    navigate("/profile")
                  }
                  className="quick-action"
                >

                  <div className="quick-icon purple">

                    <User size={21} />

                  </div>


                  <div>

                    <strong>
                      My Profile
                    </strong>

                    <span>
                      Manage your account
                    </span>

                  </div>


                  <ChevronRight size={17} />

                </button>

              </div>

            </div>

          </section>


          {/* ==================================
              INFORMATION
          ================================== */}

          <section className="dashboard-info">

            <div className="info-banner">

              <div className="info-banner-icon">

                <ShieldCheck size={25} />

              </div>


              <div>

                <h4>
                  Important Health Information
                </h4>

                <p>
                  SkinAI provides AI-assisted
                  visual information for
                  educational purposes. Results
                  should not be considered a
                  medical diagnosis. Please
                  consult a qualified healthcare
                  professional for diagnosis or
                  treatment.
                </p>

              </div>

            </div>

          </section>


        </div>

      </main>


      {/* ==========================================
          AI SKINCARE CHATBOT
      ========================================== */}

      <SkinChatbot />


    </div>

  );

}


export default Dashboard;