import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { apiPost } from "../utils/api";

const SubscribePage = () => {
  const [subscriptionType, setSubscriptionType] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    setMessage("");
    setLoading(true);

    const data = await apiPost("/payments/create-session", {
      subscriptionType,
    });

    setLoading(false);

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    setMessage(data.message || "Unable to start checkout.");
  };

  return (
    <div className="bg-[#0A0F1C] min-h-screen text-white font-sans selection:bg-green-500/30">
      <Navbar />
      <main className="pt-24 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-xl shadow-black/20">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_0.95fr] items-start">
              <div className="space-y-6">
                <p className="text-xs uppercase tracking-[0.28em] text-green-300">Subscription</p>
                <h1 className="text-5xl font-bold">Choose a plan and unlock draws.</h1>
                <p className="text-gray-400 text-lg leading-8">
                  Subscribe to Birdie Bounty to submit scores, enter monthly prize draws, and donate part of your winnings to charity.
                </p>
                <div className="rounded-3xl border border-gray-800 bg-[#111827] p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-green-300">Why subscribe?</p>
                  <ul className="mt-4 space-y-3 text-gray-400 text-sm">
                    <li>• Submit up to 5 scores each month</li>
                    <li>• Stay eligible for every monthly draw</li>
                    <li>• Set your charity preference and donation rate</li>
                    <li>• Track results and prizes from the dashboard</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-[#0F172A] p-8">
                <div className="mb-8">
                  <p className="text-sm uppercase tracking-[0.24em] text-green-300">Pick your plan</p>
                  <div className="mt-6 grid gap-4">
                    {[
                      { key: "monthly", title: "Monthly", price: "£9.99", description: "Billed every month." },
                      { key: "yearly", title: "Yearly", price: "£89.99", description: "Save 25% with annual billing." },
                    ].map((plan) => (
                      <button
                        key={plan.key}
                        type="button"
                        onClick={() => setSubscriptionType(plan.key)}
                        className={`w-full rounded-3xl border p-6 text-left transition ${
                          subscriptionType === plan.key ? "border-green-500 bg-green-500/10" : "border-white/10 bg-white/5 hover:border-green-500/40"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <h2 className="text-xl font-semibold text-white">{plan.title}</h2>
                            <p className="mt-2 text-gray-400">{plan.description}</p>
                          </div>
                          <div className="text-3xl font-bold text-white">{plan.price}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="w-full rounded-3xl bg-green-500 px-6 py-4 text-lg font-bold text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? "Starting checkout..." : "Proceed to Checkout"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="w-full rounded-3xl border border-gray-700 bg-[#0A0F1C] px-6 py-4 text-sm font-semibold text-white transition hover:border-green-500"
                  >
                    Back to Dashboard
                  </button>
                </div>

                {message && (
                  <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                    {message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubscribePage;
