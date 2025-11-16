import React from 'react'

const Services = () => {
  const services = [
    {
      title: "Trusted Sellers",
      desc: "Sell your crops directly to vendors at fair prices, eliminating middlemen and maximizing your profit.",
      icon: "🌾",
    },
    {
      title: "Quality Assurance",
      desc: "All crops are verified for freshness and quality by our certified inspection team.",
      icon: "✅",
    },
    {
      title: "Secure Payments",
      desc: "Receive payments instantly and securely through our verified payment gateway.",
      icon: "🔒",
    },
    {
      title: "Fast Delivery",
      desc: "Reliable logistics ensure your crops reach buyers quickly and safely.",
      icon: "🚚",
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-orange-800 mb-10">
          Our Core Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl shadow-md bg-white/70 backdrop-blur-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-green-100"
            >
              <div className="text-4xl mb-4">{s.icon}</div>
              <h3 className="text-xl font-semibold text-orange-700 mb-2">
                {s.title}
              </h3>
              <p className="text-gray-600 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
);
}

export default Services
