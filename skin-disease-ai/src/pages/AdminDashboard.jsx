import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  Activity,
  Database,
  Settings,
  LogOut,
  Sun,
  Moon,
  Search,
  MoreVertical,
  CheckCircle,
  Clock,
  TrendingUp,
  ShieldCheck,
  Stethoscope,
  Trash2,
  RefreshCw,
  AlertCircle
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";

import "../styles/admin.css";


function AdminDashboard() {

  const navigate = useNavigate();

  const { darkMode, toggleTheme } = useTheme();


  // ==========================================
  // STATE
  // ==========================================

  const [activeTab, setActiveTab] =
    useState("overview");

  const [search, setSearch] =
    useState("");

  const [users, setUsers] =
    useState([]);

  const [predictions, setPredictions] =
    useState([]);

  const [stats, setStats] =
    useState({
      totalUsers: 0,
      totalAnalyses: 0,
      completedAnalyses: 0
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================
  // ADMIN CHECK
  // ==========================================

  const getLoggedInUser = () => {

    const keys = [
      "user",
      "skinai-user",
      "userData",
      "loggedInUser",
      "currentUser"
    ];

    for (const key of keys) {

      const stored =
        localStorage.getItem(key);

      if (stored) {

        try {

          const parsed =
            JSON.parse(stored);

          if (parsed?.id) {
            return parsed;
          }

        } catch (error) {

          console.error(
            "Invalid user data:",
            error
          );

        }

      }

    }

    return null;
  };


  // ==========================================
  // LOAD ADMIN DATA
  // ==========================================

  useEffect(() => {

    const loggedUser =
      getLoggedInUser();


    if (!loggedUser) {

      navigate("/login");

      return;

    }


    /*
     * For your local project we check
     * the role stored with the user.
     */

    if (
      loggedUser.role &&
      loggedUser.role.toUpperCase() !== "ADMIN"
    ) {

      alert(
        "Admin access required."
      );

      navigate("/dashboard");

      return;

    }


    loadAdminData();

  }, [navigate]);


  // ==========================================
  // LOAD ALL ADMIN DATA
  // ==========================================

  const loadAdminData = async () => {

    try {

      setLoading(true);

      setError("");


      // Statistics

      const statsResponse =
        await fetch(
          "http://localhost:8080/api/admin/stats"
        );


      if (!statsResponse.ok) {

        throw new Error(
          "Unable to load admin statistics"
        );

      }


      const statsData =
        await statsResponse.json();


      setStats(statsData);


      // Users

      const usersResponse =
        await fetch(
          "http://localhost:8080/api/admin/users"
        );


      if (!usersResponse.ok) {

        throw new Error(
          "Unable to load users"
        );

      }


      const usersData =
        await usersResponse.json();


      setUsers(
        Array.isArray(usersData)
          ? usersData
          : []
      );


      // Analyses

      const analysesResponse =
        await fetch(
          "http://localhost:8080/api/admin/analyses"
        );


      if (!analysesResponse.ok) {

        throw new Error(
          "Unable to load analyses"
        );

      }


      const analysesData =
        await analysesResponse.json();


      setPredictions(
        Array.isArray(analysesData)
          ? analysesData
          : []
      );


    } catch (error) {

      console.error(
        "Admin dashboard error:",
        error
      );

      setError(
        error.message ||
        "Failed to load admin data."
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // DELETE USER
  // ==========================================

  const handleDeleteUser = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this user?"
      );


    if (!confirmed) {
      return;
    }


    try {

      const response =
        await fetch(
          `http://localhost:8080/api/admin/users/${id}`,
          {
            method: "DELETE"
          }
        );


      if (!response.ok) {

        throw new Error(
          "Failed to delete user"
        );

      }


      alert(
        "User deleted successfully."
      );


      loadAdminData();

    } catch (error) {

      console.error(error);

      alert(
        "Unable to delete user."
      );

    }

  };


  // ==========================================
  // DELETE ANALYSIS
  // ==========================================

  const handleDeleteAnalysis =
    async (id) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this analysis?"
        );


      if (!confirmed) {
        return;
      }


      try {

        const response =
          await fetch(
            `http://localhost:8080/api/admin/analyses/${id}`,
            {
              method: "DELETE"
            }
          );


        if (!response.ok) {

          throw new Error(
            "Failed to delete analysis"
          );

        }


        alert(
          "Analysis deleted successfully."
        );


        loadAdminData();

      } catch (error) {

        console.error(error);

        alert(
          "Unable to delete analysis."
        );

      }

    };


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


    navigate("/");

  };


  // ==========================================
  // FILTER USERS
  // ==========================================

  const filteredUsers =
    users.filter((user) => {

      const searchText =
        search.toLowerCase();

      return (
        user.name
          ?.toLowerCase()
          .includes(searchText) ||

        user.email
          ?.toLowerCase()
          .includes(searchText)
      );

    });


  // ==========================================
  // FORMAT CONFIDENCE
  // ==========================================

  const formatConfidence =
    (confidence) => {

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
  // FORMAT DATE
  // ==========================================

  const formatDate =
    (date) => {

      if (!date) {
        return "--";
      }


      try {

        return new Date(
          date
        ).toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric"
          }
        );

      } catch {

        return "--";

      }

    };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="admin-loading">

        <RefreshCw
          size={35}
          className="loading-icon"
        />

        <p>
          Loading admin dashboard...
        </p>

      </div>

    );

  }


  // ==========================================
  // MAIN
  // ==========================================

  return (

    <div className="admin-layout">


      {/* ======================================
          SIDEBAR
      ====================================== */}

      <aside className="admin-sidebar">


        {/* LOGO */}

        <div className="admin-logo">

          <div className="admin-logo-icon">

            <ShieldCheck size={24} />

          </div>


          <div>

            <h2>
              SkinAI
            </h2>

            <span>
              Admin Panel
            </span>

          </div>

        </div>


        {/* NAVIGATION */}

        <nav className="admin-nav">


          <button
            className={
              activeTab === "overview"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("overview")
            }
          >

            <LayoutDashboard size={19} />

            Overview

          </button>


          <button
            className={
              activeTab === "users"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("users")
            }
          >

            <Users size={19} />

            Users

          </button>


          <button
            className={
              activeTab === "predictions"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("predictions")
            }
          >

            <Activity size={19} />

            Predictions

          </button>


          <button
            className={
              activeTab === "categories"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("categories")
            }
          >

            <Stethoscope size={19} />

            Disease Categories

          </button>


          <button
            className={
              activeTab === "dataset"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("dataset")
            }
          >

            <Database size={19} />

            Dataset

          </button>


          <button
            className={
              activeTab === "settings"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("settings")
            }
          >

            <Settings size={19} />

            Settings

          </button>

        </nav>


        {/* SIDEBAR BOTTOM */}

        <div className="admin-sidebar-bottom">


          <button
            onClick={toggleTheme}
          >

            {darkMode
              ? <Sun size={19} />
              : <Moon size={19} />
            }

            {darkMode
              ? "Light Mode"
              : "Dark Mode"
            }

          </button>


          <button
            onClick={handleLogout}
            className="admin-logout"
          >

            <LogOut size={19} />

            Logout

          </button>

        </div>

      </aside>


      {/* ======================================
          MAIN
      ====================================== */}

      <main className="admin-main">


        {/* HEADER */}

        <header className="admin-header">

          <div>

            <h1>

              {activeTab === "overview" &&
                "Admin Overview"}

              {activeTab === "users" &&
                "User Management"}

              {activeTab === "predictions" &&
                "Prediction Management"}

              {activeTab === "categories" &&
                "Disease Categories"}

              {activeTab === "dataset" &&
                "Dataset Management"}

              {activeTab === "settings" &&
                "System Settings"}

            </h1>


            <p>
              Manage and monitor the
              Skin Disease Detection System
            </p>

          </div>


          <div className="admin-header-actions">

            <button
              className="admin-refresh-btn"
              onClick={loadAdminData}
              title="Refresh data"
            >

              <RefreshCw size={18} />

            </button>


            <div className="admin-profile">

              <div className="admin-avatar">
                A
              </div>

              <div>

                <strong>
                  Administrator
                </strong>

                <span>
                  System Admin
                </span>

              </div>

            </div>

          </div>

        </header>


        {/* ERROR */}

        {error && (

          <div className="admin-error">

            <AlertCircle size={20} />

            <span>
              {error}
            </span>

            <button
              onClick={loadAdminData}
            >
              Retry
            </button>

          </div>

        )}


        {/* ====================================
            OVERVIEW
        ==================================== */}

        {activeTab === "overview" && (

          <>

            <section className="admin-stats">


              {/* USERS */}

              <div className="admin-stat-card">

                <div className="stat-icon users">

                  <Users size={23} />

                </div>


                <div>

                  <span>
                    Total Users
                  </span>

                  <h2>
                    {stats.totalUsers}
                  </h2>

                  <small>
                    Registered users
                  </small>

                </div>

              </div>


              {/* ANALYSES */}

              <div className="admin-stat-card">

                <div className="stat-icon analysis">

                  <Activity size={23} />

                </div>


                <div>

                  <span>
                    Total Analyses
                  </span>

                  <h2>
                    {stats.totalAnalyses}
                  </h2>

                  <small>
                    All user analyses
                  </small>

                </div>

              </div>


              {/* COMPLETED */}

              <div className="admin-stat-card">

                <div className="stat-icon completed">

                  <CheckCircle size={23} />

                </div>


                <div>

                  <span>
                    Completed
                  </span>

                  <h2>
                    {stats.completedAnalyses}
                  </h2>

                  <small>
                    Completed analyses
                  </small>

                </div>

              </div>


              {/* PENDING */}

              <div className="admin-stat-card">

                <div className="stat-icon pending">

                  <Clock size={23} />

                </div>


                <div>

                  <span>
                    Pending
                  </span>

                  <h2>
                    {Math.max(
                      stats.totalAnalyses -
                      stats.completedAnalyses,
                      0
                    )}
                  </h2>

                  <small>
                    Needs processing
                  </small>

                </div>

              </div>

            </section>


            {/* CONTENT GRID */}

            <section className="admin-content-grid">


              {/* RECENT PREDICTIONS */}

              <div className="admin-panel">


                <div className="panel-header">

                  <div>

                    <h3>
                      Recent Predictions
                    </h3>

                    <p>
                      Latest AI-assisted analyses
                    </p>

                  </div>


                  <button
                    onClick={() =>
                      setActiveTab(
                        "predictions"
                      )
                    }
                  >
                    View All
                  </button>

                </div>


                <div className="admin-table-wrapper">

                  <table className="admin-table">

                    <thead>

                      <tr>

                        <th>
                          User
                        </th>

                        <th>
                          Analysis
                        </th>

                        <th>
                          Confidence
                        </th>

                        <th>
                          Status
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {predictions
                        .slice(0, 5)
                        .map((item) => (

                          <tr
                            key={item.id}
                          >

                            <td>
                              {item.user?.name ||
                                "Unknown"}
                            </td>

                            <td>
                              {item.conditionName ||
                                "AI Analysis"}
                            </td>

                            <td>
                              {formatConfidence(
                                item.confidence
                              )}
                            </td>

                            <td>

                              <span
                                className={`status ${
                                  (
                                    item.status ||
                                    "COMPLETED"
                                  ).toLowerCase()
                                }`}
                              >

                                {item.status ||
                                  "COMPLETED"}

                              </span>

                            </td>

                          </tr>

                        ))}


                      {predictions.length === 0 && (

                        <tr>

                          <td
                            colSpan="4"
                            style={{
                              textAlign:
                                "center"
                            }}
                          >
                            No analyses found.
                          </td>

                        </tr>

                      )}

                    </tbody>

                  </table>

                </div>

              </div>


              {/* SYSTEM STATUS */}

              <div className="admin-panel system-panel">


                <div className="panel-header">

                  <div>

                    <h3>
                      System Status
                    </h3>

                    <p>
                      Current system health
                    </p>

                  </div>

                </div>


                <div className="system-item">

                  <div>

                    <CheckCircle size={20} />

                    <span>
                      Frontend
                    </span>

                  </div>

                  <strong>
                    Online
                  </strong>

                </div>


                <div className="system-item">

                  <div>

                    <CheckCircle size={20} />

                    <span>
                      Backend API
                    </span>

                  </div>

                  <strong>
                    Online
                  </strong>

                </div>


                <div className="system-item">

                  <div>

                    <CheckCircle size={20} />

                    <span>
                      Database
                    </span>

                  </div>

                  <strong>
                    Online
                  </strong>

                </div>


                <div className="system-item">

                  <div>

                    <Activity size={20} />

                    <span>
                      AI Service
                    </span>

                  </div>

                  <strong>
                    Hugging Face
                  </strong>

                </div>

              </div>

            </section>

          </>

        )}


        {/* ====================================
            USERS
        ==================================== */}

        {activeTab === "users" && (

          <section className="admin-panel full-panel">


            <div className="panel-header">

              <div>

                <h3>
                  Registered Users
                </h3>

                <p>
                  Manage application users
                </p>

              </div>


              <div className="admin-search">

                <Search size={18} />

                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>


            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>

                  <tr>

                    <th>
                      ID
                    </th>

                    <th>
                      Name
                    </th>

                    <th>
                      Email
                    </th>

                    <th>
                      Role
                    </th>

                    <th>
                      Created
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredUsers.map(
                    (user) => (

                      <tr
                        key={user.id}
                      >

                        <td>
                          #{user.id}
                        </td>


                        <td>

                          <div className="user-name">

                            <div className="user-small-avatar">

                              {user.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "U"}

                            </div>

                            {user.name}

                          </div>

                        </td>


                        <td>
                          {user.email}
                        </td>


                        <td>

                          <span className="role-badge">

                            {user.role ||
                              "USER"}

                          </span>

                        </td>


                        <td>
                          {formatDate(
                            user.createdAt
                          )}
                        </td>


                        <td>

                          <button
                            className="table-action delete-action"
                            onClick={() =>
                              handleDeleteUser(
                                user.id
                              )
                            }
                            title="Delete user"
                          >

                            <Trash2
                              size={17}
                            />

                          </button>

                        </td>

                      </tr>

                    )
                  )}


                  {filteredUsers.length === 0 && (

                    <tr>

                      <td
                        colSpan="6"
                        style={{
                          textAlign:
                            "center"
                        }}
                      >

                        No users found.

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </section>

        )}


        {/* ====================================
            PREDICTIONS
        ==================================== */}

        {activeTab === "predictions" && (

          <section className="admin-panel full-panel">


            <div className="panel-header">

              <div>

                <h3>
                  AI Analysis Records
                </h3>

                <p>
                  Monitor user skin image analyses
                </p>

              </div>


              <div className="prediction-total">

                <Activity size={18} />

                {predictions.length} Total

              </div>

            </div>


            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>

                  <tr>

                    <th>
                      ID
                    </th>

                    <th>
                      User
                    </th>

                    <th>
                      Analysis
                    </th>

                    <th>
                      Confidence
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {predictions.map(
                    (item) => (

                      <tr
                        key={item.id}
                      >

                        <td>
                          #{item.id}
                        </td>


                        <td>
                          {item.user?.name ||
                            "Unknown"}
                        </td>


                        <td>
                          {item.conditionName ||
                            "AI Analysis"}
                        </td>


                        <td>
                          {formatConfidence(
                            item.confidence
                          )}
                        </td>


                        <td>

                          <span
                            className={`status ${
                              (
                                item.status ||
                                "COMPLETED"
                              ).toLowerCase()
                            }`}
                          >

                            {item.status ||
                              "COMPLETED"}

                          </span>

                        </td>


                        <td>
                          {formatDate(
                            item.createdAt
                          )}
                        </td>


                        <td>

                          <button
                            className="table-action delete-action"
                            onClick={() =>
                              handleDeleteAnalysis(
                                item.id
                              )
                            }
                            title="Delete analysis"
                          >

                            <Trash2
                              size={17}
                            />

                          </button>

                        </td>

                      </tr>

                    )
                  )}


                  {predictions.length === 0 && (

                    <tr>

                      <td
                        colSpan="7"
                        style={{
                          textAlign:
                            "center"
                        }}
                      >

                        No analysis records found.

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </section>

        )}


        {/* ====================================
            CATEGORIES
        ==================================== */}

        {activeTab === "categories" && (

          <section className="admin-panel full-panel">


            <div className="panel-header">

              <div>

                <h3>
                  Supported Disease Categories
                </h3>

                <p>
                  Categories used for informational
                  AI-assisted analysis
                </p>

              </div>

            </div>


            <div className="category-grid">

              {[
                "Acne",
                "Eczema",
                "Psoriasis",
                "Dermatitis",
                "Melanoma",
                "Fungal Infection"
              ].map(
                (category, index) => (

                  <div
                    className="category-card"
                    key={category}
                  >

                    <div className="category-icon">

                      <Stethoscope
                        size={22}
                      />

                    </div>


                    <div>

                      <h4>
                        {category}
                      </h4>

                      <p>
                        Category {index + 1}
                      </p>

                    </div>


                    <button>

                      <MoreVertical
                        size={18}
                      />

                    </button>

                  </div>

                )
              )}

            </div>

          </section>

        )}


        {/* ====================================
            DATASET
        ==================================== */}

        {activeTab === "dataset" && (

          <section className="admin-panel full-panel">


            <div className="dataset-empty">

              <div className="dataset-icon">

                <Database size={40} />

              </div>


              <h3>
                AI Dataset Management
              </h3>


              <p>
                The current application uses
                Hugging Face for AI-assisted
                image classification. Local
                dataset training and management
                are not connected to this
                dashboard.
              </p>


              <div className="dataset-info">


                <div>

                  <strong>
                    Supported Classes
                  </strong>

                  <span>
                    6
                  </span>

                </div>


                <div>

                  <strong>
                    Images
                  </strong>

                  <span>
                    API Based
                  </span>

                </div>


                <div>

                  <strong>
                    AI Service
                  </strong>

                  <span>
                    Hugging Face
                  </span>

                </div>


              </div>

            </div>

          </section>

        )}


        {/* ====================================
            SETTINGS
        ==================================== */}

        {activeTab === "settings" && (

          <section className="admin-panel full-panel">


            <div className="panel-header">

              <div>

                <h3>
                  System Settings
                </h3>

                <p>
                  Application configuration
                </p>

              </div>

            </div>


            <div className="settings-list">


              <div className="setting-row">

                <div>

                  <strong>
                    AI Analysis
                  </strong>

                  <span>
                    Enable AI-assisted
                    image analysis
                  </span>

                </div>

                <span className="setting-active">
                  Enabled
                </span>

              </div>


              <div className="setting-row">

                <div>

                  <strong>
                    Image Upload
                  </strong>

                  <span>
                    Allow users to upload
                    skin images
                  </span>

                </div>

                <span className="setting-active">
                  Enabled
                </span>

              </div>


              <div className="setting-row">

                <div>

                  <strong>
                    Prediction History
                  </strong>

                  <span>
                    Store analysis history
                  </span>

                </div>

                <span className="setting-active">
                  Enabled
                </span>

              </div>


              <div className="setting-row">

                <div>

                  <strong>
                    Medical Disclaimer
                  </strong>

                  <span>
                    Show disclaimer with
                    AI results
                  </span>

                </div>

                <span className="setting-active">
                  Enabled
                </span>

              </div>


            </div>

          </section>

        )}

      </main>

    </div>

  );

}


export default AdminDashboard;