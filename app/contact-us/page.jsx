'use client';
import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


const ContactUs = () => {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 flex flex-col items-center px-6 md:px-20 py-10">
        <h1 className="text-3xl md:text-5xl font-bold text-center text-orange-600 mb-10">Contact Us</h1>
        
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <FaPhoneAlt className="text-orange-600 text-xl mt-1" />
              <div>
                <h2 className="text-lg font-semibold">Phone</h2>
                <p>+256 755 227 940</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FaEnvelope className="text-orange-600 text-xl mt-1" />
              <div>
                <h2 className="text-lg font-semibold">Email</h2>
                <p>support@Repo Tech store.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FaMapMarkerAlt className="text-orange-600 text-xl mt-1" />
              <div>
                <h2 className="text-lg font-semibold">Address</h2>
                <p>123 Entebbe Ave, Kampala, UGANDA</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form className="space-y-6 bg-white p-6 rounded shadow-md">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                placeholder="Your message..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-500 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ContactUs;
