// frontend/src/components/Footer.tsx
import React from 'react';
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-green-900  text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Brand Section */}
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
           <h1 className="text-left text-4l font-bold  ">
			  RubHub™
			</h1>
         <p className="text-gray-400 text-sm ">
              Professional Massage Therapy Management
            </p>
            </div>
         
          </div>

          {/* Links Section */}
          <div className=" flex flex-wrap justify-center gap-6 mb-4 md:mb-0">
            <a
              href="/privacy"
              className="text-gray-200 hover:text-white transition-colors text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-gray-200 hover:text-white transition-colors text-sm"
            >
              Terms of Service
            </a>
            <a
              href="/support"
              className="text-gray-200 hover:text-white transition-colors text-sm"
            >
              Support
            </a>
            <a
              href="/contact"
              className="text-gray-200 hover:text-white transition-colors text-sm"
            >
              Contact
            </a>
          </div>

          {/* Copyright Section */}
          <div className="text-center md:text-right">
            <p className=" text-sm">
              © {currentYear} RubHub South Africa. All rights reserved.
            </p>
            <p className="text-gray-300 text-xs mt-1">
              Designed by Next Group (Pty) Ltd
            </p>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="border-t border-whitemt-6 pt-6 text-center">
          <p className=" text-xs">
            Version 1.0.0 | BETA
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;