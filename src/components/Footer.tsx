// frontend/src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Brand Section */}
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">RubGo</span>
              <span className="text-sm text-gray-400">CRM</span>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Professional Massage Therapy Management
            </p>
          </div>

          {/* Links Section */}
          <div className="flex flex-wrap justify-center gap-6 mb-4 md:mb-0">
            <a
              href="/privacy"
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              Terms of Service
            </a>
            <a
              href="/support"
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              Support
            </a>
            <a
              href="/contact"
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              Contact
            </a>
          </div>

          {/* Copyright Section */}
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">
              © {currentYear} RubGo Massage. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Designed by Next Group (Pty) Ltd
            </p>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="border-t border-gray-700 mt-6 pt-6 text-center">
          <p className="text-gray-500 text-xs">
            Version 1.0.0 | Secure Admin Portal
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;