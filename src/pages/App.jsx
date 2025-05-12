import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const App = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (message.text) {
      const timeout = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [message.text]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setMessage({ type: '', text: '' });
      setIsSubmitting(true);

      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          throw new Error(data.error || `HTTP error ${response.status}`);
        } else {
          throw new Error(
            response.status === 404
              ? 'API endpoint not found. Please try again later.'
              : 'Unexpected server response'
          );
        }
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response format from server');
      }

      const data = await response.json();
      setMessage({ type: 'success', text: data.message });
      setEmail('');
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to connect to the server. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen text-center w-full bg-neutral-950 font-sans relative flex items-center justify-center">
      <div className="max-w-[800px] mx-auto p-4 z-10">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-neutral-200 to-neutral-600 text-center">
          JOIN THE <span className="text-[#ff4922]">EMAIL</span> NEWSLETTER
        </h1>
        <p className="text-neutral-500 mb-4 max-w-[700px] mx-auto my-2 text-lg text-center">
          Subscribe to get our latest content by email.
        </p>

        <form onSubmit={handleSubmit} className="flex items-center justify-center gap-4">
          <input
            className="w-[400px] text-white pl-4 h-11 rounded-lg border-[1.5px] border-white"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={isSubmitting}
            aria-label="Email address for newsletter"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`text-white rounded-xl px-6 py-3 ${
              isSubmitting ? 'bg-[#ff4922]/50 cursor-not-allowed' : 'bg-[#ff4922] cursor-pointer'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Join Waitlist'}
          </button>
        </form>

        {message.text && (
          <p
            className={`mt-4 max-w-[600px] mx-auto p-4 rounded-md ${
              message.type === 'error'
                ? 'bg-red-500/10 text-red-200'
                : 'bg-green-500/10 text-green-200'
            }`}
            role="alert"
            aria-live="polite"
          >
            {message.text}
          </p>
        )}

        <div className="mt-6">
          <Link
            to="/posts"
            className="inline-block text-white bg-[#ff4922] rounded-xl px-6 py-3 hover:bg-[#ff4922]/80 transition-colors"
            aria-label="Visit our website to view client posts"
          >
            Visit Our Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default App;