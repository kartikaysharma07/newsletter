import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BlogCard = memo(({ blog }) => (
  <motion.div whileHover={{ scale: 1.05 }}>
    <Link to={`/blog/${blog.id}`} className="block">
      <div className="bg-neutral-800/50 backdrop-blur-md border border-neutral-700/30 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-[#FF5722]/20">
        <div className="relative h-48 overflow-hidden">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-contain transition-transform duration-500 hover:scale-110"
            loading="lazy"
            onError={(e) => (e.target.src = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60')}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 to-transparent"></div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-serif font-semibold text-neutral-100 mb-2">{blog.title}</h3>
          <p className="text-neutral-300 font-sans text-sm leading-6 line-clamp-2 mb-3">{blog.subtitle}</p>
          <div className="text-neutral-400 font-sans text-xs">
            By {blog.author} • {blog.date}
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
));

export default BlogCard;