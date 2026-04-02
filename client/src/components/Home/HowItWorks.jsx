import StepCard from "./StepCard";

import React from 'react'




const HowItWorks = () => {
  return (
    <section className="bg-gray-50 py-24 px-6">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900">How It Works</h2>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        <StepCard num="1" title="Enter Scores" desc="Submit golf scores." />
        <StepCard num="2" title="Win Prizes" desc="Match and win." />
        <StepCard num="3" title="Give Back" desc="Donate to charity." />
      </div>
    </section>
  );
};

export default HowItWorks;