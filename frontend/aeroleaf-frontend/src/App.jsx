import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./styles/theme";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import Analytics from "./pages/Analytics";
import Report from "./pages/Report";
import Login from "./pages/Login";
import UserProfile from "./components/UserProfile";
import ProjectDetails from "./pages/ProjectDetails";
import SiteDetails from "./pages/SiteDetails";
import ReviewSites from "./pages/ReviewSites";
import { HelpProvider } from "./contexts/HelpContext";
import { AuthProvider } from "./contexts/AuthContext";
import HelpButton from "./components/HelpButton";
import { Web3Provider } from "./contexts/Web3Context";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Web3Provider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <HelpProvider>
            <Router>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/project/:id" element={<ProjectDetails />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/report" element={<Report />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/site/:id" element={<SiteDetails />} />
                    <Route path="/review" element={<ReviewSites />} />
                  </Routes>
                </main>
                <Footer />
                <HelpButton />
              </div>
            </Router>
          </HelpProvider>
        </ThemeProvider>
      </Web3Provider>
    </AuthProvider>
  );
}

export default App;
