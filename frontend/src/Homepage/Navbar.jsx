// AgriMarketNavbar.jsx
import React from 'react';
import { useAuthStore } from '../lib/store';

const AgriMarketNavbar = () =>{
  const {AuthUser} = useAuthStore()

return (
  <nav className="bg-emerald-600 h-[90px] flex items-center px-8 w-full shadow-md justify-between">
    
    <div className="flex items-center w-full">
      
      <span className="text-3xl text-white ml-10 mr-3">🌱</span>
      <span className="font-bold text-2xl text-white tracking-wide mr-10">AgriNova</span>
      
      <ul className="flex gap-7 list-none ml-20">
        <li>
          <a href="#" className="text-white font-medium text-base hover:text-green-100 transition">Home</a>
        </li>
        <li>
          <a href="#" className="text-white font-medium text-base hover:text-green-100 transition">Marketplace</a>
        </li>
        <li>
          <a href="#" className="text-white font-medium text-base hover:text-green-100 transition">Analytics</a>
        </li>
        <li>
          <a href="#" className="text-white font-medium text-base hover:text-green-100 transition">Notifications</a>
        </li>
      </ul>
    </div>
    
    <div className="flex items-center p-1.5 bg-emerald-400 rounded-full min-w-60">
      <div className="bg-white hover:cursor-pointer p-2 rounded-full w-12 h-12 flex items-center justify-center font-bold text-emerald-600 text-lg shadow mr-3">
        {AuthUser.profile_pic ? <img src={AuthUser.profile_pic} className=' object-cover scale-150 w-full rounded-full overflow-hidden'/> : AuthUser.name[0]}
        {}
      </div>
      <div className="flex flex-col text-white leading-tight">
        <span className="font-semibold text-gray-100 mb-1">{AuthUser.name}</span>
        <span className="text-sm opacity-80">{AuthUser.email}</span>
      </div>
    </div>
  </nav>
)};

export default AgriMarketNavbar;
