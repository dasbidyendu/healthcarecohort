'use client';

import { motion } from 'framer-motion';
import {
  FaRobot,
  FaMicrophoneAlt,
  FaCalendarCheck,
  FaHospitalUser,
  FaPrescription,
  FaUserNurse,
} from 'react-icons/fa';

const features = [
  {
    icon: <FaCalendarCheck size={28} />,
    title: 'Appointment Booking',
    description: 'Seamlessly schedule doctor appointments from kiosks, web, or mobile devices.',
    color: 'bg-green-50',
    shadow: 'hover:shadow-[0_0_30px_rgba(74,222,128,0.5)]',
  },
  {
    icon: <FaUserNurse size={28} />,
    title: 'Front-Desk Efficiency',
    description: 'Reduce OPD congestion with smart registration flows and automated patient sorting.',
    color: 'bg-purple-50',
    shadow: 'hover:shadow-[0_0_30px_rgba(192,132,252,0.5)]',
  },
  {
    icon: <FaRobot size={28} />,
    title: 'AI-Assisted Workflow',
    description: 'Smart AI recommends actions and automates prescription generation based on patient symptoms.',
    color: 'bg-yellow-50',
    shadow: 'hover:shadow-[0_0_30px_rgba(253,224,71,0.5)]',
  },
  {
    icon: <FaMicrophoneAlt size={28} />,
    title: 'Voice-Driven Interface',
    description: 'Patients and doctors can interact with the system using voice commands for faster input.',
    color: 'bg-pink-50',
    shadow: 'hover:shadow-[0_0_30px_rgba(244,114,182,0.4)]',
  },
  {
    icon: <FaPrescription size={28} />,
    title: 'Digital Prescriptions',
    description: 'Generate structured, legible prescriptions in seconds, integrated into patient records.',
    color: 'bg-blue-50',
    shadow: 'hover:shadow-[0_0_30px_rgba(96,165,250,0.4)]',
  },
  {
    icon: <FaHospitalUser size={28} />,
    title: 'Doctor Dashboard',
    description: 'Manage appointments, patient notes, and prescriptions from one unified doctor portal.',
    color: 'bg-indigo-50',
    shadow: 'hover:shadow-[0_0_30px_rgba(165,180,252,0.4)]',
  },
];

export default function Features() {
  return (
    <section className="relative bg-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply opacity-30 filter blur-3xl animate-blob" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply opacity-30 filter blur-2xl animate-blob animation-delay-4000" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold text-blue-800 mb-4"
        >
          All-in-One Hospital Tech Platform
        </motion.h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-12">
          From check-in to prescription, streamline every step of hospital-patient interaction with DocSyne.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-xl p-6 text-left shadow-md transition duration-300 ${feature.color} ${feature.shadow}`}
            >
              <div className="text-blue-700 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-700 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
