'use client';

type Props = {
  onSelect: (view: 'staff' | 'doctor' | 'patients') => void;
};

export default function Sidebar({ onSelect }: Props) {
  return (
    <aside className="w-64 min-h-screen bg-white/50 backdrop-blur-md border-r border-white shadow-lg z-10 hidden md:flex flex-col">
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">DocSyne</h1>
        <ul className="space-y-4 text-blue-800 font-medium">
          <li className="hover:text-blue-600 cursor-pointer" onClick={() => onSelect('staff')}>Add Staff</li>
          <li className="hover:text-blue-600 cursor-pointer" onClick={() => onSelect('doctor')}>Add Doctor</li>
          <li className="hover:text-blue-600 cursor-pointer" onClick={() => onSelect('patients')}>Patient Records</li>
        </ul>
      </div>
    </aside>
  );
}
