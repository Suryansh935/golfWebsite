import React from 'react'

const Hero = () => {
  return (
    <section className="pt-32 pb-24 px-6 text-center">
      <div className="max-w-4xl mx-auto">

        <div className="inline-block bg-[#1A202C] border border-gray-800 rounded-full px-4 py-1.5 mb-8">
          <span className="text-sm text-green-400">
            ✨ Monthly draws with massive prize pools
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          Play Golf. <br />
          <span className="text-green-500">Give Back.</span> <br />
          Win Big.
        </h1>

        <p className="text-gray-400 text-lg mt-6 max-w-2xl mx-auto">
          Subscribe, enter your golf scores, and compete in monthly draws.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-green-500 text-black px-8 py-3 rounded-lg font-semibold">
            Start Playing →
          </button>
          <button className="bg-[#1A202C] border border-gray-700 px-8 py-3 rounded-lg">
            Learn More
          </button>
        </div>

      </div>
    </section>
  );
};

export default Hero;
