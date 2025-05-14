import React, { useEffect, useState } from 'react';
import { Link, useParams, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { blogs } from '../data/blogs';

const BlogPost = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [toc, setToc] = useState([]);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    try {
      console.log('ID from useParams:', id);
      const parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        throw new Error('Invalid blog ID');
      }
      const selectedBlog = blogs.find((b) => b.id === parsedId);
      console.log('Selected Blog:', selectedBlog);
      if (!selectedBlog) {
        throw new Error('Blog not found');
      }
      setBlog(selectedBlog);

      // Extract table of contents (H2 headings)
      const headings = [];
      const regex = /^##\s(.+)$/gm;
      let match;
      while ((match = regex.exec(selectedBlog.fullDescription)) !== null) {
        headings.push(match[1]);
      }
      setToc(headings);
    } catch (err) {
      console.error('Error in BlogPost:', err.message);
      setError(err.message);
    }
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen w-full bg-neutral-900 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&auto=format&fit=crop&q=60&ixlib=rb-4.0.3')] bg-cover bg-center bg-no-repeat font-sans flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        <p className="text-neutral-100 text-2xl z-10">{error}</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen w-full bg-neutral-900 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&auto=format&fit=crop&q=60&ixlib=rb-4.0.3')] bg-cover bg-center bg-no-repeat font-sans flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        <p className="text-neutral-100 text-2xl z-10">Loading...</p>
      </div>
    );
  }

  const handleTocClick = (heading) => {
    const element = document.getElementById(heating.toLowerCase().replace(/\s/g, '-'));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const shareBlog = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.subtitle,
        url: window.location.href,
      }).catch((err) => console.error('Share failed:', err));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch((err) => console.error('Copy failed:', err));
    }
  };

  // Related Blogs (excluding the current blog)
  const relatedBlogs = blogs
    .filter((b) => b.id !== blog.id)
    .slice(0, 3);

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
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-12"
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full max-h-96 object-contain rounded-xl mb-8"
              loading="lazy"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60';
              }}
            />
            <h1 className="text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 to-[#FFC107] mb-4">
              {blog.title}
            </h1>
            <p className="text-2xl font-sans italic text-neutral-400 mb-6">
              {blog.subtitle}
            </p>
            <div className="text-neutral-400 font-sans text-sm mb-8">
              By {blog.author} • {blog.date} • {blog.readTime}
            </div>
            <button
              onClick={shareBlog}
              className="text-white bg-gradient-to-r from-[#FF5722] to-[#FFC107] rounded-xl px-5 py-2 font-sans hover:bg-[#FF5722]/80"
              aria-label="Share this blog post"
            >
              Share This Post
            </button>
          </motion.div>
          {/* Content Body with TOC */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Table of Contents */}
            {toc.length > 0 && (
              <motion.aside
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="lg:w-1/4 hidden lg:block"
              >
                <div className="sticky top-24 bg-neutral-800/50 backdrop-blur-md border border-neutral-700/30 rounded-xl p-6">
                  <h2 className="text-xl font-serif font-bold text-neutral-100 mb-4">
                    Table of Contents
                  </h2>
                  <ul className="space-y-2">
                    {toc.map((heading, index) => (
                      <li key={index}>
                        <button
                          onClick={() => handleTocClick(heading)}
                          className="text-neutral-300 font-sans text-sm hover:text-[#FFC107] transition-colors"
                        >
                          {heading}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.aside>
            )}
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="lg:w-3/4"
            >
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    h2: ({ node, ...props }) => (
                      <h2
                        id={props.children.toString().toLowerCase().replace(/\s/g, '-')}
                        className="text-2xl font-serif font-bold text-neutral-100 mt-8 mb-4"
                        {...props}
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="text-neutral-300 font-sans leading-7 mb-4" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc list-inside text-neutral-300 font-sans mb-4" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal list-inside text-neutral-300 font-sans mb-4" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="text-neutral-300 font-sans" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote className="border-l-4 border-[#FF5722] pl-4 italic text-neutral-400 font-sans my-4" {...props} />
                    ),
                  }}
                >
                  {blog.fullDescription}
                </ReactMarkdown>
              </div>
            </motion.div>
          </div>
          {/* Related Blogs Section */}
          {relatedBlogs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mt-16"
            >
              <h2 className="text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 to-[#FFC107] text-center mb-8">
                Related Blogs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedBlogs.map((relatedBlog) => (
                  <motion.div
                    key={relatedBlog.id}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link to={`/blogs/${relatedBlog.id}`} className="block">
                      <div className="bg-neutral-800/50 backdrop-blur-md border border-neutral-700/30 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-[#FF5722]/20 transition-all duration-300">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={relatedBlog.image}
                            alt={relatedBlog.title}
                            className="w-full h-full object-contain transition-transform duration-500 hover:scale-110"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 to-transparent"></div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-serif font-semibold text-neutral-100 mb-2">
                            {relatedBlog.title}
                          </h3>
                          <p className="text-neutral-300 font-sans text-sm leading-6 line-clamp-2 mb-3">
                            {relatedBlog.subtitle}
                          </p>
                          <div className="text-neutral-400 font-sans text-xs">
                            By {relatedBlog.author} • {relatedBlog.date}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          {/* Back to Blogs Button */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <Link
              to="/blogs"
              className="inline-block text-neutral-100 bg-gradient-to-r from-[#FF5722] to-[#FFC107] rounded-xl px-8 py-4 hover:bg-[#FF5722]/80 transition-colors font-sans"
              aria-label="Back to all blogs"
            >
              Back to Blogs
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;