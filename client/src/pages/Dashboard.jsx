import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { AuthContext } from "../context/AuthContext";
import { apiGet, apiPost, apiPut } from "../utils/api";

const Dashboard = () => {
  const { user, setUser, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("Scores");
  const [newScore, setNewScore] = useState("");
  const [charities, setCharities] = useState([]);
  const [selectedCharity, setSelectedCharity] = useState("");
  const [donationPercentage, setDonationPercentage] = useState(10);
  const [results, setResults] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [scoreLoading, setScoreLoading] = useState(false);
  const [charityLoading, setCharityLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setSelectedCharity(user.charity?.name || "");
    setDonationPercentage(user.charity?.donationPercentage || 10);
  }, [user]);

  useEffect(() => {
    fetchCharities();
    fetchResults();
  }, []);

  const fetchCharities = async () => {
    const data = await apiGet('/charity/list');
    if (data.charities) setCharities(data.charities);
  };

  const fetchResults = async () => {
    const data = await apiGet('/results');
    if (data.results) setResults(data.results);
  };

  const handleAddScore = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    const parsed = Number(newScore);
    if (!parsed || parsed < 1 || parsed > 45) {
      setStatusMessage('Enter a score from 1 to 45.');
      return;
    }

    setScoreLoading(true);
    const data = await apiPost('/scores', { score: parsed });
    setScoreLoading(false);

    if (data.scores) {
      setUser({ ...user, scores: data.scores });
      setNewScore("");
      setStatusMessage('Score saved.');
      return;
    }

    setStatusMessage(data.message || 'Unable to save score.');
  };

  const handleSaveCharity = async () => {
    setStatusMessage("");
    if (!selectedCharity) {
      setStatusMessage('Please choose a charity.');
      return;
    }

    setCharityLoading(true);
    const data = await apiPut('/charity', {
      name: selectedCharity,
      donationPercentage: Number(donationPercentage)
    });
    setCharityLoading(false);

    if (data.charity) {
      setUser({ ...user, charity: data.charity });
      setStatusMessage('Charity preferences saved.');
      return;
    }

    setStatusMessage(data.message || 'Unable to update charity.');
  };

  const handleActivateSubscription = async () => {
    navigate('/subscribe');
  };

  useEffect(() => {
    const confirmSession = async () => {
      const session = searchParams.get('session');
      const sessionId = searchParams.get('session_id');

      if (session === 'success' && sessionId) {
        setStatusMessage('Confirming subscription...');
        const data = await apiGet(`/payments/confirm?session_id=${encodeURIComponent(sessionId)}`);
        if (data.subscriptionStatus) {
          setUser({ ...user, subscriptionStatus: data.subscriptionStatus });
          setStatusMessage('Subscription confirmed!');
          navigate('/dashboard', { replace: true });
          return;
        }

        setStatusMessage(data.message || 'Awaiting Stripe confirmation.');
      }
    };

    confirmSession();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0F1C] text-white">Loading...</div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0F1C] font-sans text-white selection:bg-green-500/30">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-6 pt-24 w-full">
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, {user?.name || 'Player'}.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => { logout(); window.location.href = '/login'; }}
              className="rounded-2xl bg-gray-800 px-5 py-3 text-sm text-gray-200 hover:bg-gray-700 transition"
            >
              Logout
            </button>
            {user?.role === 'admin' && (
              <a href="/admin" className="rounded-2xl bg-green-500 px-5 py-3 text-sm font-bold text-black hover:bg-green-400 transition">
                Admin
              </a>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="rounded-3xl border border-gray-800 bg-[#111827] p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-green-300">Next draw</p>
            <h2 className="mt-4 text-2xl font-bold">Coming soon</h2>
            <p className="mt-3 text-gray-400">Stay active by submitting 5 scores before the next draw date.</p>
          </div>
          <div className="rounded-3xl border border-gray-800 bg-[#111827] p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-green-300">Charity</p>
            <h2 className="mt-4 text-2xl font-bold">{user?.charity?.name || 'Choose a charity'}</h2>
            <p className="mt-3 text-gray-400">Direct {user?.charity?.donationPercentage || 10}% of your winnings to a cause you love.</p>
          </div>
          <div className="rounded-3xl border border-gray-800 bg-[#111827] p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-green-300">Subscription</p>
            <h2 className="mt-4 text-2xl font-bold capitalize">{user?.subscriptionStatus || 'Inactive'}</h2>
            <p className="mt-3 text-gray-400">Activate any plan to unlock draws, score entry, and charity donations.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <PlanCard
            title="Monthly Plan"
            price="£9.99"
            period="/month"
            active={user?.subscriptionStatus === 'monthly'}
            onAction={handleActivateSubscription}
          />
          <PlanCard
            title="Yearly Plan"
            price="£89.99"
            period="/year"
            badge="Save 25%"
            active={user?.subscriptionStatus === 'yearly'}
            onAction={handleActivateSubscription}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatMini label="Subscription" value={user?.subscriptionStatus || 'Inactive'} icon="💳" />
          <StatMini label="Scores Entered" value={`${user?.scores?.length || 0} / 5`} icon="🎯" />
          <StatMini label="Charity" value={user?.charity?.name || 'Not set'} icon="❤️" />
          <StatMini label="Total Draws" value={`${results.length}`} icon="🏆" />
        </div>

        <div className="bg-[#1A202C] p-1 rounded-xl flex mb-8 max-w-2xl mx-auto border border-gray-800">
          {['Scores', 'Charity', 'Results', 'Profile'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab ? 'bg-green-500 text-[#0A0F1C]' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {(searchParams.get('session') === 'success' || searchParams.get('session') === 'cancel') && (
          <div className={`mb-6 max-w-2xl mx-auto rounded-2xl border p-4 ${
            searchParams.get('session') === 'success'
              ? 'border-green-500/20 bg-green-500/10 text-green-200'
              : 'border-red-500/20 bg-red-500/10 text-red-200'
          }`}>
            {searchParams.get('session') === 'success'
              ? 'Payment completed. Your subscription will update once Stripe confirms the checkout.'
              : 'Checkout canceled. You can try again when ready.'}
          </div>
        )}
        {statusMessage && (
          <div className="mb-6 max-w-2xl mx-auto rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-green-200">
            {statusMessage}
          </div>
        )}

        <div className="mt-8 mb-16">
          {activeTab === 'Scores' && (
            <ScoresTab
              user={user}
              newScore={newScore}
              setNewScore={setNewScore}
              onSubmit={handleAddScore}
              loading={scoreLoading}
            />
          )}
          {activeTab === 'Charity' && (
            <CharityTab
              charities={charities}
              selectedCharity={selectedCharity}
              setSelectedCharity={setSelectedCharity}
              donationPercentage={donationPercentage}
              setDonationPercentage={setDonationPercentage}
              onSave={handleSaveCharity}
              loading={charityLoading}
            />
          )}
          {activeTab === 'Results' && <ResultsTab results={results} />}
          {activeTab === 'Profile' && <ProfileTab user={user} />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const ScoresTab = ({ user, newScore, setNewScore, onSubmit, loading }) => (
  <div className="grid lg:grid-cols-2 gap-8">
    <div className="bg-[#1A202C] p-8 rounded-2xl border border-gray-800">
      <h3 className="text-xl font-bold mb-6">Add Score</h3>
      <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg mb-6">
        <p className="text-sm text-yellow-400">
          Only paid members can add scores. Enter your latest Stableford score between 1 and 45.
        </p>
      </div>
      {!user?.subscriptionStatus && (
        <div className="mb-6 rounded-2xl border border-yellow-500/20 bg-[#141d25] p-4 text-yellow-200">
          Subscribe first to unlock score entry and earn draw entries every month.
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 mb-2 block font-medium">Score (1-45)</label>
          <input
            type="number"
            placeholder="Enter your score"
            value={newScore}
            onChange={(e) => setNewScore(e.target.value)}
            min="1"
            max="45"
            className="w-full bg-[#0A0F1C] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-green-500 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={loading || user?.subscriptionStatus === 'inactive'}
          className="w-full bg-green-500 text-[#0A0F1C] font-bold py-3 rounded-lg transition-all hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Saving...' : '+ Add Score'}
        </button>
      </form>
    </div>
    <div className="bg-[#1A202C] p-8 rounded-2xl border border-gray-800">
      <h3 className="text-xl font-bold mb-4">Latest Scores</h3>
      {user?.scores?.length ? (
        <div className="space-y-3">
          {user.scores.map((score) => (
            <div key={score.id} className="rounded-2xl bg-[#111827] p-4 border border-gray-800 flex justify-between">
              <span>Score</span>
              <span className="font-bold">{score.value}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No scores entered yet.</p>
      )}
    </div>
  </div>
);

const CharityTab = ({ charities, selectedCharity, setSelectedCharity, donationPercentage, setDonationPercentage, onSave, loading }) => (
  <div className="bg-[#1A202C] p-8 rounded-2xl border border-gray-800 max-w-xl mx-auto">
    <h3 className="text-xl font-bold mb-6">Your Charity</h3>
    <select
      value={selectedCharity}
      onChange={(e) => setSelectedCharity(e.target.value)}
      className="w-full bg-[#0A0F1C] border border-gray-700 rounded-lg p-3 mb-6 text-gray-300 outline-none"
    >
      <option value="">Choose a charity...</option>
      {charities.map((charity) => (
        <option key={charity.name} value={charity.name}>{charity.name}</option>
      ))}
    </select>
    <div className="mb-8">
      <label className="block text-sm mb-2 text-gray-400 text-center">
        Contribution: <span className="text-green-500">{donationPercentage}%</span>
      </label>
      <input
        type="range"
        value={donationPercentage}
        min="10"
        max="100"
        onChange={(e) => setDonationPercentage(Number(e.target.value))}
        className="w-full accent-green-500 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
      />
      <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed">
        Minimum 10% of winnings goes to your chosen charity.
      </p>
    </div>
    <button
      onClick={onSave}
      disabled={loading}
      className="w-full bg-green-500 hover:bg-green-400 text-[#0A0F1C] font-bold py-3 rounded-lg transition-all disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? 'Saving...' : 'Save Charity Selection'}
    </button>
  </div>
);

const ResultsTab = ({ results }) => (
  <div className="space-y-6">
    {results.length === 0 ? (
      <div className="bg-[#1A202C] p-12 rounded-2xl border border-gray-800 text-center">
        <div className="text-3xl mb-4 opacity-50">🗓️</div>
        <p className="text-gray-500">No draw results yet. Results are published monthly.</p>
      </div>
    ) : (
      results.map((result) => (
        <div key={result._id} className="bg-[#1A202C] p-8 rounded-3xl border border-gray-800">
          <div className="flex flex-wrap gap-3 items-center mb-4">
            <span className="text-sm uppercase text-gray-500">Draw</span>
            <div className="rounded-full bg-green-500/20 px-3 py-1 text-green-200">{new Date(result.createdAt).toLocaleString()}</div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {result.drawNumbers.map((value) => (
              <span key={value} className="px-3 py-2 bg-[#0A0F1C] rounded-full border border-gray-700">{value}</span>
            ))}
          </div>
          <div className="text-gray-300">
            {result.userMatches.filter((match) => match.matches > 0).length} users matched at least one score.
          </div>
        </div>
      ))
    )}
  </div>
);

const ProfileTab = ({ user }) => (
  <div className="bg-[#1A202C] p-8 rounded-2xl border border-gray-800 max-w-xl mx-auto">
    <h3 className="text-xl font-bold mb-8 text-center">Profile Settings</h3>
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs text-gray-500 uppercase tracking-widest px-1">Email</label>
        <input
          type="email"
          value={user?.email || ''}
          disabled
          className="w-full bg-[#0A0F1C] border border-gray-700 rounded-lg p-3 text-white outline-none"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs text-gray-500 uppercase tracking-widest px-1">Full Name</label>
        <input
          type="text"
          value={user?.name || ''}
          disabled
          className="w-full bg-[#0A0F1C] border border-gray-700 rounded-lg p-3 text-white outline-none"
        />
      </div>
      <p className="text-sm text-gray-400 pt-3">Profile editing is coming soon.</p>
    </div>
  </div>
);

const PlanCard = ({ title, price, period, badge, active, onAction }) => (
  <div className="bg-[#1A202C] p-8 rounded-2xl border border-gray-800 relative group hover:border-gray-700 transition-all">
    {badge && (
      <span className="absolute top-4 right-4 bg-green-500 text-[#0A0F1C] text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
        {badge}
      </span>
    )}
    <h4 className="text-gray-500 mb-4 text-xs font-bold uppercase tracking-widest">{title}</h4>
    <div className="flex items-baseline gap-1 mb-8">
      <span className="text-4xl font-bold">{price}</span>
      <span className="text-gray-500 text-sm">{period}</span>
    </div>
    <ul className="space-y-3 text-gray-400 text-sm mb-10">
      <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Enter up to 5 golf scores</li>
      <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Monthly prize draws</li>
      <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Choose your charity</li>
    </ul>
    <button
      onClick={onAction}
      className={`w-full py-3.5 rounded-lg font-bold transition-all ${
        active ? 'bg-gray-600 text-white cursor-default' : 'bg-green-600 text-white hover:bg-green-500'
      }`}
      disabled={active}
    >
      {active ? 'Active plan' : 'Activate plan'}
    </button>
  </div>
);

const StatMini = ({ label, value, icon }) => (
  <div className="bg-[#1A202C] p-5 rounded-2xl border border-gray-800 flex items-center gap-4 hover:bg-[#252c3a] transition-all">
    <div className="bg-[#0A0F1C] w-12 h-12 flex items-center justify-center rounded-xl text-xl shadow-inner">
      {icon}
    </div>
    <div>
      <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-0.5">{label}</p>
      <p className="text-white font-bold text-lg">{value}</p>
    </div>
  </div>
);

export default Dashboard;
