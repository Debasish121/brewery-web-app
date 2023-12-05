import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import BrewerySearchPage from "./components/BrewerySearchPage";
import BreweryDetail from "./components/BreweryDetail";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* <Route path="/brewery" element={<BrewerySearchPage />} /> */}
        <Route
          path="/brewery"
          element={
            isAuthenticated ? <BrewerySearchPage /> : <Navigate to="/" />
          }
        />
        <Route path="/brewery/:id" element={<BreweryDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
