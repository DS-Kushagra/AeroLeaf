import { Link } from "react-router-dom";
import { useState } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-400 flex items-center justify-center shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-teal-300 bg-clip-text text-transparent">
                AeroLeaf
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Making carbon credits transparent and impactful through satellite
              verification and blockchain technology. Join us in the fight
              against climate change.
            </p>

            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
              >
                <span className="sr-only">GitHub</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>{" "}
          <div className="space-y-4">
            <h5 className="text-lg font-semibold relative inline-block">
              <span className="text-white">Site Map</span>
              <div className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-green-500"></div>
            </h5>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <svg
                    className="h-3 w-3 mr-2 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 12 12"
                  >
                    <path d="M9.707 5.293l-5-5a1 1 0 00-1.414 1.414L7.586 6 3.293 10.293a1 1 0 101.414 1.414l5-5a1 1 0 000-1.414z" />
                  </svg>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <svg
                    className="h-3 w-3 mr-2 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 12 12"
                  >
                    <path d="M9.707 5.293l-5-5a1 1 0 00-1.414 1.414L7.586 6 3.293 10.293a1 1 0 101.414 1.414l5-5a1 1 0 000-1.414z" />
                  </svg>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/marketplace"
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <svg
                    className="h-3 w-3 mr-2 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 12 12"
                  >
                    <path d="M9.707 5.293l-5-5a1 1 0 00-1.414 1.414L7.586 6 3.293 10.293a1 1 0 101.414 1.414l5-5a1 1 0 000-1.414z" />
                  </svg>
                  Marketplace
                </Link>
              </li>
              <li>
                <Link
                  to="/analytics"
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <svg
                    className="h-3 w-3 mr-2 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 12 12"
                  >
                    <path d="M9.707 5.293l-5-5a1 1 0 00-1.414 1.414L7.586 6 3.293 10.293a1 1 0 101.414 1.414l5-5a1 1 0 000-1.414z" />
                  </svg>
                  Analytics
                </Link>
              </li>
              <li>
                <Link
                  to="/report"
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <svg
                    className="h-3 w-3 mr-2 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 12 12"
                  >
                    <path d="M9.707 5.293l-5-5a1 1 0 00-1.414 1.414L7.586 6 3.293 10.293a1 1 0 101.414 1.414l5-5a1 1 0 000-1.414z" />
                  </svg>
                  Report
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="text-lg font-semibold relative inline-block">
              <span className="text-white">Resources</span>
              <div className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-green-500"></div>
            </h5>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <svg
                    className="h-3 w-3 mr-2 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 12 12"
                  >
                    <path d="M9.707 5.293l-5-5a1 1 0 00-1.414 1.414L7.586 6 3.293 10.293a1 1 0 101.414 1.414l5-5a1 1 0 000-1.414z" />
                  </svg>
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <svg
                    className="h-3 w-3 mr-2 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 12 12"
                  >
                    <path d="M9.707 5.293l-5-5a1 1 0 00-1.414 1.414L7.586 6 3.293 10.293a1 1 0 101.414 1.414l5-5a1 1 0 000-1.414z" />
                  </svg>
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <svg
                    className="h-3 w-3 mr-2 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 12 12"
                  >
                    <path d="M9.707 5.293l-5-5a1 1 0 00-1.414 1.414L7.586 6 3.293 10.293a1 1 0 101.414 1.414l5-5a1 1 0 000-1.414z" />
                  </svg>
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <svg
                    className="h-3 w-3 mr-2 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 12 12"
                  >
                    <path d="M9.707 5.293l-5-5a1 1 0 00-1.414 1.414L7.586 6 3.293 10.293a1 1 0 101.414 1.414l5-5a1 1 0 000-1.414z" />
                  </svg>
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <svg
                    className="h-3 w-3 mr-2 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 12 12"
                  >
                    <path d="M9.707 5.293l-5-5a1 1 0 00-1.414 1.414L7.586 6 3.293 10.293a1 1 0 101.414 1.414l5-5a1 1 0 000-1.414z" />
                  </svg>
                  Carbon Credit FAQ
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-6">
            <div>
              <h5 className="text-lg font-semibold relative inline-block">
                <span className="text-white">Newsletter</span>
                <div className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-green-500"></div>
              </h5>
              <p className="text-gray-300 mt-3 mb-4">
                Subscribe to our newsletter for updates on carbon market trends
                and platform features.
              </p>

              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  className={`mt-2 w-full ${
                    subscribed
                      ? "bg-green-600 text-white"
                      : "bg-gradient-to-r from-green-500 to-teal-400 hover:opacity-90 text-white"
                  } px-4 py-2 rounded-md transition-all duration-300 flex items-center justify-center`}
                  disabled={subscribed}
                >
                  {subscribed ? (
                    <>
                      <svg
                        className="w-5 h-5 mr-2 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      Subscribed!
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </form>
            </div>

            <div>
              <h5 className="text-lg font-semibold relative inline-block">
                <span className="text-white">Contact Us</span>
                <div className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-green-500"></div>
              </h5>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3 text-green-400 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-300">
                    info@aeroleaf.example.com
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3 text-green-400 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-gray-300">+1 (555) 123-4567</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3 text-green-400 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-gray-300">
                    123 Green Street, San Francisco, CA 94111
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} AeroLeaf. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
