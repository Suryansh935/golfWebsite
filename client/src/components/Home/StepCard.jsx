import React from 'react'

function StepCard({ num, title, desc }) {
  return (
    <div className="bg-white/5 p-10 rounded-2xl border border-white/10 backdrop-blur-md shadow-sm hover:shadow-md transition">
      <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center font-bold mb-6 text-sm">
        {num}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}

export default StepCard;

