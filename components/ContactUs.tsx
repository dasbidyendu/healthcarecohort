'use client';

import { motion } from 'framer-motion';
import { FaEnvelopeOpenText, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

export default function ContactUs() {
  return (
    <section className="relative bg-gradient-to-bl from-white via-blue-50 to-blue-100 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-blue-100 rounded-full mix-blend-multiply opacity-30 blur-3xl animate-blob z-0" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[350px] h-[350px] bg-indigo-100 rounded-full mix-blend-multiply opacity-30 blur-2xl animate-blob animation-delay-4000 z-0" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl font-extrabold text-blue-800 mb-4"
          >
            Let's Get in Touch
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-600 max-w-xl mx-auto"
          >
            Whether you’re a hospital administrator, healthcare provider, or a curious visitor — we’re here to help.
          </motion.p>
        </div>

        {/* Info + Form */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-start gap-4">
              <FaMapMarkerAlt className="text-blue-700 text-xl mt-1" />
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Our Office</h4>
                <p className="text-gray-600">N6T Technologies, Hyderabad, India</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FaEnvelopeOpenText className="text-blue-700 text-xl mt-1" />
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Email</h4>
                <p className="text-gray-600">support@docsyne.in</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FaPhoneAlt className="text-blue-700 text-xl mt-1" />
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Phone</h4>
                <p className="text-gray-600">+91 98765 43210</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6 bg-white p-6 rounded-lg shadow-lg"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Your Name"
                className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-blue-500"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-blue-500"
              />
            </div>
            <textarea
              placeholder="Your Message"
              rows={5}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-blue-500"
            ></textarea>
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-6 rounded-full shadow transition"
            >
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
