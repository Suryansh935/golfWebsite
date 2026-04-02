import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { apiGet } from "../utils/api";

const Explore = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      const data = await apiGet('/results');
      if (data.results) {
        setResults(data.results);
      }
      setLoading(false);
    };

    fetchResults();
  }, []);

  return (
    <div className="bg-[#0A0F1C] min-h-screen text-white font-sans selection:bg-green-500/30">
      <Navbar />
      <main className="pt-24 pb-24">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-xl shadow-black/20">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.28em] text-green-300">Explore</p>
              <h1 className="mt-4 text-5xl font-bold">Latest draws and leaderboard insights</h1>
              <p className="mt-5 text-gray-400 leading-8 text-lg">
                Discover recent monthly draw results, check how prize tiers are distributed, and see which charities earned support.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center rounded-full bg-green-500 px-8 py-4 text-sm font-semibold text-black transition hover:bg-green-400"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/subscribe"
                  className="inline-flex items-center justify-center rounded-full border border-gray-700 px-8 py-4 text-sm font-semibold text-white transition hover:border-green-500 hover:text-green-400"
                >
                  Subscribe Now
                </Link>
              </div>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            <StatCard title="Total draws" value={results.length || "0"} />
            <StatCard title="Active members" value="5,000+" />
            <StatCard title="Charities supported" value="120+" />
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-xl shadow-black/20">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold">Recent draw results</h2>
                <p className="mt-2 text-gray-400">Latest prize numbers and how many participants matched.</p>
              </div>
            </div>
            {loading ? (
              <div className="rounded-3xl bg-[#111827] p-10 text-center text-gray-400">Loading draw results...</div>
            ) : results.length === 0 ? (
              <div className="rounded-3xl bg-[#111827] p-10 text-center text-gray-400">No draw results are available yet.</div>
            ) : (
              <div className="space-y-6">
                {results.map((result) => (
                  <div key={result._id} className="rounded-3xl border border-gray-800 bg-[#111827] p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="text-sm uppercase tracking-[0.24em] text-gray-400">Draw</div>
                        <div className="mt-2 text-xl font-semibold text-white">{new Date(result.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-200">
                        {result.drawNumbers.join(' • ')}
                      </div>
                    </div>
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      <ResultStat label="Matched users" value={result.userMatches.filter((item) => item.matches > 0).length} />
                      <ResultStat label="Total numbers" value={result.drawNumbers.length} />
                      <ResultStat label="Prize tier" value={result.drawNumbers.length === 5 ? 'Jackpot' : 'Tiered'} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="rounded-3xl border border-gray-800 bg-[#111827] p-8 text-center">
    <p className="text-sm uppercase tracking-[0.24em] text-green-300">{title}</p>
    <div className="mt-4 text-4xl font-bold text-white">{value}</div>
  </div>
);

const ResultStat = ({ label, value }) => (
  <div className="rounded-3xl bg-[#0A101D] p-5 text-center border border-gray-800">
    <p className="text-sm text-gray-400">{label}</p>
    <p className="mt-3 text-xl font-semibold text-white">{value}</p>
  </div>
);

export default Explore;
