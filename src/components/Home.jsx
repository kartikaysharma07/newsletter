import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from './pages/supabaseClient';
import FeaturedBlogs from './components/FeaturedBlogs';
import NewsletterForm from './components/NewsletterForm';

const Home = memo(() => {
  const { data: blogs = [], isLoading, error } = useQuery({
    queryKey: ['featuredBlogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, subtitle, image_url')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data.map((blog) => ({
        id: blog.id,
        title: blog.title,
        excerpt: blog.subtitle,
        image: blog.image_url || 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60',
        url: `/blog/${blog.id}`,
      }));
    },
  });

  return (
    <div className="flex-1 pt-16 sm:pt-20 relative z-20 bg-neutral-800 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-neutral-200 mb-4 drop-shadow-md">
          Unleash Tomorrow's Tech with Ranjan Batra TechTalks
        </h1>
        <p className="text-neutral-300 text-base sm:text-lg font-sans leading-6 max-w-3xl mx-auto drop-shadow">
          Dive into bold ideas, emerging trends, and groundbreaking innovations driving the future.
        </p>
      </motion.div>
      <FeaturedBlogs
        blogs={blogs}
        isLoadingBlogs={isLoading}
        blogError={error ? 'Failed to load blogs. Please try again later.' : ''}
      />
      <NewsletterForm />
    </div>
  );
});

export default Home;