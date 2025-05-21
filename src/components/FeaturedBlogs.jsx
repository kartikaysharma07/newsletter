import React, { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FeaturedBlogs = memo(({ blogs, isLoadingBlogs, blogError }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const maxSlide = blogs.length > 0 ? Math.max(0, blogs.length - 3) : 0;

  useEffect(() => {
    if (isAutoSliding && blogs.length > 0 && blogs.length > 3) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoSliding, blogs, maxSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev >= maxSlide ? maxSlide : prev + 1));
    setIsAutoSliding(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev <= 0 ? 0 : prev - 1));
    setIsAutoSliding(false);
  };

  return (
    <div
      className="relative max-w-[1400px] mx-auto px-4 py-8"
      onMouseEnter={() => setIsAutoSliding(false)}
      onMouseLeave={() => setIsAutoSliding(true)}
    >
      <h2 className="text-3xl font-['Playfair_Display'] font-bold text-neutral-200 text-center mb-6 drop-shadow-md">
        Featured Blogs
      </h2>
      {blogError && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-200 bg-red-500/20 p-3 rounded-lg text-center mb-4"
          role="alert"
        >
          {blogError}
        </motion.p>
      )}
      {isLoadingBlogs ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-neutral-800/50 backdrop-blur-md border border-neutral-700/30 rounded-xl p-4 animate-pulse"
            >
              <div className="h-56 bg-neutral-700/50 rounded mb-3"></div>
              <div className="h-5 bg-neutral-700/50 rounded mb-2"></div>
              <div className="h-4 bg-neutral-700/50 rounded"></div>
            </div>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <p className="text-neutral-300 text-center">No blogs available at the moment.</p>
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
                className="w-full sm:w-1/2 md:w-1/3 flex-shrink-0 px-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Link to={blog.url} className="block h-full">
                  <div className="bg-neutral-800/50 backdrop-blur-md border border-neutral-700/30 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-[#FF5722]/20 transition-all duration-300 flex flex-col h-[380px]">
                    <div className="relative h-56 overflow-hidden flex-shrink-0 bg-neutral-900 aspect-[4/3]">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-contain transition-transform duration-500 hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 to-transparent"></div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-xl font-serif font-semibold text-neutral-200 mb-2 line-clamp-2 h-12">
                        {blog.title}
                      </h3>
                      <p className="text-neutral-300 font-sans text-sm leading-5 line-clamp-3 flex-grow">
                        {blog.excerpt}
                      </p>
                      <motion.span
                        className="inline-block mt-3 text-neutral-200 bg-gradient-to-r from-[#FF5722] to-[#FFC107] rounded-lg px-4 py-1.5 font-sans hover:bg-[#FF5722]/80"
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
          {blogs.length > 3 && (
            <>
              <motion.button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-neutral-900/50 text-neutral-200 p-2 rounded-full hover:bg-[#FF5722]/80 focus:outline-none"
                aria-label="Previous slide"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                disabled={currentSlide === 0}
              >
                <svg
                  className="w-5 h-5"
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
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-neutral-900/50 text-neutral-200 p-2 rounded-full hover:bg-[#FF5722]/80 focus:outline-none"
                aria-label="Next slide"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                disabled={currentSlide >= maxSlide}
              >
                <svg
                  className="w-5 h-5"
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
            </>
          )}
        </div>
      )}
    </div>
  );
});

export default FeaturedBlogs;