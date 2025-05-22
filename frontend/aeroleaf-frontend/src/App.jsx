import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import StatusBanner from "./components/StatusBanner";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SiteDetails from "./pages/SiteDetails";
import Report from "./pages/Report";
import Login from "./pages/Login";
import ReviewSites from "./pages/ReviewSites";
import Marketplace from "./pages/Marketplace";
import Analytics from "./pages/Analytics";
import { Web3Provider } from "./contexts/Web3Context";
import "./App.css";

function App() {
  return (
    <Web3Provider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <StatusBanner />
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/site/:id" element={<SiteDetails />} />
              <Route path="/report" element={<Report />} />
              <Route path="/login" element={<Login />} />
              <Route path="/review" element={<ReviewSites />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </Web3Provider>
  );
}

export default App;
