import { useState } from 'react';
import EnrollmentModal from '../modals/EnrollmentModal';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);

  const navigate = useNavigate()
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  

  

  const handleEnrollNow = () => {
    setIsEnrollmentModalOpen(true);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="container-responsive">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg sm:text-xl">PP</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold gradient-text">
                  Plasma Pathways
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Excellence in Education</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              {[
                { href: '#about', label: 'About' },
                { href: '#programs', label: 'Programs' },
                { href: '#features', label: 'Features' },
                { href: '#testimonials', label: 'Testimonials' },
                { href: '#contact', label: 'Contact' }
              ].map((item) => (
                <a 
                  key={item.href}
                  href={item.href} 
                  className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <button onClick={() => {
                navigate("/login")
              }}
               
                className="group text-blue-600 hover:text-blue-700 transition-all duration-300 font-medium flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-50"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Login</span>
              </button>
              <button 
                onClick={handleEnrollNow}
                className="btn-primary"
                data-enroll-button
              >
                <span className="flex items-center space-x-2">
                  <span>Enroll Now</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-md animate-slide-up">
              <nav className="flex flex-col space-y-3">
                {[
                  { href: '#about', label: 'About' },
                  { href: '#programs', label: 'Programs' },
                  { href: '#features', label: 'Features' },
                  { href: '#testimonials', label: 'Testimonials' },
                  { href: '#contact', label: 'Contact' }
                ].map((item) => (
                  <a 
                    key={item.href}
                    href={item.href} 
                    className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium py-2 px-4 rounded-lg hover:bg-blue-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <button 
                  onClick={() => {
                    navigate("/login")
                    setIsMenuOpen(false);
                  }}
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-300 font-medium py-2 px-4 text-left flex items-center space-x-2 rounded-lg hover:bg-blue-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Login</span>
                </button>
                <button 
                  onClick={handleEnrollNow}
                  className="btn-primary mt-4 w-full"
                >
                  Enroll Now
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Enrollment Modal */}
      <EnrollmentModal 
        isOpen={isEnrollmentModalOpen}
        onClose={() => setIsEnrollmentModalOpen(false)}
      />
    </>
  );
};

export default Header;