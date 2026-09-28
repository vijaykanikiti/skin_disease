import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeContext";

function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle"
      title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

export default ThemeToggle;