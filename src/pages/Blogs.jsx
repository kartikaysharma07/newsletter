import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogs } from '../data/blogs';

const Blogs = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-neutral-900 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&auto=format&fit=crop&q=60&ixlib=rb-4.0.3')] bg-cover bg-center bg-no-repeat font-sans relative flex flex-col overflow-hidden">
      <div className="absolute inset-0 bg-black/30 z-0"></div>
      <nav className="fixed top-0 w-full bg-neutral-900/80 backdrop-blur-md shadow-lg z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <svg
                  className="w-8 h-8 mr-2 text-[#FF5722]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
                <motion.span
                  className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#C0C0C0] tracking-wide"
                  whileHover={{ scale: 1.05, textShadow: "0 0 8px rgba(255, 215, 0, 0.5)" }}
                  transition={{ duration: 0.3 }}
                >
                  RBTechTalks
                </motion.span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-10">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-neutral-100 hover:text-[#FF5722] transition-colors font-sans text-lg ${
                    isActive ? 'text-[#FF5722] border-b-2 border-[#FF5722]' : ''
                  }`
                }
                aria-label="Home page"
              >
                Home
              </NavLink>
              <NavLink
                to="/blogs"
                className={({ isActive }) =>
                  `text-neutral-100 hover:text-[#FF5722] transition-colors font-sans text-lg ${
                    isActive ? 'text-[#FF5722] border-b-2 border-[#FF5722]' : ''
                  }`
                }
                aria-label="View our blog posts"
              >
                Blogs
              </NavLink>
              <NavLink
                to="/posts"
                className={({ isActive }) =>
                  `text-neutral-100 hover:text-[#FF5722] transition-colors font-sans text-lg ${
                    isActive ? 'text-[#FF5722] border-b-2 border-[#FF5722]' : ''
                  }`
                }
                aria-label="View client posts"
              >
                Posts
              </NavLink>
              <NavLink
                to="/website"
                className={({ isActive }) =>
                  `text-neutral-100 hover:text-[#FF5722] transition-colors font-sans text-lg ${
                    isActive ? 'text-[#FF5722] border-b-2 border-[#FF5722]' : ''
                  }`
                }
                aria-label="Visit our website"
              >
                Visit Our Website
              </NavLink>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-neutral-100 focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-neutral-900/80 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block text-neutral-100 hover:text-[#FF5722] transition-colors px-3 py-2 rounded-md font-sans text-lg ${
                    isActive ? 'text-[#FF5722]' : ''
                  }`
                }
                aria-label="Home page"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/blogs"
                className={({ isActive }) =>
                  `block text-neutral-100 hover:text-[#FF5722] transition-colors px-3 py-2 rounded-md font-sans text-lg ${
                    isActive ? 'text-[#FF5722]' : ''
                  }`
                }
                aria-label="View our blog posts"
                onClick={() => setIsMenuOpen(false)}
              >
                Blogs
              </NavLink>
              <NavLink
                to="/posts"
                className={({ isActive }) =>
                  `block text-neutral-100 hover:text-[#FF5722] transition-colors px-3 py-2 rounded-md font-sans text-lg ${
                    isActive ? 'text-[#FF5722]' : ''
                  }`
                }
                aria-label="View client posts"
                onClick={() => setIsMenuOpen(false)}
              >
                Posts
              </NavLink>
              <NavLink
                to="/website"
                className={({ isActive }) =>
                  `block text-neutral-100 hover:text-[#FF5722] transition-colors px-3 py-2 rounded-md font-sans text-lg ${
                    isActive ? 'text-[#FF5722]' : ''
                  }`
                }
                aria-label="Visit our website"
                onClick={() => setIsMenuOpen(false)}
              >
                Visit Our Website
              </NavLink>
            </div>
          </div>
        )}
      </nav>
      <div className="flex-1 pt-20 pb-8 z-10">
        <div className="max-w-[1400px] mx-auto p-6">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 to-[#FFC107] text-center mb-10"
          >
            Our Blogs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-neutral-300 mb-8 text-xl font-sans leading-7 text-center"
          >
            Immerse yourself in our latest insights on technology and innovation.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((blog) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link to={`/blogs/${blog.id}`} className="block">
                  <div className="flex bg-neutral-800/50 backdrop-blur-md border border-neutral-700/30 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-[#FF5722]/20 transition-all duration-300">
                    <div className="w-1/3 h-40 overflow-hidden">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="w-2/3 p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 to-[#FFC107] mb-2">
                          {blog.title}
                        </h3>
                        <p className="text-neutral-300 font-sans text-base leading-6 line-clamp-2 mb-3">
                          {blog.subtitle}
                        </p>
                      </div>
                      <div className="text-neutral-400 font-sans text-sm">
                        By {blog.author} • {blog.date} • {blog.readTime}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Link
              to="/"
              className="mt-12 inline-block text-neutral-100 bg-gradient-to-r from-[#FF5722] to-[#FFC107] rounded-xl px-8 py-4 hover:bg-[#FF5722]/80 transition-colors mx-auto block w-fit font-sans"
              aria-label="Back to homepage subscription"
            >
              Back to Homepage
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;