import React, { memo, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQueries } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import { supabase } from './supabaseClient';
import Navbar from '../components/Navbar';
import ErrorBoundary from '../components/ErrorBoundary';
import BlogCard from '../components/BlogCard';

const BlogPost = memo(() => {
  const { id } = useParams();
  const [toc, setToc] = React.useState([]);

  const sanitizeId = useCallback(
    (text) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-'),
    []
  );

  const handleTocClick = useCallback(
    (heading) => {
      const element = document.getElementById(sanitizeId(heading));
      element?.scrollIntoView({ behavior: 'smooth' });
    },
    [sanitizeId]
  );

  const shareBlog = useCallback(
    async (blog) => {
      const shareData = { title: blog.title, text: blog.subtitle, url: window.location.href };
      try {
        if (navigator.share) await navigator.share(shareData);
        else if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareData.url);
          alert('Link copied to clipboard!');
        } else alert('Sharing not supported. Copy the URL manually.');
      } catch (err) {
        console.error('Share failed:', err);
        try {
          if (navigator.clipboard) {
            await navigator.clipboard.writeText(shareData.url);
            alert('Link copied to clipboard!');
          } else alert('Sharing not supported. Copy the URL manually.');
        } catch (clipboardErr) {
          console.error('Clipboard copy failed:', clipboardErr);
          alert('Sharing not supported. Copy the URL manually.');
        }
      }
    },
    []
  );

  const queries = useQueries({
    queries: [
      {
        queryKey: ['blog', id],
        queryFn: async () => {
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          if (!uuidRegex.test(id)) throw new Error('Invalid blog ID format');

          const { data, error } = await supabase
            .from('blogs')
            .select('id, title, subtitle, image_url, author, date, read_time, full_description')
            .eq('id', id)
            .maybeSingle();
          if (error) throw error;
          if (!data) throw new Error('Blog not found');

          const headings = [];
          const regex = /^##\s(.+)$/gm;
          let match;
          while ((match = regex.exec(data.full_description)) !== null) {
            headings.push(match[1]);
          }
          setToc(headings);

          return {
            id: data.id,
            title: data.title,
            subtitle: data.subtitle,
            image: data.image_url || 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60',
            author: data.author,
            date: new Date(data.date).toLocaleDateString(),
            readTime: `${data.read_time} min read`,
            fullDescription: data.full_description,
          };
        },
      },
      {
        queryKey: ['relatedBlogs', id],
        queryFn: async () => {
          const { data, error } = await supabase
            .from('blogs')
            .select('id, title, subtitle, image_url, author, date')
            .neq('id', id)
            .order('created_at', { ascending: false })
            .limit(3);
          if (error) throw error;
          return data.map((b) => ({
            id: b.id,
            title: b.title,
            subtitle: b.subtitle,
            image: b.image_url || 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60',
            author: b.author,
            date: new Date(b.date).toLocaleDateString(),
          }));
        },
      },
      {
        queryKey: ['user'],
        queryFn: async () => {
          const { data: { user }, error } = await supabase.auth.getUser();
          if (error) {
            console.warn('No auth session, proceeding as unauthenticated:', error.message);
            return null; // Allow unauthenticated access
          }
          return user;
        },
      },
    ],
  });

  const [blogQuery, relatedBlogsQuery, userQuery] = queries;
  const blog = blogQuery.data;
  const relatedBlogs = relatedBlogsQuery.data || [];
  const user = userQuery.data;
  const error = queries.find((q) => q.error)?.error?.message;
  const isLoading = queries.some((q) => q.isLoading);

  if (error) {
    return (
      <div
        className="min-h-screen bg-neutral-800 font-sans flex items-center justify-center"
        style={{
          backgroundImage: `url('/bg2.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        <p className="text-neutral-200 text-2xl z-10">{error}</p>
      </div>
    );
  }

  if (isLoading || !blog) {
    return (
      <div
        className="min-h-screen bg-neutral-800 font-sans flex items-center justify-center"
        style={{
          backgroundImage: `url('/bg2.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        <p className="text-neutral-200 text-2xl z-10">Loading...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div
        className="min-h-screen bg-neutral-800 font-sans flex flex-col overflow-hidden"
        style={{
          backgroundImage: `url('/bg3.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        <Navbar user={user} />
        <div className="flex-1 pt-28 sm:pt-32 pb-8 z-20">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
              <h1 className="text-5xl font-serif font-bold text-heading-gradient mb-4">
                {blog.title}
              </h1>
              <p className="text-2xl font-sans italic text-neutral-300 mb-6">{blog.subtitle}</p>
              <div className="text-neutral-300 font-sans text-sm mb-8">
                By {blog.author} • {blog.date} • {blog.readTime}
              </div>
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full max-w-7xl object-contain rounded-xl mb-8 mx-auto"
                loading="lazy"
                onError={(e) => (e.target.src = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60')}
              />
              <button
                onClick={() => shareBlog(blog)}
                className="flex items-center gap-2 text-neutral-200 bg-gradient-to-r from-[#FF5722] to-[#FFC107] rounded-xl px-5 py-2 font-sans hover:bg-[#FF5722]/80"
                aria-label="Share this blog post"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Share This Post
              </button>
            </motion.div>
            <div className="flex flex-col lg:flex-row gap-8">
              {toc.length > 0 && (
                <motion.aside
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="lg:w-1/4 hidden lg:block"
                >
                  <div className="sticky top-24 bg-neutral-700/50 backdrop-blur-md border border-neutral-600/30 rounded-xl p-6">
                    <h2 className="text-xl font-serif font-bold text-heading-gradient mb-4">Table of Contents</h2>
                    <ul className="space-y-2">
                      {toc.map((heading, index) => (
                        <li key={index}>
                          <button
                            onClick={() => handleTocClick(heading)}
                            className="text-neutral-200 font-sans text-sm hover:text-[#f8b500] transition-colors"
                          >
                            {heading}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.aside>
              )}
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="lg:w-3/4">
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      h2: ({ node, ...props }) => (
                        <h2
                          id={sanitizeId(props.children.toString())}
                          className="text-2xl font-serif font-bold text-heading-gradient mt-8 mb-4"
                          {...props}
                        />
                      ),
                      p: ({ node, ...props }) => <p className="text-neutral-200 font-sans leading-7 mb-4" {...props} />,
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc list-inside text-neutral-200 font-sans mb-4" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal list-inside text-neutral-200 font-sans mb-4" {...props} />
                      ),
                      li: ({ node, ...props }) => <li className="text-neutral-200 font-sans" {...props} />,
                      blockquote: ({ node, ...props }) => (
                        <blockquote
                          className="border-l-4 border-[#FF5722] pl-4 italic text-neutral-300 font-sans my-4"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {blog.fullDescription}
                  </ReactMarkdown>
                </div>
              </motion.div>
            </div>
            {relatedBlogs.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="mt-16">
                <h2 className="text-4xl font-serif font-bold text-heading-gradient text-center mb-8">
                  Related Blogs
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {relatedBlogs.map((relatedBlog) => (
                    <BlogCard key={relatedBlog.id} blog={relatedBlog} />
                  ))}
                </div>
              </motion.div>
            )}
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="mt-12 text-center">
              <Link
                to="/blogs"
                className="inline-block text-neutral-200 bg-gradient-to-r from-[#FF5722] to-[#FFC107] rounded-xl px-8 py-4 hover:bg-[#FF5722]/80 font-sans"
                aria-label="Back to all blogs"
              >
                Back to Blogs
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default BlogPost;