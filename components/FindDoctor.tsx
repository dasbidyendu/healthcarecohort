'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaTooth,
  FaStethoscope,
  FaBrain,
  FaEarListen,
} from 'react-icons/fa6';
import { FaUserMd, FaHeartbeat } from 'react-icons/fa';

const specialties = [
  { icon: <FaUserMd size={24} />, label: 'General Physician' },
  { icon: <FaTooth size={24} />, label: 'Dentist' },
  { icon: <FaHeartbeat size={24} />, label: 'Cardiologist' },
  { icon: <FaStethoscope size={24} />, label: 'Orthopedic' },
  { icon: <FaBrain size={24} />, label: 'Neurologist' },
  { icon: <FaEarListen size={24} />, label: 'ENT Specialist' },
  { icon: <FaUserMd size={24} />, label: 'Dermatologist' },
  { icon: <FaUserMd size={24} />, label: 'Pediatrician' },
  { icon: <FaUserMd size={24} />, label: 'Gynecologist' },
  { icon: <FaUserMd size={24} />, label: 'Psychiatrist' },
  { icon: <FaUserMd size={24} />, label: 'Oncologist' },
  { icon: <FaUserMd size={24} />, label: 'Radiologist' },
  { icon: <FaUserMd size={24} />, label: 'Urologist' },
  { icon: <FaUserMd size={24} />, label: 'Nephrologist' },
  { icon: <FaUserMd size={24} />, label: 'Endocrinologist' },
  { icon: <FaUserMd size={24} />, label: 'Gastroenterologist' },
  { icon: <FaUserMd size={24} />, label: 'Pulmonologist' },
  { icon: <FaUserMd size={24} />, label: 'Rheumatologist' },
  { icon: <FaUserMd size={24} />, label: 'Hematologist' },
  { icon: <FaUserMd size={24} />, label: 'Anesthesiologist' },
  { icon: <FaUserMd size={24} />, label: 'Surgeon' },
];

export default function FindDoctor() {
  const [search, setSearch] = useState('');

  return (
    <section className="bg-gradient-to-br from-white via-blue-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4"
        >
          Search <span className="text-blue-700">Doctors</span>
        </motion.h2>
        <p className="text-gray-600 text-sm sm:text-base mb-10">
          Find your specialist and book an appointment in one click.
        </p>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto mb-12">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or specialty..."
            className="w-full sm:w-auto flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-blue-500 text-sm sm:text-base"
          />
          <button className="bg-blue-700 text-white px-6 py-2 rounded-full hover:bg-blue-800 transition text-sm sm:text-base">
            Search
          </button>
        </div>

        {/* Auto-scrolling specialties row */}
        <div className="overflow-hidden">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="flex gap-4 sm:gap-6 w-max"
          >
            {[...specialties, ...specialties].map((item, index) => (
              <div
                key={index}
                className="min-w-[130px] sm:min-w-[150px] bg-white rounded-xl p-4 shadow-md flex flex-col items-center justify-center hover:shadow-lg transition text-center"
              >
                <div className="text-blue-700 mb-2">{item.icon}</div>
                <p className="text-xs sm:text-sm font-semibold text-gray-800">{item.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Extra info */}
        <div className="mt-16 text-gray-700 px-4">
          <p className="text-base sm:text-lg font-medium">
            Trusted by hospitals to manage doctor availability and patient appointments more efficiently.
          </p>
        </div>
      </div>
    </section>
  );
}
