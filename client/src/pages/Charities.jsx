import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { apiGet, apiPut } from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const categories = ["All", "Community", "Education", "Environment", "Health", "Sports"];

const CharitiesPage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [charities, setCharities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedCharity, setSelectedCharity] = useState(user?.charity?.name || "");
  const [donationPercentage, setDonationPercentage] = useState(user?.charity?.donationPercentage || 10);
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCharities();
  }, []);

  useEffect(() => {
    setSelectedCharity(user?.charity?.name || "");
    setDonationPercentage(user?.charity?.donationPercentage || 10);
  }, [user]);

  const fetchCharities = async () => {
    const data = await apiGet('/charity/list');
    if (data.charities) {
      setCharities(data.charities);
    }
  };

  const filteredCharities = useMemo(() => {
    return charities.filter((charity) => {
      const categoryMatch = activeCategory === 'All' || charity.category === activeCategory;
      const searchMatch = charity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        charity.description.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [charities, activeCategory, searchQuery]);

  const handleSave = async () => {
    if (!user) {
      setStatusMessage('Please log in to choose a charity.');
      return;
    }

    if (!selectedCharity) {
      setStatusMessage('Choose a charity from the list.');
      return;
    }

    setLoading(true);
    const data = await apiPut('/charity', {
      name: selectedCharity,
      donationPercentage: Number(donationPercentage)
    });
    setLoading(false);

    if (data.charity) {
      setUser({ ...user, charity: data.charity });
      setStatusMessage('Charity preferences saved.');
      return;
    }

    setStatusMessage(data.message || 'Unable to save charity preferences.');
  };

  return (
    <div className="bg-[#0A0F1C] min-h-screen text-white font-sans selection:bg-green-500/30">
      <Navbar />
      <main className="pt-24 pb-24">
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full bg-green-500/10 text-green-300 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em]">
                Charity selection
              </span>
              <h1 className="text-5xl font-bold tracking-tight">Support a cause while you play.</h1>
              <p className="text-gray-400 text-lg leading-8">
                GolfGive lets you direct a portion of your winnings to a vetted charity. Choose your partner, set your donation share, and make every draw meaningful.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={user ? '/dashboard' : '/login'}
                  className="inline-flex items-center justify-center rounded-full bg-green-500 px-8 py-4 text-sm font-semibold text-black transition hover:bg-green-400"
                >
                  {user ? 'Go to Dashboard' : 'Login to Save'}
                </Link>
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center justify-center rounded-full border border-gray-700 px-8 py-4 text-sm font-semibold text-white transition hover:border-green-500 hover:text-green-400"
                >
                  Learn how it works
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-black/20">
              <div className="mb-6">
                <p className="text-sm uppercase tracking-[0.24em] text-green-300">Your charity profile</p>
                <h2 className="text-3xl font-bold mt-2">Set your giving preferences</h2>
              </div>
              <div className="space-y-4">
                <div className="rounded-3xl bg-[#121827] p-6 border border-gray-800">
                  <p className="text-sm text-gray-400">Selected Charity</p>
                  <p className="text-xl font-semibold mt-2 text-white">{selectedCharity || 'Not set yet'}</p>
                </div>
                <div className="rounded-3xl bg-[#121827] p-6 border border-gray-800">
                  <p className="text-sm text-gray-400">Donation Percentage</p>
                  <p className="text-xl font-semibold mt-2 text-white">{donationPercentage}% of winnings</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.24em] text-green-300 mb-3">Choose from our partners</p>
            <h2 className="text-4xl font-bold">Our charities</h2>
            <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
              Explore trusted charities by category, search their mission, and select the one you want to support with your winnings.
            </p>
          </div>

          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeCategory === category ? 'bg-green-500 text-black' : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="w-full md:w-96">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search charities..."
                className="w-full rounded-3xl border border-gray-700 bg-[#0A0F1C] px-5 py-3 text-white outline-none focus:border-green-500"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredCharities.map((charity) => (
              <button
                key={charity.id}
                type="button"
                onClick={() => setSelectedCharity(charity.name)}
                className={`group text-left rounded-3xl border p-6 transition-all ${
                  charity.name === selectedCharity
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-white/10 bg-white/5 hover:border-green-500 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-green-300">
                    {charity.category}
                  </span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-green-300 transition group-hover:bg-green-500/15">
                    ♥
                  </span>
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-white">{charity.name}</h3>
                <p className="mt-4 text-gray-400 text-sm leading-relaxed">{charity.description}</p>
                <a
                  href={charity.website_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-green-300 hover:text-green-200"
                >
                  <span>Visit website</span>
                  <span>↗</span>
                </a>
              </button>
            ))}
          </div>

          {filteredCharities.length === 0 && (
            <div className="mt-12 rounded-3xl border border-gray-800 bg-[#111827] p-12 text-center text-gray-400">
              No charities match your search. Try another keyword or category.
            </div>
          )}

          <div className="mt-12 rounded-3xl border border-white/10 bg-[#111827] p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-2xl font-bold">Save your charity preference</h3>
                <p className="mt-2 text-gray-400">This setting will stay with your account until you change it.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <select
                  value={donationPercentage}
                  onChange={(e) => setDonationPercentage(e.target.value)}
                  className="rounded-2xl bg-[#0A0F1C] border border-gray-700 px-4 py-3 text-white outline-none"
                >
                  {[10, 15, 20, 25, 30, 40].map((percent) => (
                    <option key={percent} value={percent}>{percent}% of winnings</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  className="rounded-2xl bg-green-500 px-6 py-3 text-black font-semibold transition hover:bg-green-400 disabled:opacity-70"
                >
                  {loading ? 'Saving...' : 'Save charity'}
                </button>
              </div>
            </div>
            {statusMessage && (
              <div className="rounded-2xl bg-green-500/10 border border-green-500/20 p-4 text-green-200">
                {statusMessage}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CharitiesPage;
