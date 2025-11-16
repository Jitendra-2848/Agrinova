// RecentActivityHome.jsx
import React from 'react';

const activities = [
  {
    type: 'delivered',
    title: 'Order delivered',
    detail: 'Order #5678 has been delivered',
    time: '1 hour ago',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-500',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M16 12l-4-4-4 4"></path>
      </svg>
    ),
  },
  {
    type: 'neworder',
    title: 'New order placed',
    detail: 'Order #5680 for Fresh Vegetables',
    time: '3 hours ago',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-500',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <rect x="7" y="7" width="10" height="10" rx="2"/>
      </svg>
    ),
  },
  {
    type: 'review',
    title: 'Review submitted',
    detail: 'You reviewed "Organic Apples"',
    time: '1 day ago',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 15v-2a4 4 0 014-4c3.313 0 4 2.687 4 5v1" />
      </svg>
    ),
  },
  {
    type: 'price',
    title: 'Price drop alert',
    detail: 'Organic Wheat now 15% off',
    time: '2 days ago',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-500',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4m0-4h.01"/>
      </svg>
    ),
  },
];

const RecentActivityHome = () => (
  <div className="bg-white rounded-xl shadow-md p-6 mt-8 mb-8">
    <div className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4m0-4h.01" />
      </svg>
      Recent Activity
    </div>
    <ul className="divide-y divide-gray-200">
      {activities.map((item, idx) => (
        <li key={idx} className="flex items-center py-4">
          <div className={`flex items-center justify-center rounded-full w-10 h-10 mr-4 ${item.iconBg}`}>
            <span className={item.iconColor}>{item.icon}</span>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">{item.title}</div>
            <div className="text-gray-500 text-sm">{item.detail}</div>
          </div>
          <div className="text-gray-400 text-xs min-w-[90px] text-right">{item.time}</div>
        </li>
      ))}
    </ul>
  </div>
);

export default RecentActivityHome;
