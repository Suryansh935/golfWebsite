import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import StepCard from "../components/Home/StepCard";
import FeatureCard from "../components/Home/FeatureCard";
import Footer from "../components/Home/Footer";
import Navbar from "../components/Home/Navbar";
import PrizePool from "../components/Home/PrizePool";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleStartPlaying = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const handleLearnMore = () => {
    navigate('/how-it-works');
  };

  return (
    <div className="bg-[#0A0F1C] min-h-screen text-white font-sans selection:bg-green-500/30">

      <Navbar />

      {/* Adjust padding for fixed navbar */}
      <div className="pt-24">

        {/* HERO SECTION */}
        <section className="text-center py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#1A202C] border border-gray-800 rounded-full px-4 py-1.5 mb-8">
              <span className="text-sm text-green-400">✨ Monthly draws with massive prize pools</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Play Golf. <br />
              <span className="text-green-500">Give Back.</span> <br />
              Win Big.
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Subscribe, enter your golf scores, and compete in monthly draws. Winners choose how much goes to their favourite charity.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={handleStartPlaying} className="w-full sm:w-auto bg-green-500 hover:bg-green-400 text-[#0A0F1C] px-8 py-3.5 rounded-lg font-bold transition-all transform hover:scale-105">
                Start Playing →
              </button>
              <button onClick={handleLearnMore} className="w-full sm:w-auto bg-[#1A202C] hover:bg-[#2D3748] border border-gray-700 px-8 py-3.5 rounded-lg font-bold transition-all">
                Learn More
              </button>
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="bg-white/5 py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {[
                { label: "Prize Pool Monthly", value: "€50K+" },
                { label: "Charities Supported", value: "120+" },
                { label: "Active Members", value: "5,000+" },
                { label: "Donated to Date", value: "€200K+" },
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-4xl font-bold text-white">{stat.value}</p>
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY BIRDIE BOUNTY */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.24em] text-green-300">Powerful golf draws & meaningful giving</p>
              <h2 className="text-4xl font-bold text-white">A smarter way to play and give back every month.</h2>
              <p className="text-gray-400 text-lg leading-8 max-w-2xl">
                Birdie Bounty turns your rounds into a fair monthly draw, then lets you choose where your winnings help most.
                Built for golfers who want competition, community, and charity in one place.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <FeatureCard title="Score-driven draws" desc="Submit your latest rounds and compete for the prize pool each month." />
              <FeatureCard title="Charity first" desc="Choose a cause and decide how much of your winnings it receives." />
              <FeatureCard title="Transparent payouts" desc="See exactly how prize tiers are split and how winners are selected." />
              <FeatureCard title="Easy membership" desc="Subscribe once and stay eligible for every monthly draw." />
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-white">How It Works</h2>
            <p className="text-gray-400 mt-3 text-lg">Three simple steps to start winning and giving.</p>
          </div>
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <StepCard num="1" title="Enter Your Scores" desc="Submit your last 5 golf scores — these become your lucky numbers in the monthly draw." />
            <StepCard num="2" title="Win Big Prizes" desc="Match 3, 4, or all 5 numbers to win a share of the monthly prize pool." />
            <StepCard num="3" title="Give to Charity" desc="Choose your charity and decide how much of your winnings go to a great cause." />
          </div>
        </section>

        {/* PRIZE POOL */}
        <section className="bg-white/5 py-24 px-6">
          <div className="max-w-6xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-white">Prize Pool Breakdown</h2>
            <p className="text-gray-400 mt-3 text-lg">Every month the prize pool is split across three tiers.</p>
          </div>
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <PrizePool tier="5-Match" share="40%" highlight="bg-green-500" description="Top prize awarded to the closest match across all scores." />
            <PrizePool tier="4-Match" share="35%" highlight="bg-orange-400" description="Strong payouts for players with near-perfect matches." />
            <PrizePool tier="3-Match" share="25%" highlight="bg-slate-400" description="Smart returns for great rounds that still miss the top prizes." />
          </div>
        </section>

        {/* FOOTER CTA */}
        <section className="bg-[#0A0F1C] py-24 px-6 border-t border-white/10 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-gray-400 text-lg mb-10">Join thousands of golfers who play, win, and give back every month.</p>
          <button onClick={handleStartPlaying} className="bg-green-500 hover:bg-green-400 text-[#0A0F1C] px-12 py-4 rounded-lg font-bold text-lg transition-all shadow-lg shadow-green-500/20">
            Subscribe Now →
          </button>
        </section>

        <Footer />
      </div>
    </div>
  );
}

export default Home;