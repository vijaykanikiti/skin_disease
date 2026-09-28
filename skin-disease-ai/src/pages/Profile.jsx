import React, {
  useContext,
  useEffect,
  useState
} from "react";

import { useNavigate } from "react-router-dom";

import {
  Activity,
  ArrowLeft,
  Camera,
  CheckCircle,
  Edit3,
  FileText,
  LockKeyhole,
  LogOut,
  Mail,
  Moon,
  Phone,
  Save,
  ShieldCheck,
  Sun,
  User,
  X
} from "lucide-react";

import { ThemeContext } from "../context/ThemeContext";

import "../styles/profile.css";


function Profile() {

  const navigate = useNavigate();

  const {
    darkMode,
    toggleTheme
  } = useContext(ThemeContext);


  // ==================================================
  // STATES
  // ==================================================

  const [editing, setEditing] =
    useState(false);

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      phone: "",
      location: ""
    });


  // ==================================================
  // GET LOGGED-IN USER
  // ==================================================

  const getLoggedInUser = () => {

    const possibleKeys = [
      "user",
      "skinai-user",
      "userData",
      "loggedInUser",
      "currentUser"
    ];


    for (const key of possibleKeys) {

      const stored =
        localStorage.getItem(key);

      if (!stored) {
        continue;
      }


      try {

        const parsed =
          JSON.parse(stored);


        if (parsed?.id) {
          return parsed;
        }


        if (parsed?.user?.id) {
          return parsed.user;
        }

      } catch (err) {

        console.error(
          "Invalid localStorage data:",
          key
        );

      }

    }


    return null;
  };


  // ==================================================
  // LOAD PROFILE FROM SPRING BOOT
  // ==================================================

  useEffect(() => {

    const loadProfile = async () => {

      setLoading(true);
      setError("");

      const loggedUser =
        getLoggedInUser();


      if (!loggedUser?.id) {

        setError(
          "User information is missing. Please login again."
        );

        setLoading(false);

        return;

      }


      try {

        console.log(
          "Loading profile for user:",
          loggedUser.id
        );


        const response =
          await fetch(
            `http://localhost:8080/api/users/${loggedUser.id}`
          );


        const responseText =
          await response.text();


        console.log(
          "Profile response:",
          responseText
        );


        if (!response.ok) {

          throw new Error(
            responseText ||
            "Unable to load profile."
          );

        }


        const data =
          JSON.parse(responseText);


        const userData = {

          id: data.id,

          name: data.name || "",

          email: data.email || "",

          phone: data.phone || "",

          location: data.location || "",

          role: data.role || "USER",

          createdAt: data.createdAt

        };


        setUser(userData);


        setFormData({

          name: userData.name,

          email: userData.email,

          phone: userData.phone,

          location: userData.location

        });


        // Keep latest user in localStorage

        localStorage.setItem(
          "user",
          JSON.stringify(userData)
        );


      } catch (err) {

        console.error(
          "Profile loading error:",
          err
        );

        setError(
          err.message ||
          "Unable to load profile."
        );

      } finally {

        setLoading(false);

      }

    };


    loadProfile();

  }, []);


  // ==================================================
  // HANDLE INPUT
  // ==================================================

  const handleChange = (event) => {

    setFormData({

      ...formData,

      [event.target.name]:
        event.target.value

    });

  };


  // ==================================================
  // SAVE PROFILE TO DATABASE
  // ==================================================

  const handleSave = async () => {

    if (!user?.id) {

      setError(
        "User information is missing."
      );

      return;

    }


    if (!formData.name.trim()) {

      setError(
        "Name cannot be empty."
      );

      return;

    }


    setSaving(true);
    setError("");
    setSuccess("");


    try {

      const response =
        await fetch(
          `http://localhost:8080/api/users/${user.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              name:
                formData.name,

              phone:
                formData.phone,

              location:
                formData.location

            })

          }
        );


      const responseText =
        await response.text();


      console.log(
        "Update profile response:",
        responseText
      );


      if (!response.ok) {

        throw new Error(
          responseText ||
          "Unable to update profile."
        );

      }


      const updatedData =
        JSON.parse(responseText);


      const updatedUser = {

        id: updatedData.id,

        name:
          updatedData.name || "",

        email:
          updatedData.email || "",

        phone:
          updatedData.phone || "",

        location:
          updatedData.location || "",

        role:
          updatedData.role || "USER",

        createdAt:
          updatedData.createdAt

      };


      setUser(updatedUser);


      setFormData({

        name:
          updatedUser.name,

        email:
          updatedUser.email,

        phone:
          updatedUser.phone,

        location:
          updatedUser.location

      });


      // Save latest user locally

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );


      // Also update old key if it exists

      if (
        localStorage.getItem(
          "skinai-user"
        )
      ) {

        localStorage.setItem(
          "skinai-user",
          JSON.stringify(updatedUser)
        );

      }


      setEditing(false);

      setSuccess(
        "Profile updated successfully."
      );


      // Remove success message after 3 seconds

      setTimeout(() => {

        setSuccess("");

      }, 3000);


    } catch (err) {

      console.error(
        "Profile update error:",
        err
      );

      setError(
        err.message ||
        "Unable to update profile."
      );

    } finally {

      setSaving(false);

    }

  };


  // ==================================================
  // CANCEL EDIT
  // ==================================================

  const handleCancel = () => {

    setFormData({

      name:
        user?.name || "",

      email:
        user?.email || "",

      phone:
        user?.phone || "",

      location:
        user?.location || ""

    });


    setError("");

    setEditing(false);

  };


  // ==================================================
  // LOGOUT
  // ==================================================

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


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (

      <div className="profile-loading">

        Loading profile...

      </div>

    );

  }


  // ==================================================
  // USER NOT FOUND
  // ==================================================

  if (!user) {

    return (

      <div className="profile-loading">

        <h3>
          Unable to load profile
        </h3>

        <p>
          {error ||
            "Please login again."}
        </p>


        <button
          onClick={() =>
            navigate("/login")
          }
        >
          Login
        </button>

      </div>

    );

  }


  // ==================================================
  // USER INITIAL
  // ==================================================

  const userInitial =
    user.name
      ? user.name
          .charAt(0)
          .toUpperCase()
      : "U";


  return (

    <div className="profile-page">


      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="profile-header">

        <div className="profile-header-left">

          <button
            className="profile-back-btn"
            onClick={() =>
              navigate("/dashboard")
            }
          >

            <ArrowLeft size={18} />

          </button>


          <div>

            <div className="profile-title">

              <User size={21} />

              <h1>
                My Profile
              </h1>

            </div>


            <p>
              Manage your account information
              and preferences.
            </p>

          </div>

        </div>


        {/* THEME */}

        <button
          className="profile-theme-btn"
          onClick={toggleTheme}
        >

          {darkMode ? (

            <>
              <Sun size={17} />
              Light Mode
            </>

          ) : (

            <>
              <Moon size={17} />
              Dark Mode
            </>

          )}

        </button>

      </header>



      {/* ==================================================
          MESSAGES
      ================================================== */}

      <main className="profile-content">


        {error && (

          <div className="profile-error">

            <X size={18} />

            <span>
              {error}
            </span>

          </div>

        )}


        {success && (

          <div className="profile-success">

            <CheckCircle size={18} />

            <span>
              {success}
            </span>

          </div>

        )}



        {/* ==================================================
            PROFILE GRID
        ================================================== */}

        <div className="profile-grid">


          {/* ==================================================
              LEFT PROFILE CARD
          ================================================== */}

          <section className="profile-card profile-main-card">


            <div className="profile-avatar-section">

              <div className="profile-avatar">

                {userInitial}

              </div>


              <button
                className="avatar-camera-btn"
                title="Profile image"
              >

                <Camera size={15} />

              </button>

            </div>


            <h2>
              {user.name}
            </h2>


            <p className="profile-email">
              {user.email}
            </p>


            <span className="profile-role">

              <ShieldCheck size={13} />

              {user.role === "ADMIN"
                ? "Administrator"
                : "User Account"}

            </span>


            <div className="profile-divider" />


            {/* REAL ACCOUNT INFORMATION */}

            <div className="profile-mini-stats">

              <div>

                <strong>
                  {user.role}
                </strong>

                <span>
                  Role
                </span>

              </div>


              <div>

                <strong>
                  {user.id}
                </strong>

                <span>
                  User ID
                </span>

              </div>


              <div>

                <strong>
                  {user.createdAt
                    ? new Date(
                        user.createdAt
                      ).getFullYear()
                    : "-"}
                </strong>

                <span>
                  Joined
                </span>

              </div>

            </div>


            <button
              className="logout-profile-btn"
              onClick={handleLogout}
            >

              <LogOut size={17} />

              Logout

            </button>

          </section>



          {/* ==================================================
              RIGHT CONTENT
          ================================================== */}

          <section className="profile-right">


            {/* ==================================================
                PERSONAL INFORMATION
            ================================================== */}

            <div className="profile-card">


              <div className="profile-card-header">

                <div>

                  <h3>
                    Personal Information
                  </h3>

                  <p>
                    Your account details
                  </p>

                </div>


                {!editing ? (

                  <button
                    className="edit-profile-btn"
                    onClick={() =>
                      setEditing(true)
                    }
                  >

                    <Edit3 size={16} />

                    Edit

                  </button>

                ) : (

                  <div className="profile-edit-actions">


                    <button
                      className="cancel-edit-btn"
                      onClick={handleCancel}
                      disabled={saving}
                    >

                      <X size={15} />

                      Cancel

                    </button>


                    <button
                      className="save-profile-btn"
                      onClick={handleSave}
                      disabled={saving}
                    >

                      <Save size={15} />

                      {saving
                        ? "Saving..."
                        : "Save"}

                    </button>

                  </div>

                )}

              </div>



              <div className="profile-form-grid">


                {/* NAME */}

                <div className="profile-field">

                  <label>
                    Full Name
                  </label>


                  <div className="profile-input">

                    <User size={17} />


                    <input
                      type="text"
                      name="name"
                      value={
                        formData.name
                      }
                      onChange={
                        handleChange
                      }
                      disabled={!editing}
                    />

                  </div>

                </div>



                {/* EMAIL */}

                <div className="profile-field">

                  <label>
                    Email Address
                  </label>


                  <div className="profile-input">

                    <Mail size={17} />


                    <input
                      type="email"
                      name="email"
                      value={
                        formData.email
                      }
                      disabled={true}
                    />

                  </div>

                  <small>
                    Email cannot be changed here.
                  </small>

                </div>



                {/* PHONE */}

                <div className="profile-field">

                  <label>
                    Phone Number
                  </label>


                  <div className="profile-input">

                    <Phone size={17} />


                    <input
                      type="tel"
                      name="phone"
                      value={
                        formData.phone
                      }
                      onChange={
                        handleChange
                      }
                      disabled={!editing}
                      placeholder="Enter phone number"
                    />

                  </div>

                </div>



                {/* LOCATION */}

                <div className="profile-field">

                  <label>
                    Location
                  </label>


                  <div className="profile-input">

                    <Activity size={17} />


                    <input
                      type="text"
                      name="location"
                      value={
                        formData.location
                      }
                      onChange={
                        handleChange
                      }
                      disabled={!editing}
                      placeholder="Enter location"
                    />

                  </div>

                </div>


              </div>

            </div>



            {/* ==================================================
                ACCOUNT SETTINGS
            ================================================== */}

            <div className="profile-card">


              <div className="profile-card-header">

                <div>

                  <h3>
                    Account Settings
                  </h3>

                  <p>
                    Manage your account preferences
                  </p>

                </div>

              </div>


              <div className="settings-list">


                {/* PASSWORD */}

                <div className="setting-row">

                  <div className="setting-icon blue">

                    <LockKeyhole size={18} />

                  </div>


                  <div className="setting-info">

                    <strong>
                      Password
                    </strong>

                    <span>
                      Manage your account password
                    </span>

                  </div>


                  <button
                    onClick={() =>
                      alert(
                        "Password change will be connected next."
                      )
                    }
                  >
                    Change
                  </button>

                </div>



                {/* APPEARANCE */}

                <div className="setting-row">

                  <div className="setting-icon purple">

                    {darkMode ? (
                      <Moon size={18} />
                    ) : (
                      <Sun size={18} />
                    )}

                  </div>


                  <div className="setting-info">

                    <strong>
                      Appearance
                    </strong>

                    <span>
                      Currently using{" "}
                      {darkMode
                        ? "dark"
                        : "light"}{" "}
                      mode
                    </span>

                  </div>


                  <button
                    onClick={toggleTheme}
                  >
                    Change
                  </button>

                </div>



                {/* PRIVACY */}

                <div className="setting-row">

                  <div className="setting-icon green">

                    <ShieldCheck size={18} />

                  </div>


                  <div className="setting-info">

                    <strong>
                      Privacy
                    </strong>

                    <span>
                      Review your privacy preferences
                    </span>

                  </div>


                  <button
                    onClick={() =>
                      alert(
                        "Privacy settings will be added later."
                      )
                    }
                  >
                    View
                  </button>

                </div>


              </div>

            </div>



            {/* ==================================================
                ANALYSIS DATA
            ================================================== */}

            <div className="profile-card account-info-card">

              <div className="account-info-icon">

                <FileText size={20} />

              </div>


              <div>

                <h4>
                  Your Analysis Data
                </h4>

                <p>
                  Your skin analysis records are
                  stored in your account and can be
                  viewed from the History section.
                </p>


                <button
                  onClick={() =>
                    navigate("/history")
                  }
                >

                  View Analysis History

                </button>

              </div>

            </div>



            {/* ==================================================
                HEALTH NOTICE
            ================================================== */}

            <div className="profile-health-notice">

              <CheckCircle size={20} />


              <div>

                <strong>
                  Health Information
                </strong>

                <p>

                  SkinAI is an AI-assisted educational
                  application. Its results should not
                  replace professional medical advice.

                </p>

              </div>

            </div>


          </section>

        </div>

      </main>

    </div>

  );

}


export default Profile;