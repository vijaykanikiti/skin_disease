import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("skinai-theme") === "dark";
  });

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark-mode");
      document.body.classList.add("dark-mode");

      localStorage.setItem("skinai-theme", "dark");
    } else {
      root.classList.remove("dark-mode");
      document.body.classList.remove("dark-mode");

      localStorage.setItem("skinai-theme", "light");
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};

export default ThemeContext;