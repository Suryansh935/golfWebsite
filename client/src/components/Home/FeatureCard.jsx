import React from 'react'
function FeatureCard({ title, desc }) {
  return (
    <div className="bg-white/5 p-10 rounded-2xl border border-white/10 text-center backdrop-blur-md shadow-sm hover:shadow-md transition">
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}

export default FeatureCard;