import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const Offers = () => {
  const offers = [
    {
      id: 1,
      title: "Domestic Flights Sale",
      discount: "Up to 40% OFF",
      description: "Book domestic flights and save big on your next trip",
      code: "DOMESTIC40",
      validUntil: "Dec 31, 2025",
      color: "from-blue-500 to-blue-700"
    },
    {
      id: 2,
      title: "International Special",
      discount: "Flat ₹5,000 OFF",
      description: "On international bookings above ₹30,000",
      code: "INTL5000",
      validUntil: "Nov 30, 2025",
      color: "from-purple-500 to-purple-700"
    },
    {
      id: 3,
      title: "Weekend Getaway",
      discount: "25% OFF",
      description: "Book weekend flights and save on quick trips",
      code: "WEEKEND25",
      validUntil: "Dec 15, 2025",
      color: "from-green-500 to-green-700"
    },
    {
      id: 4,
      title: "First Booking Bonus",
      discount: "₹2,000 OFF",
      description: "Special discount for first-time users",
      code: "FIRST2000",
      validUntil: "Jan 31, 2026",
      color: "from-orange-500 to-red-600"
    },
    {
      id: 5,
      title: "Group Booking Deal",
      discount: "15% OFF",
      description: "Book for 4+ passengers and save together",
      code: "GROUP15",
      validUntil: "Dec 31, 2025",
      color: "from-pink-500 to-pink-700"
    },
    {
      id: 6,
      title: "Early Bird Special",
      discount: "30% OFF",
      description: "Book 30+ days in advance and save more",
      code: "EARLY30",
      validUntil: "Dec 31, 2025",
      color: "from-indigo-500 to-indigo-700"
    }
  ];

  const [copiedCode, setCopiedCode] = useState(null);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-4">
            🎉 SPECIAL OFFERS
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Exclusive Flight Deals
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Save more on your travels with our limited-time offers and promotional codes
          </p>
        </motion.div>

        {/* Offers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Gradient Header */}
              <div className={`bg-gradient-to-r ${offer.color} p-6 text-white`}>
                <div className="text-3xl font-bold mb-2">{offer.discount}</div>
                <h3 className="text-xl font-bold">{offer.title}</h3>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-6 min-h-[3rem]">{offer.description}</p>

                {/* Promo Code */}
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Promo Code</div>
                      <div className="text-xl font-bold text-gray-900">{offer.code}</div>
                    </div>
                    <button
                      onClick={() => copyCode(offer.code)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                    >
                      {copiedCode === offer.code ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Valid Until */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Valid until:</span>
                  <span className="font-semibold text-gray-900">{offer.validUntil}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <Link
                  to="/"
                  className="block text-center text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  Book Now →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* How to Use Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-md p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How to Use Promo Codes</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center text-2xl mx-auto mb-4 font-bold">
                1
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Search Flights</h3>
              <p className="text-gray-600 text-sm">Find your perfect flight on the home page</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center text-2xl mx-auto mb-4 font-bold">
                2
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Copy Code</h3>
              <p className="text-gray-600 text-sm">Click 'Copy' on your preferred offer</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center text-2xl mx-auto mb-4 font-bold">
                3
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Apply & Save</h3>
              <p className="text-gray-600 text-sm">Paste the code at checkout to get your discount</p>
            </div>
          </div>
        </motion.div>

        {/* Terms */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100"
        >
          <h3 className="font-bold text-gray-900 mb-3">Terms & Conditions</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Promo codes are valid for the dates specified and cannot be extended</li>
            <li>• Only one promo code can be applied per booking</li>
            <li>• Discounts are subject to availability and may vary by route</li>
            <li>• Minimum booking value may apply for certain offers</li>
            <li>• Offers cannot be combined with other promotions</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};