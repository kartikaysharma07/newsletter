import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from './supabaseClient.js';

const Posts = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error checking user:', error.message);
      }
    }
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('id, title, url, image_url')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setPosts(
          data.map((post) => ({
            id: post.id,
            title: post.title,
            url: post.url,
            image: post.image_url || 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60',
          }))
        );
      } catch (error) {
        setError('Failed to load posts: ' + error.message);
        console.error(error);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen w-full bg-neutral-900 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&auto=format&fit=crop&q=60&ixlib=rb-4.0.3')] bg-cover bg-center bg-no-repeat font-sans relative flex flex-col overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70 z-0"></div>
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
                aria-label="View posts"
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
              {user ? (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `text-neutral-100 hover:text-[#FF5722] transition-colors font-sans text-lg ${
                      isActive ? 'text-[#FF5722] border-b-2 border-[#FF5722]' : ''
                    }`
                  }
                  aria-label="Admin dashboard"
                >
                  Admin
                </NavLink>
              ) : (
                <NavLink
                  to="/admin/login"
                  className={({ isActive }) =>
                    `text-neutral-100 hover:text-[#FF5722] transition-colors font-sans text-lg ${
                      isActive ? 'text-[#FF5722] border-b-2 border-[#FF5722]' : ''
                    }`
                  }
                  aria-label="Login to admin dashboard"
                >
                  Login
                </NavLink>
              )}
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
                aria-label="View posts"
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
              {user ? (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `block text-neutral-100 hover:text-[#FF5722] transition-colors px-3 py-2 rounded-md font-sans text-lg ${
                      isActive ? 'text-[#FF5722]' : ''
                    }`
                  }
                  aria-label="Admin dashboard"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </NavLink>
              ) : (
                <NavLink
                  to="/admin/login"
                  className={({ isActive }) =>
                    `block text-neutral-100 hover:text-[#FF5722] transition-colors px-3 py-2 rounded-md font-sans text-lg ${
                      isActive ? 'text-[#FF5722]' : ''
                    }`
                  }
                  aria-label="Login to admin dashboard"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </NavLink>
              )}
            </div>
          </div>
        )}
      </nav>
      <div className="flex-1 pt-20 pb-12 z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-10">
            <img
              src="https://vvjaqiowlgkabmchvmhi.supabase.co/storage/v1/object/public/website-assets//logo.svg"
              alt="RBTechTalks Logo"
              className="w-10 h-10 mr-3"
            />
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-5xl sm:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 to-[#FFC107] tracking-tight"
            >
              Posts
            </motion.h1>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-neutral-300 text-xl sm:text-2xl font-sans leading-relaxed text-center mb-12 max-w-3xl mx-auto"
          >
            Explore our latest posts and blogs
          </motion.p>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-200 bg-red-500/20 p-4 rounded-lg text-center mb-4"
            >
              {error}
            </motion.p>
          )}
          {posts.length === 0 ? (
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-neutral-300 text-xl font-sans text-center"
            >
              No posts available at the moment.
            </motion.p>
          ) : (
            <div className="flex flex-col gap-8">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-neutral-800/50 backdrop-blur-md border border-neutral-700/30 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-[#FF5722]/20 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group focus:outline-none focus:ring-2 focus:ring-[#FF5722] rounded-xl"
                    aria-label={`Read ${post.title}`}
                  >
                    <div className="relative w-full aspect-square overflow-hidden bg-neutral-700/50">
                      <img
                        src={post.image}
                        alt={`Thumbnail for ${post.title} article`}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          console.log(`Failed to load image for ${post.title}: ${post.image}`);
                          e.target.src = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 to-transparent"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-80 transition-opacity duration-300">
                        <svg
                          className="w-12 h-12 text-white bg-[#FF5722]/70 rounded-full p-3"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="p-6">
                      <h2 className="text-2xl font-serif font-semibold text-neutral-100 mb-4 tracking-tight">
                        {post.title}
                      </h2>
                      <motion.a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-white bg-gradient-to-r from-[#FF5722] to-[#FFC107] rounded-xl px-8 py-3 font-sans text-lg hover:bg-[#FF5722]/80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                        aria-label={`Visit ${post.title}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Visit
                      </motion.a>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <Link
              to="/"
              className="inline-block text-neutral-100 bg-gradient-to-r from-[#FF5722] to-[#FFC107] rounded-xl px-8 py-4 font-sans text-lg hover:bg-[#FF5722]/80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
              aria-label="Back to homepage"
            >
              Back to Homepage
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Posts;