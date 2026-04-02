import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { apiPost } from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const data = await apiPost('/auth/login', { email, password });
    if (data.token && data.user) {
      login(data.token, data.user);
      navigate('/dashboard');
      return;
    }

    setError(data.message || 'Unable to login.');
  };

  return (
    <div className="bg-[#0A0F1C] min-h-screen text-white font-sans selection:bg-green-500/30 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-24 px-6">
        <div className="bg-[#1A202C] border border-gray-800 rounded-3xl shadow-xl p-10 w-full max-w-md">
          <h2 className="text-4xl font-bold text-white mb-6 text-center">Welcome Back!</h2>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-400 mb-2 font-medium">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-3 bg-[#0A0F1C] border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2 font-medium">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-5 py-3 bg-[#0A0F1C] border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-400 text-[#0A0F1C] font-bold py-3 rounded-xl transition-all duration-300"
            >
              Login
            </button>
          </form>
          <p className="mt-6 text-center text-gray-400">
            Forgot your password?{' '}
            <Link to="/forgot-password" className="text-green-500 hover:underline font-semibold">
              Reset it here
            </Link>
          </p>
          <p className="mt-4 text-center text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-500 hover:underline font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
