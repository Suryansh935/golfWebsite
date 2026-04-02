import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { apiPost } from "../utils/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    const data = await apiPost('/auth/forgot-password', { email });
    setLoading(false);

    if (data.message) {
      setMessage(data.message);
      return;
    }

    setError('Unable to send reset link. Please try again.');
  };

  return (
    <div className="bg-[#0A0F1C] min-h-screen text-white font-sans selection:bg-green-500/30 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-24 px-6">
        <div className="bg-[#1A202C] border border-gray-800 rounded-3xl shadow-xl p-10 w-full max-w-md">
          <h2 className="text-4xl font-bold text-white mb-6 text-center">Reset Password</h2>
          <p className="text-gray-400 mb-6 text-center">Enter your email to receive a link to reset your password.</p>
          {message && <p className="text-green-400 text-sm mb-4">{message}</p>}
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
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
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-400 text-[#0A0F1C] font-bold py-3 rounded-xl transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          <p className="mt-6 text-center text-gray-400">
            Remembered it?{' '}
            <Link to="/login" className="text-green-500 hover:underline font-semibold">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
