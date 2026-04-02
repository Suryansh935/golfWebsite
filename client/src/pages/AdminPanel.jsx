import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Home/Navbar';
import Footer from '../components/Home/Footer';
import { apiGet, apiPost, apiPut } from '../utils/api';

const tabs = ['Users', 'Draws', 'Charities', 'Analytics'];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('Users');
  const [users, setUsers] = useState([]);
  const [results, setResults] = useState([]);
  const [charities, setCharities] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [runLoading, setRunLoading] = useState(false);
  const [savingCharity, setSavingCharity] = useState(false);
  const [newCharity, setNewCharity] = useState({ name: '', category: '', description: '', website_url: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadUsers();
    loadResults();
    loadCharities();
    loadAnalytics();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const data = await apiGet('/admin/users');
    setUsers(data.users || []);
    setLoading(false);
  };

  const loadResults = async () => {
    const data = await apiGet('/admin/results');
    setResults(data.results || []);
  };

  const loadCharities = async () => {
    const data = await apiGet('/admin/charities');
    setCharities(data.charities || []);
  };

  const loadAnalytics = async () => {
    const data = await apiGet('/admin/analytics');
    setAnalytics(data);
  };

  const handleRunDraw = async () => {
    setRunLoading(true);
    await apiPost('/admin/draw');
    await loadResults();
    await loadAnalytics();
    setRunLoading(false);
    setMessage('Draw completed and analytics refreshed.');
  };

  const toggleCharityStatus = async (id, isActive) => {
    setSavingCharity(true);
    await apiPut(`/admin/charities/${id}`, { is_active: !isActive });
    await loadCharities();
    setSavingCharity(false);
  };

  const handleCreateCharity = async () => {
    setSavingCharity(true);
    const data = await apiPost('/admin/charities', newCharity);
    setSavingCharity(false);
    if (data.charity) {
      setMessage('Charity added successfully.');
      setNewCharity({ name: '', category: '', description: '', website_url: '' });
      await loadCharities();
      return;
    }
    setMessage(data.message || 'Could not add charity.');
  };

  const drawSummary = useMemo(() => {
    if (!analytics) return [];
    return [
      { label: 'Active Subscribers', value: analytics.activeSubscribers },
      { label: 'Monthly Members', value: analytics.monthlySubscribers },
      { label: 'Yearly Members', value: analytics.yearlySubscribers },
      { label: 'Total Revenue', value: `£${analytics.totalRevenue}` },
      { label: 'Prize Pool Estimate', value: `£${analytics.totalPrizePool}` },
      { label: 'Charity Contributions', value: `£${analytics.charityContributions}` },
    ];
  }, [analytics]);

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0F1C] text-white">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-6 pt-24 pb-12 w-full">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400 mt-2">Manage users, draws, charities, and platform analytics.</p>
          </div>
          <button
            onClick={handleRunDraw}
            disabled={runLoading}
            className="rounded-2xl bg-green-500 px-5 py-3 text-black font-bold hover:bg-green-400 transition disabled:opacity-60"
          >
            {runLoading ? 'Running draw...' : 'Run Draw'}
          </button>
        </div>

        <div className="mb-8 flex flex-wrap gap-3 bg-[#111827] rounded-3xl border border-gray-800 p-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab ? 'bg-green-500 text-black' : 'bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {message && (
          <div className="mb-6 rounded-3xl border border-green-500/20 bg-green-500/10 p-4 text-green-200">{message}</div>
        )}

        {activeTab === 'Users' && (
          <section className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4 mb-6">
              <div className="rounded-3xl border border-gray-800 bg-[#111827] p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-green-300">Users</p>
                <p className="mt-4 text-3xl font-bold">{users.length}</p>
              </div>
              <div className="rounded-3xl border border-gray-800 bg-[#111827] p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-green-300">Active plans</p>
                <p className="mt-4 text-3xl font-bold">{analytics?.activeSubscribers ?? '—'}</p>
              </div>
              <div className="rounded-3xl border border-gray-800 bg-[#111827] p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-green-300">Monthly</p>
                <p className="mt-4 text-3xl font-bold">{analytics?.monthlySubscribers ?? '—'}</p>
              </div>
              <div className="rounded-3xl border border-gray-800 bg-[#111827] p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-green-300">Yearly</p>
                <p className="mt-4 text-3xl font-bold">{analytics?.yearlySubscribers ?? '—'}</p>
              </div>
            </div>
            <div className="overflow-x-auto rounded-3xl border border-gray-800 bg-[#0f1720] p-4">
              <table className="w-full min-w-[900px] border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-[0.3em] text-gray-400">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Subscription</th>
                    <th className="px-4 py-3">Scores</th>
                    <th className="px-4 py-3">Charity</th>
                    <th className="px-4 py-3">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-400">Loading users...</td></tr>
                  ) : users.length === 0 ? (
                    <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-400">No users found.</td></tr>
                  ) : users.map((user) => (
                    <tr key={user.id} className="border-b border-white/5">
                      <td className="px-4 py-4 text-sm text-white">{user.name}</td>
                      <td className="px-4 py-4 text-sm text-gray-300">{user.email}</td>
                      <td className="px-4 py-4 text-sm text-green-300">{user.subscriptionStatus}</td>
                      <td className="px-4 py-4 text-sm text-gray-300">{user.scoresEntered}</td>
                      <td className="px-4 py-4 text-sm text-gray-300">{user.charity}</td>
                      <td className="px-4 py-4 text-sm text-gray-300">{new Date(user.joinedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'Draws' && (
          <section className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div className="rounded-3xl border border-gray-800 bg-[#111827] p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-green-300">Last draw</p>
                <p className="mt-4 text-3xl font-bold">{results[0]?.createdAt ? new Date(results[0].createdAt).toLocaleDateString() : '—'}</p>
              </div>
              <div className="rounded-3xl border border-gray-800 bg-[#111827] p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-green-300">Draw count</p>
                <p className="mt-4 text-3xl font-bold">{results.length}</p>
              </div>
              <div className="rounded-3xl border border-gray-800 bg-[#111827] p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-green-300">Latest matches</p>
                <p className="mt-4 text-3xl font-bold">{results[0]?.userMatches.filter((match) => match.matches > 0).length ?? '—'}</p>
              </div>
            </div>
            <div className="space-y-4">
              {results.length === 0 ? (
                <div className="rounded-3xl border border-gray-800 bg-[#111827] p-8 text-center text-gray-400">No draw results yet.</div>
              ) : results.map((result) => (
                <div key={result._id} className="rounded-3xl border border-gray-800 bg-[#111827] p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-green-300">Draw date</p>
                      <p className="mt-2 text-lg font-semibold">{new Date(result.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.drawNumbers.map((num) => (
                        <span key={num} className="rounded-full bg-white/5 px-3 py-2 text-sm text-white">{num}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">Matched users: {result.userMatches.filter((match) => match.matches > 0).length}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'Charities' && (
          <section className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 mb-6">
              <div className="rounded-3xl border border-gray-800 bg-[#111827] p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-green-300">Charity partners</p>
                <p className="mt-4 text-3xl font-bold">{charities.length}</p>
              </div>
              <div className="rounded-3xl border border-gray-800 bg-[#111827] p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-green-300">Manage status</p>
                <p className="mt-4 text-lg text-gray-300">Toggle active charities for users.</p>
              </div>
            </div>
            <div className="overflow-x-auto rounded-3xl border border-gray-800 bg-[#0f1720] p-4">
              <table className="w-full min-w-[700px] border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-[0.3em] text-gray-400">
                    <th className="px-4 py-3">Charity</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Website</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {charities.map((charity) => (
                    <tr key={charity.id} className="border-b border-white/5">
                      <td className="px-4 py-4 text-sm text-white">{charity.name}</td>
                      <td className="px-4 py-4 text-sm text-gray-300">{charity.category}</td>
                      <td className="px-4 py-4 text-sm text-green-300">{charity.is_active ? 'Active' : 'Inactive'}</td>
                      <td className="px-4 py-4 text-sm text-gray-300">
                        <a href={charity.website_url} target="_blank" rel="noreferrer" className="text-green-300 hover:text-green-200">Visit</a>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => toggleCharityStatus(charity.id, charity.is_active)}
                          disabled={savingCharity}
                          className="rounded-full bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-green-500/20 disabled:opacity-60"
                        >
                          {charity.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="rounded-3xl border border-gray-800 bg-[#111827] p-6">
              <h2 className="text-xl font-bold">Add new charity</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <input
                  value={newCharity.name}
                  onChange={(e) => setNewCharity({ ...newCharity, name: e.target.value })}
                  placeholder="Charity name"
                  className="rounded-3xl bg-[#0A0F1C] border border-gray-700 px-4 py-3 text-white outline-none"
                />
                <input
                  value={newCharity.category}
                  onChange={(e) => setNewCharity({ ...newCharity, category: e.target.value })}
                  placeholder="Category"
                  className="rounded-3xl bg-[#0A0F1C] border border-gray-700 px-4 py-3 text-white outline-none"
                />
                <input
                  value={newCharity.website_url}
                  onChange={(e) => setNewCharity({ ...newCharity, website_url: e.target.value })}
                  placeholder="Website URL"
                  className="rounded-3xl bg-[#0A0F1C] border border-gray-700 px-4 py-3 text-white outline-none"
                />
                <textarea
                  value={newCharity.description}
                  onChange={(e) => setNewCharity({ ...newCharity, description: e.target.value })}
                  placeholder="Short description"
                  className="rounded-3xl bg-[#0A0F1C] border border-gray-700 px-4 py-3 text-white outline-none resize-none h-28"
                />
              </div>
              <button
                onClick={handleCreateCharity}
                disabled={savingCharity}
                className="mt-6 rounded-2xl bg-green-500 px-6 py-3 text-black font-bold hover:bg-green-400 transition disabled:opacity-60"
              >
                {savingCharity ? 'Adding charity...' : 'Add charity'}
              </button>
            </div>
          </section>
        )}

        {activeTab === 'Analytics' && (
          <section className="grid gap-6 xl:grid-cols-2">
            {drawSummary.map((card) => (
              <div key={card.label} className="rounded-3xl border border-gray-800 bg-[#111827] p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-green-300">{card.label}</p>
                <p className="mt-4 text-3xl font-bold">{card.value}</p>
              </div>
            ))}
            <div className="rounded-3xl border border-gray-800 bg-[#111827] p-6">
              <h2 className="text-xl font-bold">Match distribution</h2>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-300">
                  <span>3-match</span>
                  <span>{analytics?.matchDistribution?.['3'] ?? 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-300">
                  <span>4-match</span>
                  <span>{analytics?.matchDistribution?.['4'] ?? 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-300">
                  <span>5-match</span>
                  <span>{analytics?.matchDistribution?.['5'] ?? 0}</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminPanel;
