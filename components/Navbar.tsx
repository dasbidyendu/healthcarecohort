'use client';

import { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'find-doctor', label: 'Find Doctor' },
    { id: 'services', label: 'Our Services' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  const route =  useRouter();

  return (
    <motion.nav
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 w-full z-50 bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-[#1a5cff] tracking-tight">
          Doc<span className="text-[#333333]">Syne</span>
        </div>

        <ul className="hidden md:flex gap-8 text-[16px] font-medium text-[#555555] border rounded-full px-4 py-2 border-white shadow-2xl shadow-white backdrop-blur-md bg-white/20">
          {navItems.map((item) => (
            <li key={item.id}>
              <Link
                to={item.id}
                smooth
                duration={500}
                offset={-70}
                className="hover:text-[#1a5cff] transition-colors cursor-pointer"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Navigation Buttons */}
        <div  onClick={() => route.push('/login')}  className="hidden md:flex items-center gap-4">
          <button className="border border-[#1a5cff] text-[#1a5cff] px-5 py-2 rounded-full hover:bg-[#1a5cff]/10 transition">
            Login
          </button>
          <button onClick={() => route.push('/signup')}  className="bg-[#1a5cff] text-white px-6 py-2.5 rounded-full hover:bg-[#1a5cff]/90 transition">
            Get Started
          </button>
        </div>        


        

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-3xl text-blue-700 focus:outline-none"
        >
          ☰
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white px-6 pb-4 shadow-lg">
          <ul className="flex flex-col gap-4 text-gray-700 font-medium">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.id}
                  smooth
                  duration={500}
                  offset={-70}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 hover:text-[#1a5cff]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {/* Mobile Menu Buttons */}
            <li>
              <button onClick={() => route.push('/login')}  className="w-full border border-[#1a5cff] text-[#1a5cff] py-2 rounded-full hover:bg-[#1a5cff]/10 transition mb-2">
                Login
              </button>
              <button onClick={() => route.push('/signup')} className="w-full bg-[#1a5cff] text-white py-2 rounded-full hover:bg-[#1a5cff]/90 transition">
                Get Started
              </button>
            </li>
            
          </ul>
        </div>
      )}
    </motion.nav>
  );
}