'use client';

import { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import AdminDashboard from '@/components/AdminDashboard';

type SessionPayload = {
  id: string;
  role: 'HOSPITAL_ADMIN' | 'STAFF' | 'DOCTOR';
  hospitalId: string;
};

export default function DashboardPage() {
  const [role, setRole] = useState<SessionPayload['role'] | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const decoded = jwt.decode(token) as SessionPayload;
      setRole(decoded?.role || null);
    } catch (err) {
      console.error('Token decode error:', err);
    }
  }, []);

  if (!role) return <p className="text-center mt-20">Loading dashboard...</p>;
  if (role === 'HOSPITAL_ADMIN') return <AdminDashboard />;
  return <p className="text-center mt-20 text-red-500">Unauthorized</p>;
}
