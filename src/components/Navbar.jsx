import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLearnOpen, setIsLearnOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home', aria: 'Home page' },
    { to: '/blogs', label: 'Blogs', aria: 'View our blog posts' },
    { to: '/posts', label: 'Posts', aria: 'View client posts' },
    {
      label: 'Learn',
      aria: 'Learn resources',
      isDropdown: true,
      dropdown: [
        { to: '/learn/consultation', label: 'Book Consultation Call', aria: 'Book a consultation call' },
        { to: '/learn/ai-ml', label: 'Learn AI/ML', aria: 'Learn about AI and Machine Learning' },
      ],
    },
    { to: '/website', label: 'Visit Our Website', aria: 'Visit our website' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" aria-label="RBTechTalks homepage">
          <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              fill="url(#grad)"
            />
            <path
              d="M2 17L12 22L22 17"
              fill="url(#grad)"
            />
            <path
              d="M2 12L12 17L22 12"
              fill="url(#grad)"
            />
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#f12711', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#f5af19', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
          RBTechTalks
        </Link>
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.to || item.label} className="nav-item">
              {item.isDropdown ? (
                <div
                  className="dropdown"
                  onMouseEnter={() => setIsLearnOpen(true)}
                  onMouseLeave={() => setIsLearnOpen(false)}
                >
                  <button
                    className="nav-link dropdown-toggle"
                    onClick={() => setIsLearnOpen(!isLearnOpen)}
                    aria-label={item.aria}
                    aria-expanded={isLearnOpen}
                  >
                    {item.label}
                    <span className="dropdown-caret">▼</span>
                  </button>
                  {isLearnOpen && (
                    <ul className="dropdown-menu">
                      {item.dropdown.map((subItem) => (
                        <li key={subItem.to}>
                          <NavLink
                            to={subItem.to}
                            className="dropdown-item"
                            aria-label={subItem.aria}
                            onClick={() => {
                              setIsLearnOpen(false);
                              setIsMenuOpen(false);
                            }}
                          >
                            {subItem.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.to}
                  className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                  aria-label={item.aria}
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsLearnOpen(false);
                  }}
                >
                  {item.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
        <button
          className="hamburger-menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>
      {isMenuOpen && (
        <div className="mobile-menu">
          <ul className="mobile-nav-links">
            {navItems.map((item) => (
              <li key={item.to || item.label}>
                {item.isDropdown ? (
                  <div>
                    <button
                      className="mobile-nav-link mobile-dropdown-toggle"
                      onClick={() => setIsLearnOpen(!isLearnOpen)}
                      aria-label={item.aria}
                      aria-expanded={isLearnOpen}
                    >
                      {item.label}
                      <span className="dropdown-caret">▼</span>
                    </button>
                    {isLearnOpen && (
                      <ul className="mobile-dropdown-menu">
                        {item.dropdown.map((subItem) => (
                          <li key={subItem.to}>
                            <NavLink
                              to={subItem.to}
                              className="mobile-dropdown-item"
                              aria-label={subItem.aria}
                              onClick={() => {
                                setIsMenuOpen(false);
                                setIsLearnOpen(false);
                              }}
                            >
                              {subItem.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`}
                    aria-label={item.aria}
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsLearnOpen(false);
                    }}
                  >
                    {item.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;