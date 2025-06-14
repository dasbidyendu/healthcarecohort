'use client';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FindDoctor from '@/components/FindDoctor';
import Features from '@/components/Features';
import AboutUs from '@/components/AboutUs';
import ContactUs from '@/components/ContactUs';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="pt-24 scroll-smooth">
        {/* HOME */}
        <section id="home" className="bg-gradient-to-r from-blue-100 to-white py-16 sm:py-24 px-4 sm:px-6">
          <Hero />
        </section>

        {/* FIND DOCTOR */}
        <section id="find-doctor" className="bg-white ">
          <FindDoctor />
        </section>

        {/* SERVICES */}
        <section id="services" className="bg-blue-50 ">
          <Features/>
        </section>

        {/* ABOUT */}
        <section id="about" className="bg-white ">
          <AboutUs/>
        </section>

        {/* CONTACT */}
        <section id="contact" className="bg-blue-50 ">
          <ContactUs/>
        </section>

        <section id='footer' className='bg-blue-50'>
          <Footer/>

        </section>
      </main>
    </>
  );
}
