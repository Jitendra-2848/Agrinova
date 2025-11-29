import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import AgriMarketNavbar from "./Navbar";
import Recent from "./FaRecent.jsx";
import { useAuthStore } from "../lib/store.js";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
const CHARTS = ["area", "line", "bar", "donut", "pie", "heatmap", "radialBar"];

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const { AuthUser, user_detail, overview_detail } = useAuthStore();
  const currYear = new Date().getFullYear();
  const currMonth = new Date().getMonth();

  const [year, setYear] = useState(currYear);
  const [period, setPeriod] = useState("3");
  const [chart, setChart] = useState("area");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    user_detail().finally(() => setLoading(false));
  }, []);

  const totalRevenue = overview_detail?.Total_Revenue || 0;

// FIXED: Correct monthly growth % calculation
const monthlyHistory = overview_detail?.Monthly_Sales_History || [];
const currentMonthData = monthlyHistory[monthlyHistory.length - 1];
const previousMonthData = monthlyHistory[monthlyHistory.length - 2];

const currentRevenue = currentMonthData?.revenue || 0;
const previousRevenue = previousMonthData?.revenue || 0;

// Correct growth calculation
let monthlyGrowth = 0;

if (previousRevenue === 0) {
  // If previous month was 0, growth = current revenue as %
  // 0 → 1600 = +1600%
  // 0 → 500 = +500%
  // 0 → 0 = 0%
  monthlyGrowth = currentRevenue;
} else {
  // Normal calculation: (current - previous) / previous * 100
  // 1600 → 2400 = +50%
  // 1600 → 800 = -50%
  // 1600 → 0 = -100%
  monthlyGrowth = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
}

const stats = {
  activeDelivery: overview_detail?.Active_Crops || 0,
  totalRevenue: totalRevenue,
  productsListed: overview_detail?.Products_listed || 0,
  monthSales: monthlyGrowth.toFixed(0),
};

const years = useMemo(() => {
  let arr = [];
  for (let y = currYear; y >= 2024; y--) arr.push(y);
  return arr;
}, [currYear]);

const filtered = useMemo(() => {
  let n = parseInt(period);
  let end = year === currYear ? currMonth : 11;
  let start = n === 12 ? 0 : Math.max(0, end - n + 1);

  let months = MONTHS.slice(start, end + 1);
  let revenue = Array(months.length).fill(0);

  if (year === currYear && months.length > 0) {
    let idx = months.length - 1;
    revenue[idx] = totalRevenue;
  } else if (year < currYear && months.length > 0) {
    revenue[months.length - 1] = totalRevenue;
  }

  let total = totalRevenue;
  let max = Math.max(...revenue, 1);

  return { months, revenue, total, max };
}, [period, year, currYear, currMonth, totalRevenue]);
  const isCircle = chart === "donut" || chart === "pie" || chart === "radialBar";

  const series = useMemo(() => {
    if (chart === "radialBar")
      return filtered.revenue.map((v) => Math.round((v / filtered.max) * 100));
    if (chart === "donut" || chart === "pie") {
      return filtered.total > 0 ? [filtered.total] : [0];
    }
    if (chart === "heatmap") {
      let data = [];
      for (let i = 0; i < filtered.months.length; i++) {
        data.push({ x: filtered.months[i], y: filtered.revenue[i] });
      }
      return [{ name: "Revenue", data }];
    }
    return [{ name: "Revenue (₹)", data: filtered.revenue }];
  }, [chart, filtered]);

  const options = useMemo(() => {
    let colors = [];
    for (let i = 0; i < filtered.months.length; i++) {
      colors.push(`hsl(${140 + i * 18}, 60%, ${45 + i * 3}%)`);
    }

    let base = {
      chart: {
        type: chart,
        height: isCircle ? 380 : 360,
        fontFamily: "inherit",
        background: "transparent",
        toolbar: { show: true, tools: { download: true, zoom: true, reset: true } },
        animations: { enabled: true, speed: 400 },
      },
      dataLabels: { enabled: false },
      legend: { position: isCircle ? "bottom" : "top", fontSize: "11px" },
      tooltip: { theme: "light" },
    };

    if (chart === "pie" || chart === "donut") {
      return {
        ...base,
        colors: ["#16a34a"],
        labels: ["Total Revenue"],
        tooltip: { y: { formatter: (v) => "₹" + (v || 0).toLocaleString("en-IN") } },
        plotOptions: {
          pie: {
            donut: {
              size: "60%",
              labels: {
                show: chart === "donut",
                total: {
                  show: true,
                  label: "Total",
                  formatter: () => "₹" + filtered.total.toLocaleString("en-IN"),
                },
              },
            },
          },
        },
      };
    }

    if (chart === "radialBar") {
      return {
        ...base,
        colors,
        labels: filtered.months,
        plotOptions: {
          radialBar: {
            hollow: { size: "30%" },
            track: { background: "#f3f4f6" },
            dataLabels: {
              name: { fontSize: "11px" },
              value: { fontSize: "13px", formatter: (v) => v + "%" },
              total: {
                show: true,
                label: "Total",
                formatter: () => "₹" + filtered.total.toLocaleString("en-IN"),
              },
            },
          },
        },
      };
    }

    if (chart === "heatmap") {
      return {
        ...base,
        colors: ["#16a34a"],
        dataLabels: {
          enabled: true,
          formatter: (v) => v >= 1000 ? "₹" + (v / 1000).toFixed(1) + "k" : "₹" + v,
          style: { fontSize: "9px", colors: ["#1f2937"] },
        },
        xaxis: { categories: filtered.months },
        plotOptions: {
          heatmap: {
            radius: 6,
            colorScale: {
              ranges: [
                { from: 0, to: filtered.max * 0.3, color: "#dcfce7" },
                { from: filtered.max * 0.3, to: filtered.max * 0.6, color: "#86efac" },
                { from: filtered.max * 0.6, to: filtered.max, color: "#16a34a" },
              ],
            },
          },
        },
      };
    }

    return {
      ...base,
      colors: ["#16a34a"],
      stroke: { curve: "smooth", width: chart === "bar" ? 0 : 3 },
      fill: {
        type: chart === "area" ? "gradient" : "solid",
        gradient: { shadeIntensity: 0.4, opacityFrom: 0.6, opacityTo: 0.1 },
      },
      tooltip: { y: { formatter: (v) => "₹" + (v || 0).toLocaleString("en-IN") } },
      grid: { borderColor: "#e5e7eb", strokeDashArray: 4 },
      xaxis: {
        categories: filtered.months,
        labels: { rotate: -45, style: { fontSize: "10px" } },
      },
      yaxis: {
        title: { text: "Revenue", style: { color: "#16a34a", fontSize: "11px" } },
        labels: {
          formatter: (v) => v >= 1000 ? "₹" + (v / 1000).toFixed(1) + "k" : "₹" + Math.round(v),
          style: { colors: "#16a34a" },
        },
        min: 0,
      },
      plotOptions: { bar: { columnWidth: "50%", borderRadius: 4 } },
      markers: { size: chart === "line" ? 4 : 0 },
    };
  }, [chart, filtered, isCircle]);

  const download = () => {
    let csv = "Month,Revenue\n";
    for (let i = 0; i < filtered.months.length; i++) {
      csv += filtered.months[i] + "," + filtered.revenue[i] + "\n";
    }
    csv += "\nTOTAL," + filtered.total;
    let a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "revenue_" + year + ".csv";
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-50">
        <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  let statCards = [
    {
      icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0",
      val: stats.activeDelivery,
      label: "Active Delivery",
      c: "green",
    },
    {
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 10v1",
      val: "₹" + stats.totalRevenue.toLocaleString("en-IN"),
      label: "Total Revenue",
      c: "emerald",
    },
    {
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
      val: stats.productsListed,
      label: "Products Listed",
      c: "orange",
    },
    {
      icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
      val: monthlyGrowth >= 0 ? `+${monthlyGrowth.toFixed(0)}%` : `${monthlyGrowth.toFixed(0)}%`,
      label: "This Month Growth",
      c: monthlyGrowth >= 0 ? "green" : "red",
    },
  ];

  let actionBtns = [
    { label: "Add Product", path: "/addProduct", bg: "bg-green-600 hover:bg-green-700 text-white", icon: "M12 4v16m8-8H4" },
    { label: "Inventory", path: "/manage", bg: "bg-emerald-500 hover:bg-emerald-600 text-white", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    { label: "Shipments", path: "/track", bg: "bg-gray-100 hover:bg-gray-200 text-gray-800", icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" },
    { label: "Messages", path: "/chat", bg: "bg-gray-100 hover:bg-gray-200 text-gray-800", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
    { label: "Orders", path: "/Order", bg: "bg-gray-100 hover:bg-gray-200 text-gray-800", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { label: "Settings", path: "/settings", bg: "bg-gray-100 hover:bg-gray-200 text-gray-800", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
  ];
  console.log(stats)
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
      <AgriMarketNavbar />
      <style>{`.apexcharts-toolbar,.apexcharts-legend{z-index:10!important}.apexcharts-tooltip,.apexcharts-menu{z-index:999!important}`}</style>

      <main className="max-w-6xl mx-auto py-6 px-4 md:px-6 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold border border-green-200 overflow-hidden">
              {AuthUser?.profile_pic ? (
                <img src={AuthUser.profile_pic} className="w-full h-full object-cover" alt="" />
              ) : (
                AuthUser?.name?.[0]?.toUpperCase()
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Welcome back, {AuthUser?.name}!
              </h1>
              <p className="text-sm text-gray-500">
                Here's what's happening with your farm today.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full border border-green-200 w-fit">
            FARMER
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {statCards.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border p-4 text-center hover:shadow-md transition"
            >
              <div className={`bg-${s.c}-50 text-${s.c}-600 p-2.5 rounded-full w-fit mx-auto mb-2`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                </svg>
              </div>
              <div className="text-xl font-bold text-gray-900">{s.val}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Rest of your chart and UI stays 100% same */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="font-semibold text-gray-800">Revenue Overview</h3>
              <p className="text-sm text-gray-500">
                {filtered.months[0]} - {filtered.months[filtered.months.length - 1]} {year}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <select value={period} onChange={(e) => setPeriod(e.target.value)} className="px-3 py-1.5 border rounded-lg text-sm bg-gray-50">
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="12">Full Year</option>
              </select>
              <select value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="px-3 py-1.5 border rounded-lg text-sm bg-gray-50">
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <button onClick={download} className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex gap-3 p-3 bg-gray-50 border-b text-sm">
            <span className="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded border border-green-100">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <b className="text-green-600">₹{filtered.total.toLocaleString("en-IN")}</b> Total Revenue
            </span>
          </div>

          <div className="px-3 py-2 bg-gray-50 border-b overflow-x-auto">
            <div className="flex gap-1.5">
              {CHARTS.map((t) => (
                <button
                  key={t}
                  onClick={() => setChart(t)}
                  className={`px-3 py-1 rounded text-xs font-medium capitalize ${
                    chart === t
                      ? "bg-green-600 text-white"
                      : "bg-white border text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4" style={{ minHeight: 400 }}>
            <ReactApexChart
              key={chart + "-" + period + "-" + year}
              options={options}
              series={series}
              type={chart}
              height={isCircle ? 380 : 360}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {actionBtns.map((btn, i) => (
              <button
                key={i}
                onClick={() => navigate(btn.path)}
                className={`${btn.bg} font-semibold py-3 rounded-lg flex flex-col items-center gap-1 text-xs transition`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={btn.icon} />
                </svg>
                {btn.label}
              </button>
            ))}
          </div>
        </div>
        <Recent />
      </main>
    </div>
  );
};

export default FarmerDashboard;