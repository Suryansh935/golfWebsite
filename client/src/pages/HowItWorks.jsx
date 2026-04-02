import React from "react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import StepCard from "../components/Home/StepCard";

const HowItWorksPage = () => {
  return (
    <div className="bg-[#0A0F1C] min-h-screen text-white font-sans selection:bg-green-500/30">
      <Navbar />
      <div className="pt-24">
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <span className="inline-flex rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-green-300">
              How it works
            </span>
            <h1 className="mt-6 text-5xl font-bold tracking-tight">Play smarter, win bigger, give back.</h1>
            <p className="mx-auto mt-5 max-w-2xl text-gray-400 text-lg leading-8">
              Birdie Bounty turns your golf scores into a chance at monthly prize pools while letting you direct winnings to charity.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <StepCard
              num="1"
              title="Enter Your Scores"
              desc="Add your latest round scores and build your entry for the monthly draw."
            />
            <StepCard
              num="2"
              title="Win Prize Pools"
              desc="Match the draw numbers and win a share of the pool with every monthly draw."
            />
            <StepCard
              num="3"
              title="Choose a Charity"
              desc="Designate a charity and decide how much of your winnings go to a cause you care about."
            />
          </div>
        </section>

        <section className="bg-white/5 py-20 px-6">
          <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.24em] text-green-300">Why Birdie Bounty?</p>
              <h2 className="text-4xl font-bold">A better way to play golf and give back.</h2>
              <p className="text-gray-400 leading-8">
                Our platform combines friendly competition with meaningful giving. Every month, players enter with scores, compete for prizes,
                and choose a charity to support with their winnings.
              </p>
            </div>
            <div className="rounded-3xl bg-[#111827] p-10 border border-white/10 shadow-xl shadow-black/30">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold">Monthly Draws</h3>
                  <p className="text-gray-400 mt-3">Your last five scores become your entry. Better scores improve your odds.</p>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold">Charity Choice</h3>
                  <p className="text-gray-400 mt-3">Pick your favourite charity and set the donation share from your winnings.</p>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold">Simple Subscription</h3>
                  <p className="text-gray-400 mt-3">Activate your plan to submit scores and stay eligible for draws every month.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default HowItWorksPage;
