import React, { memo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from './pages/supabaseClient';
import Blogs from './pages/Blogs';
import BlogPost from './pages/BlogPost';
import Posts from './pages/Posts';
import Website from './pages/Website';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import Navbar from './components/Navbar';
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
    <div className="flex-1 pt-16 relative z-20 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center"
      >
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-heading-gradient mb-4 drop-shadow">
          Unleash Tomorrow's Tech with Ranjan Batra TechTalks
        </h1>
        <p className="text-neutral-100 text-base sm:text-lg font-sans leading-6 max-w-3xl mx-auto drop-shadow">
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

const App = memo(() => {
  const queryClient = useQueryClient();
  const { data: user, refetch: refetchUser } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
    initialData: null,
  });

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      refetchUser();
      queryClient.setQueryData(['user'], session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [refetchUser, queryClient]);

  return (
    <Router>
      <div className="min-h-screen w-full bg-neutral-800 font-sans relative flex flex-col">
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        <Navbar user={user} />
        <main className="flex-1 relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/website" element={<Website />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="*" element={<div className="text-neutral-100 text-center py-12">404: Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
});

export default App;