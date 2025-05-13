import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

// Note: This code uses 'animate-fade-in', which requires the '@tailwindcss/animate' plugin in your Tailwind config.

// Updated posts data with unique Unsplash URLs (1:1 aspect ratio for YouTube-like appearance)
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
    image: 'img2.jpeg', // Updated to a different tech-related image
  },
  {
    id: 3,
    title: 'Post 3',
    url: 'https://www.linkedin.com/posts/ranjan-batra-a1804856_what-a-turnout-at-the-ai-showcase-mixer-activity-7313673247152111616-cHKK?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEIyWKUB4fJP36ipamWHViQZT1VdTtLBGZU',
    image: 'img3.jpeg',
  },
];

const Posts = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen text-center w-full bg-neutral-900 bg-[url('https://images.unsplash.com/photo-1618005182384-5a9a1e1e60f9?w=1920&auto=format&fit=crop&q=60')] bg-cover bg-center bg-no-repeat font-sans relative flex flex-col">
      <div className="absolute inset-0 bg-black/80 z-0"></div>
      <nav className="fixed top-0 w-full bg-neutral-800/80 backdrop-blur-md z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link to="/" className="text-3xl font-extrabold text-white tracking-tight">
                Newsletter
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-lg font-medium text-white hover:text-[#ff4922] transition-colors duration-300 ${
                    isActive ? 'text-[#ff4922]' : ''
                  }`
                }
                aria-label="Home page"
              >
                Home
              </NavLink>
              <NavLink
                to="/blogs"
                className={({ isActive }) =>
                  `text-lg font-medium text-white hover:text-[#ff4922] transition-colors duration-300 ${
                    isActive ? 'text-[#ff4922]' : ''
                  }`
                }
                aria-label="View our blog posts"
              >
                Blogs
              </NavLink>
              <NavLink
                to="/posts"
                className={({ isActive }) =>
                  `text-lg font-medium text-white hover:text-[#ff4922] transition-colors duration-300 ${
                    isActive ? 'text-[#ff4922]' : ''
                  }`
                }
                aria-label="View client posts"
              >
                Posts
              </NavLink>
              <NavLink
                to="/website"
                className={({ isActive }) =>
                  `text-lg font-medium text-white hover:text-[#ff4922] transition-colors duration-300 ${
                    isActive ? 'text-[#ff4922]' : ''
                  }`
                }
                aria-label="Visit our website"
              >
                Visit Our Website
              </NavLink>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white focus:outline-none focus:ring-2 focus:ring-[#ff4922] rounded-md p-1"
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-neutral-800/80">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block text-lg font-medium text-white hover:text-[#ff4922] transition-colors duration-300 px-3 py-2 rounded-md ${
                    isActive ? 'text-[#ff4922]' : ''
                  }`
                }
                aria-label="Home page"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/blogs"
                className={({ isActive }) =>
                  `block text-lg font-medium text-white hover:text-[#ff4922] transition-colors duration-300 px-3 py-2 rounded-md ${
                    isActive ? 'text-[#ff4922]' : ''
                  }`
                }
                aria-label="View our blog posts"
                onClick={() => setIsMenuOpen(false)}
              >
                Blogs
              </NavLink>
              <NavLink
                to="/posts"
                className={({ isActive }) =>
                  `block text-lg font-medium text-white hover:text-[#ff4922] transition-colors duration-300 px-3 py-2 rounded-md ${
                    isActive ? 'text-[#ff4922]' : ''
                  }`
                }
                aria-label="View client posts"
                onClick={() => setIsMenuOpen(false)}
              >
                Posts
              </NavLink>
              <NavLink
                to="/website"
                className={({ isActive }) =>
                  `block text-lg font-medium text-white hover:text-[#ff4922] transition-colors duration-300 px-3 py-2 rounded-md ${
                    isActive ? 'text-[#ff4922]' : ''
                  }`
                }
                aria-label="Visit our website"
                onClick={() => setIsMenuOpen(false)}
              >
                Visit Our Website
              </NavLink>
            </div>
          </div>
        )}
      </nav>
      <div className="flex-1 pt-24 pb-12 z-10">
        <div className="max-w-full sm:max-w-[600px] lg:max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-neutral-100 to-neutral-500 text-center mb-10 tracking-tight">
            Client Posts
          </h1>
          <p className="text-neutral-300 text-xl sm:text-2xl text-center mb-12 leading-relaxed max-w-3xl mx-auto">
            Explore our clients' latest posts and articles.
          </p>
          {/* Posts list */}
          <div className="flex flex-col gap-8">
            {initialPosts.map((post, index) => (
              <div
                key={post.id}
                className="p-8 bg-neutral-800 rounded-xl hover:bg-neutral-700 transition-all duration-300 shadow-lg hover:shadow-xl animate-fade-in relative group"
                style={{ animationDelay: `${index * 200}ms` }} // Stagger animations to reduce initial load impact
              >
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block focus:outline-none focus:ring-2 focus:ring-[#ff4922] rounded-xl"
                  aria-label={`Read ${post.title}`}
                >
                  <div className="w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden relative bg-neutral-700/50"> {/* Placeholder background while image loads */}
                    <img
                      src={post.image}
                      srcSet={`
                        ${post.image} 1080w,
                        ${post.image.replace('w=1080', 'w=600')} 600w,
                        ${post.image.replace('w=1080', 'w=300')} 300w
                      `}
                      sizes="(max-width: 640px) 300px, (max-width: 1024px) 600px, 1080px"
                      alt={`Thumbnail for ${post.title} article`}
                      className="w-full h-full object-contain"
                      loading="lazy"
                      onError={(e) => {
                        console.log(`Failed to load image for ${post.title}: ${post.image}`);
                        e.target.src = 'https://images.unsplash.com/photo-1594322436404-5a0526db4b9b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1080&w=1080'; // Updated fallback
                      }}
                    />
                    {/* Play icon overlay for YouTube-like appearance */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 will-change-opacity">
                      <svg
                        className="w-16 h-16 text-white bg-black/50 rounded-full p-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-100 text-center mt-6 mb-4 tracking-tight">
                    {post.title}
                  </h2>
                </a>
                <div className="mt-6 text-center">
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-white bg-[#ff4922] rounded-xl px-8 py-3 text-lg font-semibold hover:bg-[#ff4922]/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#ff4922] shadow-md hover:shadow-lg"
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
            className="mt-16 inline-block text-white bg-[#ff4922] rounded-xl px-8 py-4 text-lg font-semibold hover:bg-[#ff4922]/90 transition-all duration-300 mx-auto block w-fit focus:outline-none focus:ring-2 focus:ring-[#ff4922] shadow-md hover:shadow-lg"
            aria-label="Back to newsletter subscription"
          >
            Back to Newsletter
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Posts;