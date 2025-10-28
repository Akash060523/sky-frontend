import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      category: "Booking",
      questions: [
        {
          q: "How do I book a flight on SkyBook?",
          a: "Simply enter your departure city, destination, travel dates, and number of passengers in the search form on our homepage. Browse available flights, select your preferred option, and click 'Book Flight'. You'll need to be logged in to complete your booking."
        },
        {
          q: "Can I book flights for multiple passengers?",
          a: "Yes! When searching for flights, use the 'Passengers' dropdown to select up to 6 passengers. All passengers will be included in the same booking."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and popular digital payment methods like PayPal and Google Pay."
        }
      ]
    },
    {
      category: "SMS Alerts",
      questions: [
        {
          q: "How do SMS flight alerts work?",
          a: "After registering your phone number, you can set up alerts for any flight. We'll send you instant SMS notifications about delays, cancellations, gate changes, and other important updates."
        },
        {
          q: "How do I register my phone number?",
          a: "Click on the '📱 Phone' button in the header (after logging in), enter your phone number in E.164 format (e.g., +919876543210), and click Register. You'll receive a confirmation message."
        },
        {
          q: "Are SMS alerts free?",
          a: "Yes! SMS alerts are completely free. Standard SMS rates from your carrier may apply."
        }
      ]
    },
    {
      category: "My Bookings",
      questions: [
        {
          q: "Where can I see my booked flights?",
          a: "Navigate to 'My Bookings' from the top menu. You'll see all your current and past bookings with full details including booking reference, flight status, and travel dates."
        },
        {
          q: "Can I cancel my booking?",
          a: "Cancellation policies vary by airline. Please contact our support team at support@skybook.com or call +1 (555) 123-4567 for cancellation assistance."
        },
        {
          q: "How do I download my booking confirmation?",
          a: "In the 'My Bookings' section, click on any booking to view details, then use the 'Download PDF' option to save your confirmation."
        }
      ]
    },
    {
      category: "Account & Security",
      questions: [
        {
          q: "How do I create an account?",
          a: "Click 'Sign In' in the header, then select 'Sign Up'. You can register using your email or sign in with Google for faster access."
        },
        {
          q: "I forgot my password. What should I do?",
          a: "On the login page, click 'Forgot Password'. Enter your email address, and we'll send you a password reset link within minutes."
        },
        {
          q: "Is my personal information secure?",
          a: "Absolutely! We use Firebase Authentication and industry-standard encryption to protect your data. We never share your information with third parties without consent."
        }
      ]
    },
    {
      category: "Flight Status",
      questions: [
        {
          q: "How can I check my flight status?",
          a: "Click the '📊 Status' button on any flight card to get real-time status updates including delays, gate information, and estimated arrival times."
        },
        {
          q: "How accurate is the flight status information?",
          a: "We use the AviationStack API for real-time flight data, which is updated continuously. Status information is typically accurate within minutes of actual changes."
        }
      ]
    }
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq =>
        faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Find answers to common questions about booking, alerts, and more
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for answers..."
                className="w-full px-6 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              <svg
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredFaqs.map((category, catIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="bg-blue-100 text-blue-600 rounded-lg px-3 py-1 text-sm">
                  {category.questions.length}
                </span>
                {category.category}
              </h2>

              <div className="space-y-3">
                {category.questions.map((faq, index) => {
                  const globalIndex = `${catIndex}-${index}`;
                  const isActive = activeIndex === globalIndex;

                  return (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <button
                        onClick={() => setActiveIndex(isActive ? null : globalIndex)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                        <svg
                          className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                            isActive ? 'transform rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-6 pb-4 text-gray-600 border-t border-gray-100 pt-4">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredFaqs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">Try different search terms or browse all categories</p>
          </motion.div>
        )}

        {/* Still Need Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-100 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Still have questions?</h3>
          <p className="text-gray-600 mb-6">Our support team is here to help 24/7</p>
          <Link
            to="/contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
          >
            Contact Support →
          </Link>
        </motion.div>
      </div>
    </div>
  );
};