import React from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Home,
  Info,
  LogIn,
  UserPlus
} from "lucide-react";

import ThemeToggle from "../context/ThemeToggle";

import "../styles/navbar.css";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg skin-navbar">
      <div className="container">

        <Link className="navbar-brand skin-brand" to="/">
          <span className="brand-icon">
            <Activity size={24} />
          </span>

          <span>
            Skin<span className="brand-highlight">AI</span>
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="mainNavbar"
        >
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">

            <li className="nav-item">
              <Link className="nav-link" to="/">
                <Home size={17} />
                Home
              </Link>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#about">
                <Info size={17} />
                About
              </a>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/login">
                <LogIn size={17} />
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link className="register-nav-btn" to="/register">
                <UserPlus size={17} />
                Register
              </Link>
            </li>

            <li className="nav-item">
              <ThemeToggle />
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;