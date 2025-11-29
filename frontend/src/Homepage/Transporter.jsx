import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import AgriMarketNavbar from "./Navbar";
import RecentActivity from "./Recent";
import { useAuthStore } from "../lib/store";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const COLORS = { earnings: "#16a34a", orders: "#3b82f6", distance: "#f59e0b" };
const CHARTS = ["area", "line", "bar", "donut", "pie", "heatmap", "radialBar"];

export default function DashboardMain() {
  const navigate = useNavigate();
  const { AuthUser, user_detail, overview_detail } = useAuthStore();

  const now = new Date();
  const currYear = now.getFullYear();
  const currMonth = now.getMonth();

  const [year, setYear] = useState(currYear);
  const [period, setPeriod] = useState("3");
  const [chart, setChart] = useState("area");
  const [loading, setLoading] = useState(true);

  const stats = {
    active: overview_detail?.Active_Deliveries || 0,
    distance: overview_detail?.Total_Distance || 0,
    completed: overview_detail?.Completed_jobs || 0,
    earnings: overview_detail?.Earnings || 0,
  };

  useEffect(() => {
    user_detail().finally(() => setLoading(false));
  }, []);

  const years = useMemo(() => {
      let arr = [];
      for (let y = currYear; y >= 2024; y--) arr.push(y);
      return arr;
    }, [currYear]);

  const rawData = useMemo(() => {
    const earn = Array(12).fill(0),
      ord = Array(12).fill(0),
      dist = Array(12).fill(0);
    const dates = Array(12)
      .fill(null)
      .map(() => []);

    (overview_detail?.Delivery_History || []).forEach((item) => {
      if (item.status !== "completed") return;
      const d = new Date(item.date);
      const y = d.getFullYear(),
        m = d.getMonth();
      if (y !== year) return;

      earn[m] += item.earnings || 0;
      ord[m] += 1;
      dist[m] += item.distance || 0;
      dates[m].push({
        day: d.getDate(),
        earn: item.earnings || 0,
        dist: item.distance || 0,
      });
    });
    return { earn, ord, dist, dates };
  }, [overview_detail, year]);

  const filtered = useMemo(() => {
    const n = parseInt(period);
    let last = -1;
    for (let i = 11; i >= 0; i--)
      if (rawData.ord[i] > 0) {
        last = i;
        break;
      }

    const end = last >= 0 ? last : year === currYear ? currMonth : 11;
    const start = n === 12 ? 0 : Math.max(0, end - n + 1);

    const months = MONTHS.slice(start, end + 1);
    const earn = rawData.earn.slice(start, end + 1);
    const ord = rawData.ord.slice(start, end + 1);
    const dist = rawData.dist.slice(start, end + 1);
    const dates = rawData.dates.slice(start, end + 1);

    const labels = months.map((m, i) => {
      const days = dates[i].map((d) => d.day).sort((a, b) => a - b);
      return days.length
        ? `${m} ${days[0]}${days.length > 1 ? `-${days[days.length - 1]}` : ""}`
        : m;
    });

    return {
      months,
      labels,
      earn,
      ord,
      dist,
      dates,
      totalEarn: earn.reduce((a, b) => a + b, 0),
      totalOrd: ord.reduce((a, b) => a + b, 0),
      totalDist: Math.round(dist.reduce((a, b) => a + b, 0)),
      max: Math.max(...earn, 1),
    };
  }, [rawData, period, year, currYear, currMonth]);

  const isCircle = ["donut", "pie", "radialBar"].includes(chart);

  const series = useMemo(() => {
    if (chart === "radialBar")
      return filtered.earn.map((v) => Math.round((v / filtered.max) * 100));
    if (chart === "donut" || chart === "pie")
      return filtered.earn.some((v) => v > 0) ? filtered.earn : [1];
    if (chart === "heatmap")
      return [
        {
          name: "Earnings",
          data: filtered.labels.map((x, i) => ({ x, y: filtered.earn[i] })),
        },
      ];
    return [
      { name: "Earnings (₹)", data: filtered.earn },
      { name: "Orders", data: filtered.ord },
      { name: "Distance (km)", data: filtered.dist.map(Math.round) },
    ];
  }, [chart, filtered]);

  const options = useMemo(() => {
    const base = {
      chart: {
        type: chart,
        height: isCircle ? 380 : 360,
        fontFamily: "inherit",
        background: "transparent",
        toolbar: {
          show: true,
          offsetY: -5,
          tools: {
            download: true,
            zoom: true,
            reset: true,
            selection: false,
            pan: false,
          },
        },
        animations: { enabled: true, speed: 400 },
      },
      dataLabels: { enabled: false },
      legend: {
        position: "top",
        horizontalAlign: "left",
        fontSize: "12px",
        offsetY: 5,
      },
      tooltip: { theme: "light" },
    };

    if (chart === "pie" || chart === "donut") {
      return {
        ...base,
        colors: filtered.months.map(
          (_, i) => `hsl(${140 + i * 18}, 60%, ${45 + i * 3}%)`
        ),
        labels: filtered.labels,
        legend: { position: "bottom", fontSize: "11px" },
        tooltip: {
          y: { formatter: (v) => `₹${(v || 0).toLocaleString("en-IN")}` },
        },
        plotOptions: {
          pie: {
            donut: {
              size: "60%",
              labels: {
                show: chart === "donut",
                total: {
                  show: true,
                  label: "Total",
                  formatter: () =>
                    `₹${filtered.totalEarn.toLocaleString("en-IN")}`,
                },
                value: {
                  formatter: (v) => `₹${Number(v).toLocaleString("en-IN")}`,
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
        colors: filtered.months.map(
          (_, i) => `hsl(${140 + i * 18}, 60%, ${45 + i * 3}%)`
        ),
        labels: filtered.labels,
        legend: { position: "bottom", fontSize: "11px" },
        plotOptions: {
          radialBar: {
            hollow: { size: "30%" },
            track: { background: "#f3f4f6" },
            dataLabels: {
              name: { fontSize: "11px" },
              value: { fontSize: "13px", formatter: (v) => `${v}%` },
              total: {
                show: true,
                label: "Avg",
                formatter: () =>
                  `₹${Math.round(
                    filtered.totalEarn / (filtered.months.length || 1)
                  ).toLocaleString("en-IN")}`,
              },
            },
          },
        },
      };
    }

    if (chart === "heatmap") {
      return {
        ...base,
        colors: [COLORS.earnings],
        dataLabels: {
          enabled: true,
          formatter: (v) =>
            v >= 1000 ? `₹${(v / 1000).toFixed(1)}k` : `₹${v}`,
          style: { fontSize: "9px", colors: ["#1f2937"] },
        },
        tooltip: {
          y: { formatter: (v) => `₹${(v || 0).toLocaleString("en-IN")}` },
        },
        xaxis: {
          categories: filtered.labels,
          labels: { rotate: -45, style: { fontSize: "10px" } },
        },
        plotOptions: {
          heatmap: {
            radius: 6,
            colorScale: {
              ranges: [
                { from: 0, to: filtered.max * 0.3, color: "#dcfce7" },
                {
                  from: filtered.max * 0.3,
                  to: filtered.max * 0.6,
                  color: "#86efac",
                },
                {
                  from: filtered.max * 0.6,
                  to: filtered.max,
                  color: COLORS.earnings,
                },
              ],
            },
          },
        },
      };
    }

    return {
      ...base,
      colors: [COLORS.earnings, COLORS.orders, COLORS.distance],
      stroke: {
        curve: "smooth",
        width: chart === "line" ? [3, 2, 2] : 2,
        dashArray: [0, 0, 4],
      },
      fill: {
        type: chart === "area" ? "gradient" : "solid",
        gradient: { shadeIntensity: 0.4, opacityFrom: 0.6, opacityTo: 0.1 },
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (v, { seriesIndex }) =>
            seriesIndex === 0
              ? `₹${(v || 0).toLocaleString("en-IN")}`
              : seriesIndex === 1
              ? `${v} orders`
              : `${v} km`,
        },
      },
      grid: {
        borderColor: "#e5e7eb",
        strokeDashArray: 4,
        padding: { top: 10 },
      },
      xaxis: {
        categories: filtered.labels,
        labels: { rotate: -45, style: { fontSize: "10px" } },
      },
      yaxis: [
        {
          seriesName: "Earnings (₹)",
          title: {
            text: "Earnings",
            style: { color: COLORS.earnings, fontSize: "11px" },
          },
          labels: {
            formatter: (v) =>
              v >= 1000 ? `₹${(v / 1000).toFixed(1)}k` : `₹${Math.round(v)}`,
            style: { colors: COLORS.earnings },
          },
          min: 0,
        },
        { seriesName: "Orders", opposite: true, show: false, min: 0 },
        { seriesName: "Distance (km)", opposite: true, show: false, min: 0 },
      ],
      plotOptions: { bar: { columnWidth: "55%", borderRadius: 4 } },
      markers: {
        size: chart === "line" ? 4 : 2,
        strokeWidth: 2,
        strokeColors: [COLORS.earnings, COLORS.orders, COLORS.distance],
      },
    };
  }, [chart, filtered, isCircle]);

  const download = () => {
    let csv = "Month,Date,Earnings,Orders,Distance\n";
    filtered.months.forEach((m, i) => {
      if (filtered.dates[i].length) {
        filtered.dates[i].forEach((d) => {
          csv += `${m},${d.day},${d.earn},1,${d.dist}\n`;
        });
      } else {
        csv += `${m},-,${filtered.earn[i]},${filtered.ord[i]},${Math.round(
          filtered.dist[i]
        )}\n`;
      }
    });
    csv += `\nTOTAL,-,${filtered.totalEarn},${filtered.totalOrd},${filtered.totalDist}\n`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `report_${year}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-50">
        <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
      <AgriMarketNavbar />
      <style>{`
        .apexcharts-toolbar{z-index:10!important;padding-top:8px}
        .apexcharts-legend{z-index:10!important}
        .apexcharts-tooltip,.apexcharts-menu{z-index:999!important}
        .apexcharts-tooltip{box-shadow:0 4px 12px rgba(0,0,0,.15)!important;border-radius:6px!important}
      `}</style>

      <main className="max-w-6xl mx-auto py-6 px-4 md:px-6 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold border border-green-200 overflow-hidden">
              {AuthUser?.profile_pic ? (
                <img
                  src={AuthUser.profile_pic}
                  className="w-full h-full object-cover"
                  alt=""
                />
              ) : (
                AuthUser?.name?.[0]?.toUpperCase()
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Welcome, {AuthUser?.name}!
              </h1>
              <p className="text-sm text-gray-500">
                {stats.active} active • ₹
                {stats.earnings.toLocaleString("en-IN")} earned
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full border border-green-200 w-fit">
            TRANSPORTER
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
              val: stats.active,
              label: "Active",
              c: "green",
            },
            {
              icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
              val: `${stats.distance} km`,
              label: "Distance",
              c: "orange",
            },
            {
              icon: "M5 13l4 4L19 7",
              val: stats.completed,
              label: "Completed",
              c: "blue",
            },
            {
              icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 10v1",
              val: `₹${stats.earnings.toLocaleString("en-IN")}`,
              label: "Earnings",
              c: "green",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border p-4 text-center hover:shadow-md transition"
            >
              <div
                className={`bg-${s.c}-50 text-${s.c}-600 p-2.5 rounded-full w-fit mx-auto mb-2`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={s.icon}
                  />
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
              <h3 className="font-semibold text-gray-800">Order Report</h3>
              <p className="text-sm text-gray-500">
                {filtered.months[0]} - {filtered.months.at(-1)} {year}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-3 py-1.5 border rounded-lg text-sm bg-gray-50"
              >
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="12">Full Year</option>
              </select>
              <select
                value={year}
                onChange={(e) => setYear(+e.target.value)}
                className="px-3 py-1.5 border rounded-lg text-sm bg-gray-50"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <button
                onClick={download}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                title="Download CSV"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex gap-3 p-3 bg-gray-50 border-b flex-wrap text-sm">
            <span className="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded border border-green-100">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <b className="text-green-600">
                ₹{filtered.totalEarn.toLocaleString("en-IN")}
              </b>
            </span>
            <span className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded border border-blue-100">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <b className="text-blue-600">{filtered.totalOrd}</b> Orders
            </span>
            <span className="flex items-center gap-1.5 px-2 py-1 bg-orange-50 rounded border border-orange-100">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <b className="text-orange-600">{filtered.totalDist} km</b>
            </span>
          </div>

          <div className="px-3 py-2 bg-gray-50 border-b overflow-x-auto">
            <div className="flex gap-1.5 min-w-max">
              {CHARTS.map((t) => (
                <button
                  key={t}
                  onClick={() => setChart(t)}
                  className={`px-3 py-1 rounded text-xs font-medium capitalize transition ${
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

          <div className="p-4 relative" style={{ minHeight: 420 }}>
            <ReactApexChart
              key={`${chart}-${period}-${year}`}
              options={options}
              series={series}
              type={chart}
              height={isCircle ? 380 : 360}
            />
            {/* {filtered.totalOrd === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/90">
                <div className="text-center text-gray-500">
                  <svg
                    className="w-12 h-12 mx-auto mb-2 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <p className="font-medium">No data for {year}</p>
                </div>
              </div>
            )} */}
          </div>

          <div className="px-4 pb-4">
            <div className="border rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b text-sm font-semibold text-gray-700">
                Monthly Breakdown
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-600">Month</th>
                    <th className="px-4 py-2 text-right text-green-600">
                      Earnings
                    </th>
                    <th className="px-4 py-2 text-right text-blue-600">
                      Orders
                    </th>
                    <th className="px-4 py-2 text-right text-orange-600">
                      Distance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.months.map((m, i) => (
                    <tr
                      key={m}
                      className={`border-t hover:bg-gray-50 ${
                        filtered.earn[i] === Math.max(...filtered.earn) &&
                        filtered.earn[i] > 0
                          ? "bg-green-50/50"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-2 font-medium">{m}</td>
                      <td className="px-4 py-2 text-right text-green-600">
                        {filtered.earn[i] > 0
                          ? `₹${filtered.earn[i].toLocaleString("en-IN")}`
                          : "—"}
                      </td>
                      <td className="px-4 py-2 text-right text-blue-600">
                        {filtered.ord[i] || "—"}
                      </td>
                      <td className="px-4 py-2 text-right text-orange-600">
                        {filtered.earn[i] > 0
                          ? `${Math.round(filtered.dist[i])} km`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 font-semibold">
                  <tr className="border-t">
                    <td className="px-4 py-2">Total</td>
                    <td className="px-4 py-2 text-right text-green-600">
                      ₹{filtered.totalEarn.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-2 text-right text-blue-600">
                      {filtered.totalOrd}
                    </td>
                    <td className="px-4 py-2 text-right text-orange-600">
                      {filtered.totalDist} km
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "New Job",
                path: "/transport",
                bg: "bg-green-600 hover:bg-green-700 text-white",
                icon: "M12 4v16m8-8H4",
              },
              {
                label: "Update",
                path: "/delivery_update",
                bg: "bg-emerald-500 hover:bg-emerald-600 text-white",
                icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
              },
              {
                label: "Active",
                path: "/Active_delivery",
                bg: "bg-gray-100 hover:bg-gray-200 text-gray-800",
                icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
              },
              {
                label: "History",
                path: "/delivery_history",
                bg: "bg-gray-100 hover:bg-gray-200 text-gray-800",
                icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
              },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={() => navigate(btn.path)}
                className={`${btn.bg} font-semibold py-3 rounded-lg flex flex-col items-center gap-1 text-xs transition`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={btn.icon}
                  />
                </svg>
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <RecentActivity />
      </main>
    </div>
  );
}
