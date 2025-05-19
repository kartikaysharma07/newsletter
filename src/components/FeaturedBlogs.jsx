import React, { useState, useEffect, memo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

// Memoized FeaturedBlogs component
const FeaturedBlogs = memo(({ blogs, isLoadingBlogs, blogError }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const [slidesPerView, setSlidesPerView] = useState(3); // Default for desktop
  const containerRef = useRef(null);

  // Determine slides per view based on window width
  useEffect(() => {
    const updateSlidesPerView = () => {
      if (window.innerWidth < 640) {
        setSlidesPerView(1); // Mobile: 1 slide
      } else if (window.innerWidth < 768) {
        setSlidesPerView(2); // Small screens: 2 slides
      } else {
        setSlidesPerView(3); // Desktop: 3 slides
      }
    };

    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);
    return () => window.removeEventListener('resize', updateSlidesPerView);
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (isAutoSliding && blogs.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % blogs.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoSliding, blogs]);

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % blogs.length);
    setIsAutoSliding(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + blogs.length) % blogs.length);
    setIsAutoSliding(false);
  };

  // Swipe handlers for mobile
  const handlers = useSwipeable({
    onSwipedLeft: () => nextSlide(),
    onSwipedRight: () => prevSlide(),
    trackMouse: true, // Enable mouse dragging for desktop
    delta: 10, // Minimum swipe distance
  });

  // Calculate slide width percentage
  const slideWidthPercentage = 100 / slidesPerView;

  return (
    <div
      className="relative max-w-[1400px] mx-auto px-4 py-12"
      onMouseEnter={() => setIsAutoSliding(false)}
      onMouseLeave={() => setIsAutoSliding(true)}
      ref={containerRef}
      {...handlers}
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
            animate={{ x: `-${currentSlide * slideWidthPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            style={{ width: `${blogs.length * slideWidthPercentage}%` }}
          >
            {blogs.map((blog) => (
              <motion.div
                key={blog.id}
                className="flex-shrink-0 px-3"
                style={{ width: `${slideWidthPercentage}%` }}
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
  );
});

export default FeaturedBlogs;