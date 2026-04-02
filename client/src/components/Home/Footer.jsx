import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#0A0F1C] border-t border-gray-800 mt-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center text-sm">
        
        <div className="flex flex-col items-center md:items-start gap-2">
          <h2 className="text-lg font-bold tracking-tight text-white">
            <span className="text-green-500">Birdie</span> Bounty
          </h2>
          <p className="text-gray-500">
            © 2026 Birdie Bounty. All rights reserved.
          </p>
        </div>

        <div className="flex gap-8 mt-6 md:mt-0">
          <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
            Terms of Service
          </a>
          <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
            Contact Support
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;