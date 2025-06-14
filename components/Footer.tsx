'use client';

import { FaFacebookF, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-blue-500 pt-10 pb-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <h1 className="text-2xl font-extrabold text-blue-700">
            Doc<span className="text-gray-900">Syne</span>
          </h1>
          <nav className="flex flex-wrap gap-4 text-gray-600 text-sm font-medium">
            <a href="#find-doctor" className="hover:text-blue-600">Find Doctor</a>
            <a href="#services" className="hover:text-blue-600">Our Services</a>
            <a href="#about" className="hover:text-blue-600">About Us</a>
            <a href="#contact" className="hover:text-blue-600">Contact</a>
            <a href="#blog" className="hover:text-blue-600">Blog</a>
            <a href="#faqs" className="hover:text-blue-600">FAQs</a>
          </nav>
        </div>

        {/* Right - Socials */}
        <div className="flex gap-4 text-blue-700 text-lg">
          <a href="#" aria-label="Facebook" className="hover:text-blue-500">
            <FaFacebookF />
          </a>
          <a href="#" aria-label="LinkedIn" className="hover:text-blue-500">
            <FaLinkedinIn />
          </a>
          <a href="#" aria-label="X / Twitter" className="hover:text-blue-500">
            <FaXTwitter />
          </a>
        </div>
      </div>

      <div className="mt-8 border-t border-blue-500 pt-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
        <p>&copy; 2024 DocSyne by N6T Technologies</p>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-gray-600">Privacy Policy</a>
          <a href="#" className="hover:text-gray-600">Cookies Settings</a>
        </div>
      </div>
    </footer>
  );
}
