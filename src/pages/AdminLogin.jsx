import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      navigate('/admin');
    } catch (err) {
      setError(err.message === 'Invalid login credentials' ? 'Invalid email or password' : 'Login failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear error after 5 seconds
  React.useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full bg-neutral-900 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&auto=format&fit=crop&q=60&ixlib=rb-4.0.3')] bg-cover bg-center bg-no-repeat font-sans flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/30 z-0"></div>
      <div className="max-w-md w-full bg-neutral-800/50 backdrop-blur-md p-8 rounded-xl border border-neutral-700 z-10">
        <h1 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 to-[#FFC107] mb-6">
          Admin Login
        </h1>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-red-600/50 text-red-100 rounded mb-4"
            role="alert"
          >
            {error}
          </motion.div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 bg-neutral-800 text-neutral-100 border border-neutral-700 rounded focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/50 outline-none"
            required
            disabled={isLoading}
            aria-label="Admin email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 bg-neutral-800 text-neutral-100 border border-neutral-700 rounded focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/50 outline-none"
            required
            disabled={isLoading}
            aria-label="Admin password"
          />
          <motion.button
            type="submit"
            disabled={isLoading}
            className={`w-full p-2 text-white rounded font-sans ${
              isLoading
                ? 'bg-[#FF5722]/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#FF5722] to-[#FFC107] hover:bg-[#FF5722]/80'
            }`}
            whileHover={{ scale: isLoading ? 1 : 1.05 }}
            whileTap={{ scale: isLoading ? 1 : 0.95 }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>
        <p className="mt-4 text-neutral-300 text-center">
          Forgot password?{' '}
          <button
            onClick={async () => {
              try {
                const { error } = await supabase.auth.resetPasswordForEmail(email);
                if (error) throw error;
                setError('Password reset email sent. Check your inbox.');
              } catch (err) {
                setError('Failed to send reset email: ' + err.message);
              }
            }}
            className="text-[#FFC107] hover:underline"
            disabled={!email || isLoading}
          >
            Reset Password
          </button>
        </p>
      </div>
    </motion.div>
  );
};

export default AdminLogin;