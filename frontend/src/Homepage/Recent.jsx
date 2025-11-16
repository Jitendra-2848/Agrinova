// RecentActivity.jsx
import React from 'react';

const activities = [
  {
    type: 'order',
    title: 'New order received',
    detail: 'Order #1234 for 500kg Wheat',
    time: '2 hours ago',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-500',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 2" />
      </svg>
    ),
  },
  {
    type: 'shipment',
    title: 'Shipment dispatched',
    detail: 'Order #1230 is on the way',
    time: '5 hours ago',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-500',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="2" y="7" width="20" height="10" rx="2" />
        <path d="M16 17a2 2 0 100-4 2 2 0 000 4zm-8 0a2 2 0 100-4 2 2 0 000 4z" />
      </svg>
    ),
  },
  {
    type: 'payment',
    title: 'Payment received',
    detail: '$2,500 credited to your account',
    time: '1 day ago',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 8v4l3 2" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
  {
    type: 'alert',
    title: 'Low stock alert',
    detail: 'Organic Tomatoes running low',
    time: '2 days ago',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-500',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 9v2m0 4h.01" />
        <path d="M12 17a1 1 0 001-1V11a1 1 0 00-2 0v5a1 1 0 001 1z" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
];

const RecentActivity = () => (
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

export default RecentActivity;
