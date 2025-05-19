import React, { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Memoized FeaturedBlogs component
const FeaturedBlogs = memo(({ blogs, isLoadingBlogs, blogError }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);

  // Calculate the maximum slide index based on the number of blogs
  const maxSlide = blogs.length > 0 ? Math.max(0, blogs.length - 3) : 0; // Show 3 blogs at a time

  useEffect(() => {
    if (isAutoSliding && blogs.length > 0 && blogs.length > 3) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => {
          if (prev >= maxSlide) {
            return 0; // Reset to first slide when reaching the last
          }
          return prev + 1;
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoSliding, blogs, maxSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      if (prev >= maxSlide) {
        return maxSlide; // Stop at the last slide
      }
      return prev + 1;
    });
    setIsAutoSliding(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      if (prev <= 0) {
        return 0; // Stop at the first slide
      }
      return prev - 1;
    });
    setIsAutoSliding(false);
  };

  return (
    <div
      className="relative max-w-[1400px] mx-auto px-4 py-12"
      onMouseEnter={() => setIsAutoSliding(false)}
      onMouseLeave={() => setIsAutoSliding(true)}
    >
      <h2 className="text-4xl font-['Playfair_Display'] font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#FFC107] text-center mb-8 drop-shadow-lg">
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
                className="w-full sm:w-1/2 md:w-1/3 flex-shrink-0 px-3"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Link to={blog.url} className="block h-full">
                  <div className="bg-neutral-800/50 backdrop-blur-md border border-neutral-700/30 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-[#FF5722]/20 transition-all duration-300 flex flex-col h-[500px]">
                    <div className="relative h-80 overflow-hidden flex-shrink-0 bg-neutral-900">
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
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-2xl font-serif font-semibold text-neutral-100 mb-3 line-clamp-2 h-16">
                        {blog.title}
                      </h3>
                      <p className="text-neutral-300 font-sans text-base leading-6 line-clamp-3 flex-grow">
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
          {blogs.length > 3 && (
            <>
              <motion.button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-neutral-900/50 text-neutral-100 p-3 rounded-full hover:bg-[#FF5722]/80 focus:outline-none"
                aria-label="Previous slide"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                disabled={currentSlide === 0} // Disable when at first slide
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
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-neutral-900/50 text-neutral-100 p-3 rounded-full hover:bg-[#FF5722]/80 focus:outline-none"
                aria-label="Next slide"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                disabled={currentSlide >= maxSlide} // Disable when at last slide
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
            </>
          )}
        </div>
      )}
    </div>
  );
});

export default FeaturedBlogs;