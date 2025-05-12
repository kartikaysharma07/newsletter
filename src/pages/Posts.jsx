import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Initial posts data (replace with your actual data)
const initialPosts = [
  {
    id: 1,
    title: 'GENERATIVE AI MIXER',
    url: 'https://www.linkedin.com/posts/cd-conrad_yesterday-i-had-the-pleasure-of-attending-activity-7199108282630778881-q5qC?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEIyWKUB4fJP36ipamWHViQZT1VdTtLBGZU',
    image: 'img1.jpeg',
  },
  {
    id: 2,
    title: 'Post 2',
    url: 'https://www.linkedin.com/posts/ranjan-batra-a1804856_chainlit-langchain-activity-7199227392073097216-_bVK?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEIyWKUB4fJP36ipamWHViQZT1VdTtLBGZU',
    image: 'img2.jpeg',
  },
  {
    id: 3,
    title: 'Post 3',
    url: 'https://www.linkedin.com/posts/ranjan-batra-a1804856_what-a-turnout-at-the-ai-showcase-mixer-activity-7313673247152111616-cHKK?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEIyWKUB4fJP36ipamWHViQZT1VdTtLBGZU',
    image: 'img3.jpeg',
  },
];

const Posts = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState({ title: '', url: '', image: '' });
  const [error, setError] = useState('');

  const handleAddPost = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.url || !newPost.image) {
      setError('All fields are required.');
      return;
    }
    setError('');
    setPosts([
      ...posts,
      {
        id: posts.length + 1,
        title: newPost.title,
        url: newPost.url,
        image: newPost.image,
      },
    ]);
    setNewPost({ title: '', url: '', image: '' });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans py-8">
      <div className="max-w-[900px] mx-auto p-4">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-neutral-200 to-neutral-600 text-center mb-8">
          Client Posts
        </h1>
        <p className="text-neutral-500 mb-6 text-lg text-center">
          Explore our clients' latest posts and articles.
        </p>

        {/* Form to add new post */}
        <form onSubmit={handleAddPost} className="mb-12 flex flex-col gap-4">
          <input
            type="text"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            placeholder="Post title"
            className="p-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:border-[#ff4922]"
            aria-label="Post title"
          />
          <input
            type="url"
            value={newPost.url}
            onChange={(e) => setNewPost({ ...newPost, url: e.target.value })}
            placeholder="Post URL (e.g., https://example.com)"
            className="p-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:border-[#ff4922]"
            aria-label="Post URL"
          />
          <input
            type="url"
            value={newPost.image}
            onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
            placeholder="Image URL (e.g., https://your-cdn.com/image.jpg)"
            className="p-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:border-[#ff4922]"
            aria-label="Image URL"
          />
          {error && (
            <p className="text-red-200 text-sm" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="text-white bg-[#ff4922] rounded-xl px-6 py-2 hover:bg-[#ff4922]/80 transition-colors"
            aria-label="Add new post"
          >
            Add Post
          </button>
        </form>

        {/* Posts list */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-6 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                aria-label={`Read ${post.title}`}
              >
                <img
                  src={post.image}
                  alt={`${post.title} thumbnail`}
                  className="w-[540px] h-[960px] object-cover rounded-md mx-auto sm:w-[270px] sm:h-[480px]"
                  loading="lazy"
                />
                <h2 className="text-2xl font-semibold text-neutral-200 text-center mt-4">
                  {post.title}
                </h2>
              </a>
              <div className="mt-4 text-center">
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-white bg-[#ff4922] rounded-xl px-6 py-2 hover:bg-[#ff4922]/80 transition-colors"
                  aria-label={`Visit ${post.title}`}
                >
                  Visit
                </a>
              </div>
            </div>
          ))}
        </div>
        <Link
          to="/"
          className="mt-12 inline-block text-white bg-[#ff4922] rounded-xl px-6 py-3 hover:bg-[#ff4922]/80 transition-colors mx-auto block w-fit"
          aria-label="Back to newsletter subscription"
        >
          Back to Newsletter
        </Link>
      </div>
    </div>
  );
};

export default Posts;