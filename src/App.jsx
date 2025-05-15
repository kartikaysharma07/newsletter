import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './supabaseClient';
import Blogs from './pages/Blogs';
import BlogPost from './pages/BlogPost';
import Posts from './Posts';
import Website from './Website';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';

const App = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);
  const [blogError, setBlogError] = useState('');

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
    async function fetchBlogs() {
      try {
        setIsLoadingBlogs(true);
        setBlogError('');
        const { data, error } = await supabase
          .from('blogs')
          .select('id, title, subtitle, image_url')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setBlogs(
          data.map((blog) => ({
            id: blog.id,
            title: blog.title,
            excerpt: blog.subtitle,
            image: blog.image_url || 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60',
            url: `/blog/${blog.id}`,
          }))
        );
      } catch (error) {
        console.error('Error fetching blogs:', error.message);
        setBlogError('Failed to load blogs. Please try again later.');
      } finally {
        setIsLoadingBlogs(false);
      }
    }
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (isAutoSliding && blogs.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % blogs.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoSliding, blogs]);

  useEffect(() => {
    if (message.text) {
      const timeout = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [message.text]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setMessage({ type: '', text: '' });
      setIsSubmitting(true);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }

      const { error } = await supabase.from('newsletter').insert([{ email }]);
      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Subscribed! Check your email for confirmation.',
      });
      setEmail('');
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to subscribe. Try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % blogs.length);
    setIsAutoSliding(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + blogs.length) % blogs.length);
    setIsAutoSliding(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
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
                          whileHover={{ scale: 1.05, textShadow: '0 0 8px rgba(255, 215, 0, 0.5)' }}
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
                      {user && (
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
                      {user && (
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
                      )}
                    </div>
                  </div>
                )}
              </nav>
              <div className="flex-1 pt-20 z-10">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="max-w-[1000px] mx-auto px-4 py-12 text-center"
                >
                  <h1 className="text-5xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 to-[#FFC107] mb-6">
                    Discover the Future of Tech
                  </h1>
                  <p className="text-neutral-100 text-xl md:text-2xl font-sans leading-8 max-w-[800px] mx-auto">
                    Join us to explore cutting-edge insights, trends, and innovations shaping tomorrow.
                  </p>
                </motion.div>
                <div
                  className="relative max-w-[1400px] mx-auto px-4 py-12"
                  onMouseEnter={() => setIsAutoSliding(false)}
                  onMouseLeave={() => setIsAutoSliding(true)}
                >
                  <h2 className="text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 to-[#FFC107] text-center mb-8">
                    Featured Blogs
                  </h2>
                  {blogError && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-200 bg-red-500/20 p-4 rounded-lg text-center mb-4"
                      role="alert"
                    >
                      {blogError}
                    </motion.p>
                  )}
                  {isLoadingBlogs ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {[...Array(3)].map((_, index) => (
                        <div
                          key={index}
                          className="bg-neutral-800/50 backdrop-blur-md border border-neutral-700/30 rounded-xl p-6 animate-pulse"
                        >
                          <div className="h-80 bg-neutral-700/50 rounded mb-4"></div>
                          <div className="h-6 bg-neutral-700/50 rounded mb-2"></div>
                          <div className="h-4 bg-neutral-700/50 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : blogs.length === 0 ? (
                    <p className="text-neutral-300 text-center">
                      No blogs available at the moment.
                    </p>
                  ) : (
                    <div className="overflow-hidden">
                      <motion.div
                        className="flex"
                        animate={{ x: `-${currentSlide * (100 / 3)}%` }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                      >
                        {blogs.map((blog) => (
                          <motion.div
                            key={blog.id}
                            className="w-full sm:w-1/2 md:w-1/3 flex-shrink-0 px-3"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Link to={blog.url} className="block">
                              <div className="bg-neutral-800/50 backdrop-blur-md border border-neutral-700/30 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-[#FF5722]/20 transition-all duration-300">
                                <div className="relative h-80 overflow-hidden">
                                  <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                    loading="lazy"
                                    onError={(e) => {
                                      e.target.src =
                                        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60';
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 to-transparent"></div>
                                </div>
                                <div className="p-6">
                                  <h3 className="text-2xl font-serif font-semibold text-neutral-100 mb-3">
                                    {blog.title}
                                  </h3>
                                  <p className="text-neutral-300 font-sans text-base leading-6 line-clamp-3">
                                    {blog.excerpt}
                                  </p>
                                  <motion.span
                                    className="inline-block mt-4 text-white bg-gradient-to-r from-[#FF5722] to-[#FFC107] rounded-xl px-5 py-2 font-sans hover:bg-[#FF5722]/80"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    Read More
                                  </motion.span>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                      <motion.button
                        onClick={prevSlide}
                        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-neutral-900/50 text-neutral-100 p-3 rounded-full hover:bg-[#FF5722]/80"
                        aria-label="Previous slide"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
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
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </motion.button>
                      <motion.button
                        onClick={nextSlide}
                        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-neutral-900/50 text-neutral-100 p-3 rounded-full hover:bg-[#FF5722]/80"
                        aria-label="Next slide"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
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
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </motion.button>
                    </div>
                  )}
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="max-w-[800px] mx-auto p-6"
                >
                  <div className="bg-neutral-800/50 backdrop-blur-md border border-neutral-700/30 rounded-xl p-8 shadow-lg">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 to-[#FFC107] text-center mb-4">
                      Join Our <span className="text-[#FF5722]">Ranjan Batra Tech Talks</span>
                    </h1>
                    <p className="text-neutral-300 mb-6 text-lg font-sans leading-7 text-center">
                      Subscribe to receive the latest tech insights directly in your inbox.
                    </p>
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <motion.input
                        className="w-full sm:w-[400px] text-neutral-100 pl-4 h-12 rounded-lg border border-neutral-700 bg-neutral-900/50 focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/50 transition-all outline-none"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        disabled={isSubmitting}
                        aria-label="Email address for newsletter"
                        whileFocus={{ scale: 1.02 }}
                      />
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full sm:w-auto text-white rounded-xl px-8 py-3 font-sans ${
                          isSubmitting
                            ? 'bg-[#FF5722]/50 cursor-not-allowed'
                            : 'bg-gradient-to-r from-[#FF5722] to-[#FFC107] hover:bg-[#FF5722]/80'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isSubmitting ? 'Submitting...' : 'Join Now'}
                      </motion.button>
                    </form>
                    <AnimatePresence>
                      {message.text && (
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          className={`mt-4 p-4 rounded-lg font-sans ${
                            message.type === 'error'
                              ? 'bg-red-500/20 text-red-200'
                              : 'bg-green-500/20 text-green-200'
                          }`}
                          role="alert"
                          aria-live="polite"
                        >
                          {message.text}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            </div>
          }
        />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/website" element={<Website />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
};

export default App;