import React from 'react'

function PrizePool({ tier, share, highlight, description, text = "text-white" }) {
  return (
    <div className="bg-white/5 p-10 rounded-2xl border border-white/10 text-center backdrop-blur-md">
      <div className={`${highlight} ${text} w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-8 shadow-inner`}>
        {share}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{tier}</h3>
      <p className="text-gray-400 leading-relaxed px-4">{description}</p>
    </div>
  );
}

export default PrizePool;
