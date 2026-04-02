import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { apiPost } from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const urlToken = searchParams.get('token') || '';
    setToken(urlToken);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError('Reset token is missing from the link.');
      return;
    }
    if (!password || !confirmPassword) {
      setError('Please enter a new password and confirm it.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const data = await apiPost('/auth/reset-password', { token, password, confirmPassword });
    setLoading(false);

    if (data.token && data.user) {
      login(data.token, data.user);
      setMessage('Password updated successfully. Redirecting to your dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
      return;
    }

    setError(data.message || 'Unable to reset password.');
  };

  return (
    <div className="bg-[#0A0F1C] min-h-screen text-white font-sans selection:bg-green-500/30 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-24 px-6">
        <div className="bg-[#1A202C] border border-gray-800 rounded-3xl shadow-xl p-10 w-full max-w-md">
          <h2 className="text-4xl font-bold text-white mb-6 text-center">Set New Password</h2>
          <p className="text-gray-400 mb-6 text-center">Create a new password for your GolfGive account.</p>
          {message && <p className="text-green-400 text-sm mb-4">{message}</p>}
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-400 mb-2 font-medium">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-5 py-3 bg-[#0A0F1C] border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2 font-medium">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-5 py-3 bg-[#0A0F1C] border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-400 text-[#0A0F1C] font-bold py-3 rounded-xl transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
          <p className="mt-6 text-center text-gray-400">
            Remembered your password?{' '}
            <Link to="/login" className="text-green-500 hover:underline font-semibold">
              Login now
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;
