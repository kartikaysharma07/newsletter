import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from './supabaseClient';
import Navbar from '../components/Navbar';
import ErrorBoundary from '../components/ErrorBoundary';
import BlogCard from '../components/BlogCard';

const Blogs = memo(() => {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
  });

  const { data: blogs = [], error, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, subtitle, image_url, author, date, read_time')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data.map((blog) => ({
        id: blog.id,
        title: blog.title,
        subtitle: blog.subtitle,
        image: blog.image_url || 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60',
        author: blog.author,
        date: new Date(blog.date).toLocaleDateString(),
        readTime: `${blog.read_time} min read`,
      }));
    },
  });

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-neutral-900 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa')] bg-cover bg-center font-sans flex flex-col overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        <Navbar user={user} />
        <div className="flex-1 pt-28 sm:pt-32 pb-8 z-20">
          <div className="max-w-[1400px] mx-auto p-6">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-serif font-bold text-heading-gradient text-center mb-10"
            >
              Our Blogs
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-neutral-300 mb-8 text-xl font-sans leading-7 text-center"
            >
              Immerse yourself in our latest insights on technology and innovation.
            </motion.p>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-200 bg-red-500/20 p-4 rounded-lg text-center mb-4"
              >
                Failed to load blogs: {error.message}
              </motion.p>
            )}
            {isLoading ? (
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-neutral-300 text-xl font-sans text-center"
              >
                Loading...
              </motion.p>
            ) : blogs.length === 0 ? (
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-neutral-300 text-xl font-sans text-center"
              >
                No blogs available at the moment.
              </motion.p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {blogs.map((blog) => (
                  <BlogCard key={blog.id} blog={{ ...blog, readTime: blog.readTime }} />
                ))}
              </div>
            )}
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="mt-12 text-center">
              <Link
                to="/"
                className="inline-block text-neutral-100 bg-gradient-to-r from-[#FF5722] to-[#FFC107] rounded-xl px-8 py-4 hover:bg-[#FF5722]/80 font-sans"
                aria-label="Back to homepage"
              >
                Back to Homepage
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default Blogs;