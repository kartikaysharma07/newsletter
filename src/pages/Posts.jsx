import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from './supabaseClient';
import Navbar from '../components/Navbar';
import ErrorBoundary from '../components/ErrorBoundary';

const PostCard = memo(({ post }) => (
  <motion.div whileHover={{ scale: 1.05 }} className="bg-neutral-800/50 backdrop-blur-md border border-neutral-700/30 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-[#FF5722]/20">
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
          alt={`Thumbnail for ${post.title}`}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => (e.target.src = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 to-transparent"></div>
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-serif font-semibold text-neutral-100 mb-4 tracking-tight">{post.title}</h2>
        <motion.a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-white bg-gradient-to-r from-[#FF5722] to-[#FFC107] rounded-xl px-8 py-3 font-sans text-lg hover:bg-[#FF5722]/80"
          aria-label={`Visit ${post.title}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Visit
        </motion.a>
      </div>
    </a>
  </motion.div>
));

const Posts = memo(() => {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
  });

  const { data: posts = [], error, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, url, image_url')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data.map((post) => ({
        id: post.id,
        title: post.title,
        url: post.url,
        image: post.image_url || 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60',
      }));
    },
  });

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-neutral-900 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa')] bg-cover bg-center font-sans flex flex-col overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70 z-0"></div>
        <Navbar user={user} />
        <div className="flex-1 pt-28 sm:pt-32 pb-12 z-20">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center mb-10">
              <img
                src="https://vvjaqiowlgkabmchvmhi.supabase.co/storage/v1/object/public/website-assets/logo.svg"
                alt="RBTechTalks Logo"
                className="w-10 h-10 mr-3"
                loading="lazy"
                onError={(e) => (e.target.src = 'https://via.placeholder.com/40')}
              />
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl sm:text-6xl font-serif font-bold text-heading-gradient"
              >
                Posts
              </motion.h1>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
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
                Failed to load posts: {error.message}
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
            ) : posts.length === 0 ? (
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-neutral-300 text-xl font-sans text-center"
              >
                No posts available at the moment.
              </motion.p>
            ) : (
              <div className="flex flex-col gap-8">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="mt-16 text-center">
              <Link
                to="/"
                className="inline-block text-neutral-100 bg-gradient-to-r from-[#FF5722] to-[#FFC107] rounded-xl px-8 py-4 font-sans hover:bg-[#FF5722]/80"
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

export default Posts;