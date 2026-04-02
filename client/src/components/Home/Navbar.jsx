import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0F1C]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="text-xl font-bold text-white tracking-tight">
          <span className="text-green-500">Birdie</span> Bounty
        </Link>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-8">

          <Link
            to="/"
            className={`text-sm font-medium transition ${
              isActive("/") ? "text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Home
          </Link>

          <Link
            to="/explore"
            className={`text-sm font-medium transition ${
              isActive("/explore") ? "text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Explore
          </Link>

          <Link
            to="/dashboard"
            className={`text-sm font-medium transition ${
              isActive("/dashboard") ? "text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Dashboard
          </Link>

          <Link
            to="/charities"
            className={`text-sm font-medium transition ${
              isActive("/charities") ? "text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Charities
          </Link>

          <Link
            to="/how-it-works"
            className={`text-sm font-medium transition ${
              isActive("/how-it-works") ? "text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            How it Works
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm text-gray-300 hover:text-white"
              >
                Dashboard
              </Link>

              <button
                onClick={logout}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-300 hover:text-white"
              >
                Sign in
              </Link>

              <Link
                to="/register"
                className="bg-green-500 hover:bg-green-400 text-black px-5 py-2 rounded-lg text-sm font-semibold transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex md:hidden h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#0A0F1C]/90 text-white hover:bg-[#ffffff0d]"
          aria-label="Toggle menu"
        >
          <span className="text-xl">{mobileOpen ? "×" : "☰"}</span>
        </button>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="space-y-3 border-t border-white/10 px-6 pb-5 pt-4 bg-[#0A0F1C]/95">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className={`block text-sm font-medium ${isActive("/") ? "text-white" : "text-gray-400 hover:text-white"}`}
          >
            Home
          </Link>
          <Link
            to="/explore"
            onClick={() => setMobileOpen(false)}
            className={`block text-sm font-medium ${isActive("/explore") ? "text-white" : "text-gray-400 hover:text-white"}`}
          >
            Explore
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileOpen(false)}
            className={`block text-sm font-medium ${isActive("/dashboard") ? "text-white" : "text-gray-400 hover:text-white"}`}
          >
            Dashboard
          </Link>
          <Link
            to="/charities"
            onClick={() => setMobileOpen(false)}
            className={`block text-sm font-medium ${isActive("/charities") ? "text-white" : "text-gray-400 hover:text-white"}`}
          >
            Charities
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileOpen(false)}
            className={`block text-sm font-medium ${isActive("/how-it-works") ? "text-white" : "text-gray-400 hover:text-white"}`}
          >
            How it Works
          </Link>
          {user ? (
            <button
              onClick={() => {
                logout();
                setMobileOpen(false);
              }}
              className="block text-left w-full text-sm font-medium text-red-400 hover:text-red-300"
            >
              Logout
            </button>
          ) : (
            <div className="space-y-3">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-gray-300 hover:text-white"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="block rounded-full bg-green-500 px-4 py-3 text-sm font-semibold text-black text-center hover:bg-green-400"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;