'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative BG Blobs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-28 gap-12 relative z-10">
        {/* Left: Copy */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center md:text-left"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Simplify <span className="text-blue-700">Doctor Scheduling</span> <br />
            for Your Hospital
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto md:mx-0">
            DocSyne empowers hospitals to manage appointments, doctor shifts, and patient flow — all in one intuitive dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-center md:justify-start">
            <button className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-full font-semibold shadow-md transition duration-300 text-lg">
              Register Your Hospital
            </button>
            <a href="#services" className="text-blue-700 font-semibold inline-flex items-center text-lg hover:underline">
              How It Works →
            </a>
          </div>
        </motion.div>

        {/* Right: Image Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex-1 flex justify-center"
        >
          <div className="relative bg-white/30 backdrop-blur-lg rounded-3xl p-6 shadow-2xl w-fit">
            <Image
              src={'/doctor.png'}
              alt="Doctor"
              width={400}
              height={400}
              className="rounded-2xl object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full shadow text-sm font-medium text-gray-700">
              🗓 Real-time Doctor Dashboard
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
