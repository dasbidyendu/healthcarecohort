"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import PatientTable from "@/components/PatientTable";
import DoctorTable from "@/components/DoctorTable";
import StaffTable from "@/components/StaffTable";
import AddDoctorForm from "@/components/AddDoctorForm";
import AddStaffForm from "@/components/AddStaffForm";
import { AnimatePresence, motion } from "framer-motion";

type Tab = "patients" | "doctors" | "staff";
type Modal = "staff" | "doctor" | null;

interface Hospital {
  id: string;
  name: string;
  email: string;
  users: { id: string; name: string; email: string; role: string }[];
  doctors: {
    id: string;
    specialization: string;
    user: { name: string; email: string };
  }[];
  patients: any[]; // Update type if you have a schema
  appointments: any[];
}

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("patients");
  const [modal, setModal] = useState<Modal>(null);
  const [hospital, setHospital] = useState<Hospital | null>(null);

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const res = await fetch("/api/hospitals/info/", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        const data = await res.json();
        console.log(data);
        setHospital(data);
      } catch (err) {
        console.error("[FETCH_HOSPITAL_ERROR]", err);
        //window.location.href = "/login";
      }
    };

    fetchHospital();
  }, []);

  const handleLogout = () => {
    document.cookie = "session=; Max-Age=0; path=/";
    window.location.href = "/login";
  };

  const renderTable = () => {
    if (!hospital) {
      return (
        <p className="text-center text-gray-500">Loading hospital data...</p>
      );
    }
    switch (tab) {
      case "patients":
        return <PatientTable patients={hospital.patients ?? []} />;
      case "doctors":
        return <DoctorTable doctors={hospital.doctors ?? []} />;
      case "staff":
        return <StaffTable staffList={hospital.users ?? []} />;
    }
  };

  const handleModalClose = () => setModal(null);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <DashboardSidebar onLogout={handleLogout} />

      <main className="flex-1 p-6 md:p-10 relative z-10">
        {/* Hospital Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-blue-800">
            Welcome, {hospital?.name ?? "Loading..."}
          </h1>
          <p className="text-sm text-gray-600">{hospital?.email}</p>
        </div>

        {/* Top Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex gap-4 mb-6 text-blue-800 font-medium"
        >
          {(["patients", "doctors", "staff"] as Tab[]).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-full transition ${
                tab === key
                  ? "bg-blue-700 text-white shadow-lg"
                  : "hover:bg-blue-100 bg-white shadow-sm"
              }`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)} List
            </button>
          ))}
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-xl min-h-[60vh]"
        >
          {renderTable()}
        </motion.div>

        {/* Add Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="fixed bottom-8 right-8"
        >
          <button
            onClick={() => setModal(tab === "doctors" ? "doctor" : "staff")}
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-full shadow-xl transition"
          >
            + Add {tab === "doctors" ? "Doctor" : "Staff"}
          </button>
        </motion.div>

        {/* Modal */}
        <AnimatePresence>
          {modal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
              onClick={handleModalClose}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-6 shadow-2xl max-w-md w-full relative"
              >
                <button
                  onClick={handleModalClose}
                  className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl"
                >
                  ✕
                </button>

                {modal === "staff" ? (
                  <AddStaffForm onSuccess={handleModalClose} />
                ) : (
                  <AddDoctorForm onSuccess={handleModalClose} />
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
