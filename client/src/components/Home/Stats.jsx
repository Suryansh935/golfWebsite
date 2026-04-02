import React from 'react'


const stats = [
  { label: "Prize Pool Monthly", value: "€50K+" },
  { label: "Charities Supported", value: "120+" },
  { label: "Active Members", value: "5,000+" },
  { label: "Donated to Date", value: "€200K+" },
];

const Stats = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center px-6">
        {stats.map((s, i) => (
          <div key={i}>
            <h2 className="text-4xl font-bold text-gray-900">{s.value}</h2>
            <p className="text-gray-500 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;