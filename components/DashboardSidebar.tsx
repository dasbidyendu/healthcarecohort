'use client';
import { FaSignOutAlt, FaUserEdit, FaLock } from 'react-icons/fa';

export default function DashboardSidebar({ onLogout }: { onLogout: () => void }) {
  return (
    <aside className="w-64 hidden md:flex flex-col h-screen p-6 bg-white/30 backdrop-blur-md shadow-xl border-r border-blue-100">
      <h2 className="text-2xl font-bold text-blue-700 mb-10">DocSyne</h2>
      <nav className="flex-1 space-y-4 text-blue-800 font-medium">
        <button className="flex items-center gap-2 hover:text-blue-600"><FaUserEdit /> Update Email</button>
        <button className="flex items-center gap-2 hover:text-blue-600"><FaLock /> Change Password</button>
      </nav>
      <button
        onClick={onLogout}
        className="mt-auto flex items-center gap-2 text-red-600 hover:text-red-700 transition"
      >
        <FaSignOutAlt /> Logout
      </button>
    </aside>
  );
}
