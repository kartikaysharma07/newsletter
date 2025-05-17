import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../pages/supabaseClient';

// Memoized NewsletterForm component
const NewsletterForm = memo(() => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [error, setError] = useState(null); // Added for error boundary

  useEffect(() => {
    if (message.text) {
      const timeout = setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      return () => clearTimeout(timeout);
    }
  }, [message.text]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setMessage({ type: '', text: '' });
      setError(null);
      setIsSubmitting(true);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }

      // Check if email already exists
      const { data: existing, error: queryError } = await supabase
        .from('newsletter')
        .select('email')
        .eq('email', email)
        .maybeSingle(); // Use maybeSingle to handle no results

      if (queryError) throw queryError;
      if (existing) {
        throw new Error('This email is already subscribed.');
      }

      const { error: insertError } = await supabase.from('newsletter').insert([{ email }]);
      if (insertError) throw insertError;

      setMessage({
        type: 'success',
        text: 'Subscribed! Check your email for confirmation.',
      });
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to subscribe. Try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Error boundary fallback UI
  if (error) {
    return (
      <div className="max-w-[800px] mx-auto p-6">
        <div className="bg-neutral-800/50 backdrop-blur-md border border-neutral-700/30 rounded-xl p-8 shadow-lg">
          <p className="text-red-200 bg-red-500/20 p-4 rounded-lg text-center" role="alert">
            An unexpected error occurred. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="max-w-[800px] mx-auto p-6 pt-28 sm:pt-32 z-20"
    >
      <div className="bg-neutral-800/50 backdrop-blur-md border border-neutral-700/30 rounded-xl p-8 shadow-lg">
        <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-heading-gradient text-center mb-4 drop-shadow-lg">
          Join Our <span className="text-[#FF5722]">Ranjan Batra Tech Talks</span>
        </h1>
        <p className="text-gray-300 mb-6 text-lg font-['Inter'] leading-7 text-center">
          Subscribe to receive the latest tech insights directly in your inbox.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.input
            className="w-full sm:w-[400px] text-neutral-100 pl-4 h-12 rounded-lg border border-neutral-700 bg-neutral-900/50 focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/50 transition-all outline-none"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={isSubmitting}
            aria-label="Email address for newsletter"
            whileFocus={{ scale: 1.02 }}
          />
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className={`w-full sm:w-auto text-white rounded-xl px-8 py-3 font-sans ${
              isSubmitting
                ? 'bg-[#FF5722]/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#FF5722] to-[#FFC107] hover:bg-[#FF5722]/80'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSubmitting ? 'Submitting...' : 'Join Now'}
          </motion.button>
        </form>
        <AnimatePresence>
          {message.text && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`mt-4 p-4 rounded-lg font-sans ${
                message.type === 'error' ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'
              }`}
              role="alert"
              aria-live="polite"
            >
              {message.text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

export default NewsletterForm;