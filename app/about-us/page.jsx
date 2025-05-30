'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AboutUs = () => {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-6 md:px-20 py-10">
        <h1 className="text-3xl md:text-5xl font-bold text-center text-orange-600 mb-10">
          About Us
        </h1>

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          {/* Image */}
          <div className="md:w-1/2">
            <img
              src="about.jpg"
              alt="About Repo Tech Store"
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>

          {/* Content */}
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Welcome to Repo Tech Store</h2>
            <p className="text-gray-600">
            Repo Tech is your go-to destination for high-quality, affordable, and stylish products.
              We are passionate about delivering an exceptional shopping experience, combining
              innovation and reliability to meet your daily lifestyle needs.
            </p>
            <p className="text-gray-600">
              Whether you're looking for the latest gadgets, trendy fashion, or home essentials —
              we’ve got you covered. At Repo Tech, we believe in empowering our customers by offering
              exceptional service and unmatched convenience.
            </p>
            <p className="text-gray-600">
              Join thousands of satisfied customers who trust  Repo Tech Store for quality and value.
            </p>
          </div>
        </div>

        {/* Mission/Vision Section */}
        <div className="mt-16 max-w-4xl mx-auto grid md:grid-cols-2 gap-10 text-center">
          <div className="p-6 bg-white rounded shadow-md">
            <h3 className="text-xl font-semibold text-orange-600 mb-2">Our Mission</h3>
            <p className="text-gray-600">
              To simplify shopping and enhance lifestyles by offering the best products at unbeatable prices.
            </p>
          </div>
          <div className="p-6 bg-white rounded shadow-md">
            <h3 className="text-xl font-semibold text-orange-600 mb-2">Our Vision</h3>
            <p className="text-gray-600">
              To become Africa’s most trusted and innovative e-commerce platform.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AboutUs;
