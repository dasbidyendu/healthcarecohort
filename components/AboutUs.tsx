'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutUs() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-100 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background animated blobs */}
      <div className="absolute top-[-150px] left-[-100px] w-[600px] h-[600px] bg-blue-100 rounded-full mix-blend-multiply opacity-30 blur-3xl animate-blob z-0" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-indigo-100 rounded-full mix-blend-multiply opacity-30 blur-2xl animate-blob animation-delay-4000 z-0" />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col-reverse md:flex-row items-center gap-12">
        {/* Text Block */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex-1 text-center md:text-left"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl font-extrabold text-blue-900 mb-6 leading-tight"
          >
            Empowering Hospitals<br />Through Innovation
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-700 mb-4 max-w-xl mx-auto md:mx-0 text-base sm:text-lg"
          >
            DocSyne by N6T Technologies is redefining healthcare infrastructure — making it smarter, faster, and more human.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-gray-600 max-w-xl mx-auto md:mx-0 text-sm sm:text-base"
          >
            From smart kiosks and digital appointments to AI-powered workflows and prescription automation, we're helping hospitals embrace transformation — securely, scalably, and seamlessly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6"
          >
            <a
              href="#features"
              className="inline-block bg-blue-700 text-white font-medium px-6 py-2 rounded-full shadow hover:bg-blue-800 transition"
            >
              Explore Features
            </a>
          </motion.div>
        </motion.div>

        {/* Animated Image Block */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex-1 flex justify-center"
        >
          <div className="relative w-full max-w-md h-[300px] sm:h-[400px] rounded-xl overflow-hidden shadow-xl">
            <Image
              src="/abtus.png"
              alt="Our Team"
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
