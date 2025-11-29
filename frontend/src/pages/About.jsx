import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiTruck,
  FiUsers,
  FiGlobe,
  FiGithub,
} from "react-icons/fi";

const contributors = [
  // 👉 Add / edit your contributors here
  {
    name: "Jitendra Prajapati",
    role: "Project Developer & Full stack dev",
    github: "https://github.com/Jitendra-2848",
  },
  {
    name: "Devansh",
    role: "backend devloper",
    github: "https://github.com/LegenD742",
  },
  {
    name: "Disha",
    role: "Frontend dev",
    github: "https://github.com/contributor-github",
  },
  {
    name: "Sania",
    role: "Frontend dev",
    github: "https://github.com/Saniahyd1/",
  },
  {
    name: "Sumit",
    role: "Frontend dev",
    github: "https://github.com/contributor-github",
  },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar / Back */}
      <div className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-green-700"
          >
            <FiArrowLeft /> Back
          </button>
          <span className="text-xs md:text-sm text-gray-400">
            Agrinova · Unified Agri Marketplace
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* Hero Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              About <span className="text-green-600">Agrinova</span>
            </h1>
            <p className="text-gray-700 text-base md:text-lg">
              Agrinova is a unified, professional marketplace for agriculture
              where{" "}
              <span className="font-semibold">
                Farmers, Vendors/Buyers, and Transporters
              </span>{" "}
              work together on a single platform. No separate websites, no
              disconnected apps – everything from listing produce to delivering
              it is managed inside Agrinova, with real‑time visibility for every
              party.
            </p>
            <p className="text-gray-700">
              Our goal is to make agricultural trade simple, transparent, and
              efficient by connecting all three entities on one system and
              giving them clear tools to do their work.
            </p>
          </div>

          <div className="w-full md:w-72">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl text-white p-5 shadow-md h-full flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <FiTruck size={22} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/80">
                    Transport Partner
                  </p>
                  <p className="text-lg font-bold">
                    GreenLogistic Express
                  </p>
                </div>
              </div>
              <p className="text-sm text-white/90">
                GreenLogistic Express powers Agrinova’s transport layer, moving
                produce reliably from farms to markets while keeping every
                shipment visible in real time.
              </p>
            </div>
          </div>
        </section>

        {/* Core Concept */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            One Platform · Three Roles · Real‑Time Visibility
          </h2>
          <p className="text-gray-700">
            Agrinova is built around a very clear idea: all core players in the
            agricultural chain should be able to work in the{" "}
            <span className="font-semibold">same system</span>. Instead of a
            farmer using one app, a buyer using another, and a transporter
            coordinating over phone calls, Agrinova gives everyone a shared,
            professional workspace.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
            {/* Farmer Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Farmers
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                Farmers list their crops, set quantities and pickup locations,
                and see which buyers are interested in their produce.
              </p>
              <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
                <li>List produce from any location.</li>
                <li>See confirmed orders and pickups.</li>
                <li>Know which transporter is assigned.</li>
              </ul>
            </div>

            {/* Vendor / Buyer Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Vendors & Buyers
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                Vendors and buyers discover produce, place orders, and track
                deliveries without leaving the platform.
              </p>
              <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
                <li>Search verified produce listings.</li>
                <li>Place and manage purchase orders.</li>
                <li>Track shipments using tracking IDs.</li>
              </ul>
            </div>

            {/* Transporter Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Transporters
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                Transporters like{" "}
                <span className="font-semibold">
                  GreenLogistic Express
                </span>{" "}
                see available loads, accept jobs, update locations, and confirm
                deliveries.
              </p>
              <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
                <li>View and accept transport jobs.</li>
                <li>Update live location by pincode.</li>
                <li>Mark orders as delivered at destination.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Real-Time Experience */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">
            Real‑Time Tracking & Status Updates
          </h2>
          <p className="text-gray-700">
            Every order in Agrinova is assigned a unique{" "}
            <span className="font-mono text-sm bg-gray-100 px-1 py-0.5 rounded">
              tracking_id
            </span>
            . This ID ties together:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
            <li>The farmer who created the listing.</li>
            <li>The buyer who placed the order.</li>
            <li>The transporter responsible for the delivery.</li>
            <li>The current location and delivery status.</li>
          </ul>
          <p className="text-gray-700">
            As the transporter moves, they update the current{" "}
            <span className="font-mono text-sm bg-gray-100 px-1 py-0.5 rounded">
              reached
            </span>{" "}
            pincode. Agrinova compares this with the destination pincode to
            decide when an order is truly deliverable. Only when the shipment
            reaches the correct delivery zone can it be marked as{" "}
            <span className="font-semibold">Delivered</span>. This ensures that
            everyone trusts the status they see on the platform.
          </p>
        </section>

        {/* One Platform Benefits */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">
            Why a Single Platform Matters
          </h2>
          <p className="text-gray-700">
            Running agriculture on separate tools creates gaps: messages are
            lost, status is unclear, and accountability is weak. Agrinova
            solves this by bringing everything together:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="font-semibold mb-1">Operational Clarity</p>
              <p>
                At any moment, you can answer three questions: Where is this
                order? Who is responsible right now? What happens next?
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="font-semibold mb-1">No Multiple Systems</p>
              <p>
                Farmers, buyers, and transporters use the same platform with
                role‑based views — no second website or hidden spreadsheets.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="font-semibold mb-1">End‑to‑End Traceability</p>
              <p>
                From listing to delivery, every state change is recorded:
                Pending → Shipping → Delivered, with live pincodes in between.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="font-semibold mb-1">Professional Experience</p>
              <p>
                Agrinova feels like a modern B2B marketplace, but stays simple
                enough to be used daily in real agri operations.
              </p>
            </div>
          </div>
        </section>

        {/* Contributors Section */}
        <section className="space-y-4 pb-10">
          <div className="flex items-center gap-2">
            <FiUsers className="text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Contributors
            </h2>
          </div>
          <p className="text-gray-700 text-sm">
            Agrinova is actively built and improved by a small, focused team.
            Below are key contributors to the platform. If you would like to
            contribute to the project, feel free to explore their work and
            reach out.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {contributors.map((person) => (
              <div
                key={person.github}
                className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {person.name}
                  </p>
                  <p className="text-xs text-gray-500">{person.role}</p>
                </div>
                <a
                  href={person.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-green-700"
                >
                  <FiGithub /> GitHub
                </a>
              </div>
            ))}
          </div>

          <div className="mt-4 text-xs text-gray-400 flex items-center gap-1">
            <FiGlobe />
            <span>Agrinova · GreenLogistic Express · Unified Agri Marketplace</span>
          </div>
            <p>💠 Project with TEN Tech</p>
        </section>
      </div>
    </div>
  );
};

export default About;