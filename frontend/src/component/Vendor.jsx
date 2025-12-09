import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import AgriMarketNavbar from "./Navbar.jsx";
import RecentActivity from "./VeRecent.jsx";
import { useAuthStore } from "../lib/store.js";
import Footer from "./Footer.jsx";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CHARTS = ["area", "line", "bar", "donut", "pie", "heatmap", "radialBar"];

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const { AuthUser, user_detail, overview_detail } = useAuthStore();
  const currYear = new Date().getFullYear();
  const currMonth = new Date().getMonth();

  const [year, setYear] = useState(currYear);
  const [period, setPeriod] = useState("3");
  const [chart, setChart] = useState("area");
  const [loading, setLoading] = useState(true);

  useEffect(() => { user_detail().finally(() => setLoading(false)); }, []);

  const stats = {
    active: overview_detail?.Active_Orders || 0,
    purchases: overview_detail?.Total_Purchases || 0,
    wishlist: overview_detail?.Wishlist_Items || 0,
    spent: overview_detail?.Total_Spent || 0
  };

  const years = useMemo(() => {
    let arr = [];
    for (let y = currYear; y >= 2024; y--) arr.push(y);
    return arr;
  }, [currYear]);

  const filtered = useMemo(() => {
    let spent = Array(12).fill(0);
    let items = Array(12).fill(0);
    
    let history = overview_detail?.Purchase_History || [];
    for (let i = 0; i < history.length; i++) {
      let item = history[i];
      if (item.status !== "completed") continue;
      let d = new Date(item.date);
      if (d.getFullYear() !== year) continue;
      let m = d.getMonth();
      spent[m] += item.amount || 0;
      items[m] += item.quantity || 1;
    }

    let n = parseInt(period);
    let end = year === currYear ? currMonth : 11;
    let start = n === 12 ? 0 : Math.max(0, end - n + 1);
    
    let months = MONTHS.slice(start, end + 1);
    let spentSlice = spent.slice(start, end + 1);
    let itemsSlice = items.slice(start, end + 1);
    
    let total = 0, totalItems = 0, max = 1;
    for (let i = 0; i < spentSlice.length; i++) {
      total += spentSlice[i];
      totalItems += itemsSlice[i];
      if (spentSlice[i] > max) max = spentSlice[i];
    }

    return { months, spent: spentSlice, items: itemsSlice, total, totalItems, max };
  }, [overview_detail, year, period, currYear, currMonth]);

  const isCircle = chart === "donut" || chart === "pie" || chart === "radialBar";

  const series = useMemo(() => {
    if (chart === "radialBar") {
      return filtered.spent.map(v => Math.round((v / filtered.max) * 100));
    }
    if (chart === "donut" || chart === "pie") {
      let hasData = filtered.spent.some(v => v > 0);
      return hasData ? filtered.spent : filtered.months.map(() => 0);
    }
    if (chart === "heatmap") {
      let data = [];
      for (let i = 0; i < filtered.months.length; i++) {
        data.push({ x: filtered.months[i], y: filtered.spent[i] });
      }
      return [{ name: "Spent", data }];
    }
    return [
      { name: "Spent (₹)", data: filtered.spent },
      { name: "Items (kg)", data: filtered.items }
    ];
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
        animations: { enabled: true, speed: 400 }
      },
      dataLabels: { enabled: false },
      legend: { position: isCircle ? "bottom" : "top", fontSize: "11px" },
      tooltip: { theme: "light" }
    };

    if (chart === "pie" || chart === "donut") {
      return {
        ...base,
        colors,
        labels: filtered.months,
        tooltip: { y: { formatter: v => "₹" + (v || 0).toLocaleString("en-IN") } },
        plotOptions: {
          pie: {
            donut: {
              size: "60%",
              labels: {
                show: chart === "donut",
                total: {
                  show: true,
                  label: "Total",
                  formatter: () => "₹" + filtered.total.toLocaleString("en-IN")
                }
              }
            }
          }
        }
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
              value: { fontSize: "13px", formatter: v => v + "%" },
              total: {
                show: true,
                label: "Avg",
                formatter: () => "₹" + Math.round(filtered.total / (filtered.months.length || 1)).toLocaleString("en-IN")
              }
            }
          }
        }
      };
    }

    if (chart === "heatmap") {
      return {
        ...base,
        colors: ["#16a34a"],
        dataLabels: {
          enabled: true,
          formatter: v => v >= 1000 ? "₹" + (v / 1000).toFixed(1) + "k" : "₹" + v,
          style: { fontSize: "9px", colors: ["#1f2937"] }
        },
        xaxis: { categories: filtered.months },
        plotOptions: {
          heatmap: {
            radius: 6,
            colorScale: {
              ranges: [
                { from: 0, to: filtered.max * 0.3, color: "#dcfce7" },
                { from: filtered.max * 0.3, to: filtered.max * 0.6, color: "#86efac" },
                { from: filtered.max * 0.6, to: filtered.max, color: "#16a34a" }
              ]
            }
          }
        }
      };
    }

    return {
      ...base,
      colors: ["#16a34a", "#a855f7"],
      stroke: {
        curve: "smooth",
        width: chart === "bar" ? 0 : (chart === "line" ? 3 : 2),
        dashArray: chart === "bar" ? 0 : [0, 4]
      },
      fill: {
        type: chart === "area" ? "gradient" : "solid",
        gradient: { shadeIntensity: 0.4, opacityFrom: 0.6, opacityTo: 0.1 }
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (v, opts) => {
            if (opts.seriesIndex === 0) return "₹" + (v || 0).toLocaleString("en-IN");
            return v + " kg";
          }
        }
      },
      grid: { borderColor: "#e5e7eb", strokeDashArray: 4 },
      xaxis: {
        categories: filtered.months,
        labels: { rotate: -45, style: { fontSize: "10px" } }
      },
      yaxis: [
        {
          title: { text: "Spent", style: { color: "#16a34a", fontSize: "11px" } },
          labels: {
            formatter: v => v >= 1000 ? "₹" + (v / 1000).toFixed(1) + "k" : "₹" + Math.round(v),
            style: { colors: "#16a34a" }
          },
          min: 0
        },
        { opposite: true, show: false, min: 0 }
      ],
      plotOptions: {
        bar: { columnWidth: "50%", borderRadius: 4 }
      },
      markers: { size: chart === "line" ? 4 : 0 }
    };
  }, [chart, filtered, isCircle]);

  const download = () => {
    let csv = "Month,Spent,Items (in kg)\n";
    for (let i = 0; i < filtered.months.length; i++) {
      csv += filtered.months[i] + "," + filtered.spent[i] + "," + filtered.items[i] + "\n";
    }
    csv += "\nTOTAL," + filtered.total + "," + filtered.totalItems;
    
    let a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "purchases_" + year + ".csv";
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
    { icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z", val: stats.active, label: "Active Orders", c: "green" },
    { icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z", val: stats.purchases + " kg", label: "Purchase", c: "blue" },
    { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 10v1", val: "₹" + stats.spent.toLocaleString("en-IN"), label: "Total Spent", c: "purple" }
  ];

  let actionBtns = [
    { label: "Browse", path: "/Product", bg: "bg-green-600 hover:bg-green-700 text-white", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
    { label: "Orders", path: "/MyOrder", bg: "bg-blue-600 hover:bg-blue-700 text-white", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { label: "Messages", path: "/chat", bg: "bg-gray-100 hover:bg-gray-200 text-gray-800", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
    { label: "Track", path: "/track", bg: "bg-gray-100 hover:bg-gray-200 text-gray-800", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" },
  ];

  let maxSpent = Math.max(...filtered.spent);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
      <AgriMarketNavbar />
      <style>{`.apexcharts-toolbar,.apexcharts-legend{z-index:10!important}.apexcharts-tooltip,.apexcharts-menu{z-index:999!important}`}</style>

      <main className="max-w-6xl mx-auto py-6 px-4 md:px-6 space-y-6">
        
        <div className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold border border-green-200 overflow-hidden">
              {AuthUser?.profile_pic 
                ? <img src={AuthUser.profile_pic} className="w-full h-full object-cover" alt="" /> 
                : AuthUser?.name?.[0]?.toUpperCase()
              }
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Welcome, {AuthUser?.name}!</h1>
              <p className="text-sm text-gray-500">{stats.active} active • ₹{stats.spent.toLocaleString("en-IN")} spent</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full border border-green-200 w-fit">BUYER</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {statCards.map((s, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border p-4 text-center hover:shadow-md transition">
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

        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="font-semibold text-gray-800">Spending Overview</h3>
              <p className="text-sm text-gray-500">{filtered.months[0]} - {filtered.months[filtered.months.length - 1]} {year}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <select value={period} onChange={e => setPeriod(e.target.value)} className="px-3 py-1.5 border rounded-lg text-sm bg-gray-50">
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="12">Full Year</option>
              </select>
              <select value={year} onChange={e => setYear(parseInt(e.target.value))} className="px-3 py-1.5 border rounded-lg text-sm bg-gray-50">
                {years.map(y => <option key={y} value={y}>{y}</option>)}
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
              <b className="text-green-600">₹{filtered.total.toLocaleString("en-IN")}</b>
            </span>
            <span className="flex items-center gap-1.5 px-2 py-1 bg-purple-50 rounded border border-purple-100">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <b className="text-purple-600">{filtered.totalItems}</b> Items (in kg)
            </span>
          </div>

          <div className="px-3 py-2 bg-gray-50 border-b overflow-x-auto">
            <div className="flex gap-1.5">
              {CHARTS.map(t => (
                <button 
                  key={t} 
                  onClick={() => setChart(t)} 
                  className={`px-3 py-1 rounded text-xs font-medium capitalize ${chart === t ? "bg-green-600 text-white" : "bg-white border text-gray-600 hover:bg-gray-100"}`}
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

          <div className="px-4 pb-4">
            <div className="border rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b text-sm font-semibold text-gray-700">Monthly Breakdown</div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-600">Month</th>
                    <th className="px-4 py-2 text-right text-green-600">Spent</th>
                    <th className="px-4 py-2 text-right text-purple-600">Items (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.months.map((m, i) => (
                    <tr key={m} className={`border-t hover:bg-gray-50 ${filtered.spent[i] === maxSpent && filtered.spent[i] > 0 ? "bg-green-50/50" : ""}`}>
                      <td className="px-4 py-2 font-medium">{m}</td>
                      <td className="px-4 py-2 text-right text-green-600">
                        {filtered.spent[i] > 0 ? "₹" + filtered.spent[i].toLocaleString("en-IN") : "—"}
                      </td>
                      <td className="px-4 py-2 text-right text-purple-600">
                        {filtered.items[i] > 0 ? filtered.items[i] : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 font-semibold">
                  <tr className="border-t">
                    <td className="px-4 py-2">Total</td>
                    <td className="px-4 py-2 text-right text-green-600">₹{filtered.total.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-2 text-right text-purple-600">{filtered.totalItems}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {actionBtns.map((btn, i) => (
              <button 
                key={i} 
                onClick={() => navigate(btn.path)} 
                className={`${btn.bg} font-semibold py-5 rounded-lg flex flex-col items-center gap-1 text-xs transition`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={btn.icon} />
                </svg>
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      <Footer />
      </main>
    </div>
  );
}