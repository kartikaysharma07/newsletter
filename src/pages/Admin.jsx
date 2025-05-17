import React, { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabaseClient';
import ErrorBoundary from '../components/ErrorBoundary';
import FormGenerator from '../components/FormGenerator';
import DataTable from '../components/DataTable';

const Admin = memo(() => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Check user authentication
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (!user) throw new Error('Unauthorized');
      return user;
    },
  });

  // Fetch blogs
  const { data: blogs = [], isLoading: isBlogsLoading, error: blogsError } = useQuery({
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
        image_url: blog.image_url || 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60',
        author: blog.author,
        date: new Date(blog.date).toLocaleDateString(),
        read_time: `${blog.read_time} min read`,
      }));
    },
    enabled: !!user,
  });

  // Fetch posts
  const { data: posts = [], isLoading: isPostsLoading, error: postsError } = useQuery({
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
        image_url: post.image_url || 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60',
      }));
    },
    enabled: !!user,
  });

  // Delete blog mutation
  const deleteBlogMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('blogs').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries(['blogs']),
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries(['posts']),
  });

  // Form submission for new blog
  const handleBlogSubmit = useCallback(
    async (formData) => {
      try {
        const { title, subtitle, image, author, date, read_time, full_description } = formData;
        let image_url = image;

        if (image instanceof File) {
          const { data, error } = await supabase.storage
            .from('blog-images')
            .upload(`public/${Date.now()}_${image.name}`, image);
          if (error) throw error;
          image_url = supabase.storage.from('blog-images').getPublicUrl(data.path).data.publicUrl;
        }

        const { error } = await supabase.from('blogs').insert({
          title,
          subtitle,
          image_url,
          author,
          date,
          read_time: parseInt(read_time, 10),
          full_description,
        });
        if (error) throw error;
        queryClient.invalidateQueries(['blogs']);
      } catch (err) {
        throw new Error(`Failed to create blog: ${err.message}`);
      }
    },
    [queryClient]
  );

  // Form submission for new post
  const handlePostSubmit = useCallback(
    async (formData) => {
      try {
        const { title, url, image } = formData;
        let image_url = image;

        if (image instanceof File) {
          const { data, error } = await supabase.storage
            .from('image-url')
            .upload(`public/${Date.now()}_${image.name}`, image);
          if (error) throw error;
          image_url = supabase.storage.from('image-url').getPublicUrl(data.path).data.publicUrl;
        }

        const { error } = await supabase.from('posts').insert({ title, url, image_url });
        if (error) throw error;
        queryClient.invalidateQueries(['posts']);
      } catch (err) {
        throw new Error(`Failed to create post: ${err.message}`);
      }
    },
    [queryClient]
  );

  // Handle delete actions
  const handleDeleteBlog = useCallback((id) => deleteBlogMutation.mutate(id), [deleteBlogMutation]);
  const handleDeletePost = useCallback((id) => deletePostMutation.mutate(id), [deletePostMutation]);

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center font-sans">
        <p className="text-neutral-100 text-xl font-sans">Loading...</p>
      </div>
    );
  }

  if (!user) {
    navigate('/admin/login', { replace: true });
    return null;
  }

  return (
    <ErrorBoundary>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-neutral-900 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa')] bg-cover bg-center font-sans flex flex-col p-4 pt-28 sm:pt-32 z-20"
      >
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        <div className="max-w-[1400px] mx-auto w-full z-10 pb-8">
          <h1 className="text-4xl font-serif font-bold text-heading-gradient mb-8">
            Admin Dashboard
          </h1>

          {(blogsError || postsError) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-red-600/50 text-red-100 rounded mb-4 font-sans"
              role="alert"
            >
              {blogsError?.message || postsError?.message}
            </motion.div>
          )}

          <section className="mb-12" role="region" aria-label="Create new blog">
            <h2 className="text-2xl font-serif font-semibold text-neutral-100 mb-4">Create New Blog</h2>
            <FormGenerator
              fields={[
                { name: 'title', label: 'Title', type: 'text', required: true },
                { name: 'subtitle', label: 'Subtitle', type: 'text', required: true },
                { name: 'image', label: 'Image', type: 'file', accept: 'image/*' },
                { name: 'author', label: 'Author', type: 'text', required: true },
                { name: 'date', label: 'Date', type: 'date', required: true },
                { name: 'read_time', label: 'Read Time (minutes)', type: 'number', required: true },
                { name: 'full_description', label: 'Full Description', type: 'textarea', required: true },
              ]}
              onSubmit={handleBlogSubmit}
              submitButtonText="Create Blog"
              className="bg-neutral-800/50 backdrop-blur-md p-6 rounded-xl border border-neutral-700"
            />
          </section>

          <section className="mb-12" role="region" aria-label="Manage blogs">
            <h2 className="text-2xl font-serif font-semibold text-neutral-100 mb-4">Manage Blogs</h2>
            {isBlogsLoading ? (
              <p className="text-neutral-300 font-sans">Loading blogs...</p>
            ) : blogs.length === 0 ? (
              <p className="text-neutral-300 font-sans">No blogs available.</p>
            ) : (
              <DataTable
                data={blogs}
                columns={[
                  { header: 'Title', accessor: 'title' },
                  { header: 'Author', accessor: 'author' },
                  { header: 'Date', accessor: 'date' },
                  {
                    header: 'Actions',
                    accessor: 'id',
                    render: (id) => (
                      <button
                        onClick={() => handleDeleteBlog(id)}
                        className="text-red-400 hover:text-red-600 font-sans"
                        disabled={deleteBlogMutation.isPending}
                        aria-label={`Delete blog ${id}`}
                      >
                        Delete
                      </button>
                    ),
                  },
                ]}
                className="bg-neutral-800/50 backdrop-blur-md rounded-xl border border-neutral-700"
              />
            )}
          </section>

          <section className="mb-12" role="region" aria-label="Create new post">
            <h2 className="text-2xl font-serif font-semibold text-neutral-100 mb-4">Create New Post</h2>
            <FormGenerator
              fields=[
                { name: 'title', label: 'Title', type: 'text', required: true },
                { name: 'url', label: 'URL', type: 'url', required: true },
                { name: 'image', label: 'Image', type: 'file', accept: 'image/*' },
              ]
              onSubmit={handlePostSubmit}
              submitButtonText="Create Post"
              className="bg-neutral-800/50 backdrop-blur-md p-6 rounded-xl border border-neutral-700"
            />
          </section>

          <section role="region" aria-label="Manage posts">
            <h2 className="text-2xl font-serif font-semibold text-neutral-100 mb-4">Manage Posts</h2>
            {isPostsLoading ? (
              <p className="text-neutral-300 font-sans">Loading posts...</p>
            ) : posts.length === 0 ? (
              <p className="text-neutral-300 font-sans">No posts available.</p>
            ) : (
              <DataTable
                data={posts}
                columns={[
                  { header: 'Title', accessor: 'title' },
                  {
                    header: 'URL',
                    accessor: 'url',
                    render: (url) => (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FFC107] hover:underline font-sans"
                        aria-label={`Visit ${url}`}
                      >
                        {url}
                      </a>
                    ),
                  },
                  {
                    header: 'Actions',
                    accessor: 'id',
                    render: (id) => (
                      <button
                        onClick={() => handleDeletePost(id)}
                        className="text-red-400 hover:text-red-600 font-sans"
                        disabled={deletePostMutation.isPending}
                        aria-label={`Delete post ${id}`}
                      >
                        Delete
                      </button>
                    ),
                  },
                ]}
                className="bg-neutral-800/50 backdrop-blur-md rounded-xl border border-neutral-700"
              />
            )}
          </section>
        </div>
      </motion.div>
    </ErrorBoundary>
  );
});

export default Admin;