import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      {/* Premium Background with Multiple Gradient Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-900/10 to-transparent"></div>

      {/* Animated Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl "></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-teal-500/5 to-cyan-500/5 rounded-full blur-3xl  delay-1000"></div>

      <div className="relative z-10 pt-20 pb-12">
        <div className="container mx-auto px-6">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Brand Section - Takes more space */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-all duration-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7 text-white"
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
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 opacity-30 blur "></div>
                  </div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-white via-emerald-100 to-teal-200 bg-clip-text text-transparent">
                    AeroLeaf
                  </span>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                  Pioneering the future of carbon markets through advanced
                  satellite monitoring, blockchain verification, and transparent
                  environmental impact measurement.
                </p>

                {/* Trust Indicators */}
                <div className="flex items-center space-x-6 pt-2">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-full backdrop-blur-sm">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full "></div>
                    <span className="text-sm text-emerald-300 font-medium">
                      Verified Platform
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-full backdrop-blur-sm">
                    <div className="w-2 h-2 bg-blue-400 rounded-full  delay-500"></div>
                    <span className="text-sm text-blue-300 font-medium">
                      Blockchain Secured
                    </span>
                  </div>
                </div>
              </div>

              {/* Premium Social Links */}
              <div className="flex space-x-4">
                {[
                  {
                    name: "Twitter",
                    icon: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84",
                  },
                  {
                    name: "GitHub",
                    icon: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z",
                  },
                  {
                    name: "LinkedIn",
                    icon: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
                  },
                ].map((social, index) => (
                  <a
                    key={social.name}
                    href="#"
                    className="group relative w-12 h-12 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl flex items-center justify-center backdrop-blur-sm hover:border-emerald-500/50 transition-all duration-500 hover:transform hover:scale-110"
                  >
                    <svg
                      className="h-5 w-5 text-gray-400 group-hover:text-emerald-400 transition-colors duration-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d={social.icon} />
                    </svg>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-all duration-500"></div>
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation Sections */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-lg font-semibold text-white relative">
                Platform
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
              </h3>
              <ul className="space-y-4">
                {[
                  { to: "/dashboard", label: "Dashboard" },
                  { to: "/marketplace", label: "Marketplace" },
                  { to: "/analytics", label: "Analytics" },
                  { to: "/report", label: "Reporting" },
                ].map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="text-gray-400 hover:text-white transition-all duration-300 flex items-center group"
                    >
                      <div className="w-1 h-1 bg-emerald-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-lg font-semibold text-white relative">
                Resources
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
              </h3>
              <ul className="space-y-4">
                {[
                  { href: "#", label: "Documentation" },
                  { href: "#", label: "API Reference" },
                  { href: "#", label: "Knowledge Base" },
                  { href: "#", label: "Support Center" },
                ].map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-gray-400 hover:text-white transition-all duration-300 flex items-center group"
                    >
                      <div className="w-1 h-1 bg-emerald-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <h3 className="text-lg font-semibold text-white relative">
                Professional Services
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
              </h3>

              {/* Enterprise Contact */}
              <div className="space-y-4">
                <div className="p-6 bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/30 rounded-2xl backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-500">
                  <h4 className="text-white font-medium mb-3">
                    Enterprise Solutions
                  </h4>
                  <p className="text-gray-400 text-sm mb-4">
                    Custom carbon credit solutions for enterprise clients and
                    institutional investors.
                  </p>
                  <a
                    href="#"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300"
                  >
                    Contact Sales
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </a>
                </div>

                {/* Security Badge */}
                <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/20 rounded-xl">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-300">
                      SOC 2 Type II Compliant
                    </p>
                    <p className="text-xs text-blue-400">
                      Enterprise-grade security
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Bottom Section */}
          <div className="mt-16 pt-8 border-t border-gradient-to-r from-transparent via-gray-700/50 to-transparent">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-8">
                <p className="text-gray-400 text-sm">
                  &copy; {currentYear} AeroLeaf Technologies. All rights
                  reserved.
                </p>
                <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-500">
                  <span>Powered by</span>
                  <span className="font-medium bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    Satellite AI & Blockchain
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-8">
                <div className="flex space-x-6">
                  {["Privacy Policy", "Terms of Service", "Security"].map(
                    (item) => (
                      <a
                        key={item}
                        href="#"
                        className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
                      >
                        {item}
                      </a>
                    )
                  )}
                </div>

                {/* Status Indicator */}
                <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full "></div>
                  <span className="text-xs text-emerald-300 font-medium">
                    All Systems Operational
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
