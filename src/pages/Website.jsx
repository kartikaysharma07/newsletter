import React, { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from './supabaseClient';
import Navbar from '../components/Navbar';
import ErrorBoundary from '../components/ErrorBoundary';

const socialMediaLinks = [
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@RanjanBatraTechTalks',
    color: '#FF0000',
    icon: 'M23.5 6.5c-.3-1.1-1.1-2-2.2-2.3C19.5 4 12 4 12 4s-7.5 0-9.3.2c-1.1.3-1.9 1.2-2.2 2.3C.5 8.4.5 12 .5 12s0 3.6.2 5.5c.3 1.1 1.1 2 2.2 2.3 1.8.2 9.3.2 9.3.2s7.5 0 9.3-.2c1.1-.3 1.9-1.2 2.2-2.3.2-1.9.2-5.5.2-5.5s0-3.6-.2-5.5zm-13.8 9V8.5l6.2 3.5-6.2 3.5z',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/ranjan-batra-a1804856/',
    color: '#0A66C2',
    icon: 'M20.447 20.452h-3.554v-5.569c0-1.327-.026-3.037-1.852-3.037-1.852 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/iamranjanbatra/',
    color: '#E1306C',
    icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.326 3.608 1.301.975.975 1.24 2.242 1.301 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.326 2.633-1.301 3.608-.975.975-2.242 1.24-3.608 1.301-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.326-3.608-1.301-.975-.975-1.24-2.242-1.301-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.326-2.633 1.301-3.608.975-.975 2.242-1.24 3.608-1.301 1.266-.058 1.646-.07 4.85-.07zm0-2.163C8.735 0 8.332.013 7.052.072 5.766.132 4.57.396 3.474 1.492 2.378 2.588 2.114 3.784 2.054 5.07 1.995 6.35 1.982 6.753 1.982 12s.013 5.647.072 6.928c.06 1.286.324 2.482 1.42 3.578 1.096 1.096 2.292 1.36 3.578 1.42 1.28.059 1.683.072 6.928.072s5.647-.013 6.928-.072c1.286-.06 2.482-.324 3.578-1.42 1.096-1.096 1.36-2.292 1.42-3.578.059-1.28.072-1.683.072-6.928s-.013-5.647-.072-6.928c-.06-1.286-.324-2.482-1.42-3.578-1.096-1.096-2.292-1.36-3.578-1.42C15.647.013 15.244 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z',
  },
  {
    name: 'Gmail',
    url: 'iamranjanbatra@gmail.com',
    color: '#D44638',
    icon: 'M22.288 4H1.712C.77 4 0 4.77 0 5.712v12.576C0 19.23.77 20 1.712 20h20.576c.942 0 1.712-.77 1.712-1.712V5.712C24 4.77 23.23 4 22.288 4zM12 14.536L1.712 6.92V5.712h20.576v1.208L12 14.536zM1.712 18.288V8.464l7.776 5.184L1.712 18.288zm20.576 0L14.512 13.648l7.776-5.184v9.824z',
  },
  {
    name: 'Twitter',
    url: 'https://www.threads.com/@iamranjanbatra',
    color: '#1DA1F2',
    icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
];

const Website = memo(() => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error checking user:', error.message);
      }
    };
    checkUser();
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => setUser(session?.user || null));
    return () => authListener.subscription?.unsubscribe();
  }, []);

  const handleShare = async () => {
    const shareData = { title: 'Check out our website!', text: 'Our website is under construction, but you can follow us on social media!', url: window.location.href };
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
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-neutral-900 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa')] bg-cover bg-center font-sans flex flex-col overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50 z-0"></div>
        <Navbar user={user} />
        <div className="flex-1 pt-28 sm:pt-32 pb-12 z-20">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center mb-10">
              <img
                src="https://vvjaqiowlgkabmchvmhi.supabase.co/storage/v1/object/public/website-assets/logo2.webp"
                srcSet="https://vvjaqiowlgkabmchvmhi.supabase.co/storage/v1/object/public/website-assets/logo2.png 1x"
                alt="RBTechTalks Logo"
                className="w-16 h-16 mr-3"
                loading="lazy"
                onError={(e) => (e.target.src = 'https://via.placeholder.com/64')}
              />
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl font-serif font-bold text-heading-gradient"
              >
                Contact Us
              </motion.h1>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-neutral-300 text-xl sm:text-2xl font-sans leading-relaxed text-center mb-12 max-w-3xl mx-auto"
            >
              Stay tuned! For upcoming blogs and posts, you can connect with us on social media.
            </motion.p>
            <div className="flex justify-center gap-8 mb-12">
              {socialMediaLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.name === 'Gmail' ? `mailto:${social.url}` : social.url}
                  target={social.name === 'Gmail' ? '_self' : '_blank'}
                  rel={social.name === 'Gmail' ? '' : 'noopener noreferrer'}
                  aria-label={social.name === 'Gmail' ? 'Send us an email' : `Visit our ${social.name} page`}
                  className="focus:outline-none focus:ring-2 focus:ring-[#FF5722] rounded-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  <svg className={`w-12 h-12 text-neutral-100 hover:text-[${social.color}] transition-colors`} fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </motion.a>
              ))}
              <motion.button
                onClick={handleShare}
                className="focus:outline-none focus:ring-2 focus:ring-[#FF5722] rounded-full"
                aria-label="Share this page"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: socialMediaLinks.length * 0.1 }}
                whileHover={{ scale: 1.2, rotate: 5 }}
              >
                <svg className="w-12 h-12 text-neutral-100 hover:text-[#FF8A65] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45-1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45-1-1 1z" />
                </svg>
              </motion.button>
            </div>
            <motion.div
              className="flex justify-center mb-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <video
                src="https://vvjaqiowlgkabmchvmhi.supabase.co/storage/v1/object/public/website-assets/logoVideo.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-[416px] h-auto rounded-lg border border-neutral-700/50 shadow-lg shadow-[#FF5722]/20"
                aria-label="RBTechTalks logo animation"
                loading="lazy"
              />
            </motion.div>
            <motion.p
              className="text-3xl font-serif text-heading-gradient text-center mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              Thank you for visiting 🙏
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="text-center"
            >
              <Link
                to="/"
                className="inline-block text-neutral-100 bg-gradient-to-r from-[#FF5722] to-[#FFC107] rounded-xl px-8 py-4 font-sans text-lg hover:bg-[#FF5722]/80"
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

export default Website;