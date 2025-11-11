// frontend/src/pages/LandingPage.tsx
import { Apple, Play } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DownloadSection from '../components/DownloadSection';

const LandingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [userType, setUserType] = useState<'customer' | 'therapist'>('customer');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    specialization: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication - in real app, this would be an API call
    if (formData.email === 'admin@rubhub.com' && formData.password === 'admin') {
      navigate('/');
    } else {
      // For demo purposes, redirect to home for any login
      navigate('/');
    }
  };

  const handleTherapistSignup = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/therapists/onboarding');
  };

  const backgroundStyle = {
    backgroundImage: 'url("https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={backgroundStyle}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Header */}
      <header className="relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-white/90 hover:text-white font-medium transition-colors">
                Features
              </a>
              <a href="#download" className="text-white/90 hover:text-white font-medium transition-colors">
                Download App
              </a>
              <button 
                onClick={() => setActiveTab('signin')}
                className="text-white/90 hover:text-white font-medium transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - App Info & QR */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
              Serene Wellness
              <span className="text-blue-200 block">At Your Doorstep</span>
            </h1>
            <p className="mt-6 text-xl text-white/90 max-w-2xl">
              Experience premium massage therapy in the comfort of your space. 
              Professional therapists, serene experiences, complete relaxation.
            </p>

            {/* QR Code & App Download */}
            <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 max-w-md">
              <h3 className="text-2xl font-bold text-white mb-4">Download Our App</h3>
              <p className="text-white/90 mb-6">
                Scan the QR code to download the RubHub app and book your first massage today.
              </p>
              
              <div className="bg-white rounded-lg p-6 flex items-center justify-center mb-6 border border-white/30">
                <div className="text-center">
                  <div className="flex flex-col mb-4">
                    <div className="flex items-baseline space-x-2 justify-center">
                      <span className="text-2xl font-bold text-green-600">RubHub</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">version 1.0.0 BETA</p>
                  </div>

                    <DownloadSection />

                

                  <p className="text-sm text-white/80 mt-4">Scan with your phone camera</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Forms */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl p-8 max-w-md mx-auto lg:mx-0">
            {/* Brand Header */}
            <div className="flex flex-col mb-6">
              <div className="flex items-baseline space-x-2 justify-center lg:justify-start">
                <span className="text-2xl font-bold text-green-600">RubHub</span>
                <span className="text-sm text-white font-normal bg-gray-800 px-2 py-1 rounded">CRM</span>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-white/20 mb-8">
              <button
                onClick={() => setActiveTab('signin')}
                className={`flex-1 py-4 font-medium text-center border-b-2 transition-colors ${
                  activeTab === 'signin'
                    ? 'border-blue-400 text-white'
                    : 'border-transparent text-white/70 hover:text-white'
                }`}
              >
                Sign In
              </button>
            </div>

            {/* Sign In Form */}
            {activeTab === 'signin' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <FormField
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />

                <FormField
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-4 w-4 text-blue-400 focus:ring-blue-400 border-white/30 bg-white/10 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-white/80">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-sm text-blue-300 hover:text-blue-200 transition-colors">
                    Forgot password?
                  </a>
                </div>

                <SubmitButton text="Sign In" />

                <div className="text-center">
                  <p className="text-sm text-white/70">
                    Admin demo: admin@rubhub.co.za / admin
                  </p>
                </div>
              </form>
            )}

            {/* Sign Up Form */}
            {activeTab === 'signup' && (
              <div>
                <UserTypeSelector userType={userType} setUserType={setUserType} />
                
                {userType === 'customer' ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <FormField
                      label="Full Name"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />

                    <FormField
                      label="Email Address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                    />

                    <FormField
                      label="Password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a password"
                      required
                    />

                    <SubmitButton text="Create Account" />
                  </form>
                ) : (
                  <TherapistSignup onSignup={handleTherapistSignup} />
                )}
              </div>
            )}

            {/* Terms Footer */}
            <div className="mt-8 pt-8 border-t border-white/20">
              <p className="text-center text-white/70 text-sm">
                By continuing, you agree to our{' '}
                <a href="#" className="text-blue-300 hover:text-blue-200 transition-colors">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-300 hover:text-blue-200 transition-colors">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Extracted Components for Better Organization

interface FormFieldProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  required = false
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-white mb-2">
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      required={required}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors text-white placeholder-white/60"
      placeholder={placeholder}
    />
  </div>
);

interface SubmitButtonProps {
  text: string;
  onClick?: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ text, onClick }) => (
  <button
    type="submit"
    onClick={onClick}
    className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-400/30 transition-colors font-medium"
  >
    {text}
  </button>
);

interface UserTypeSelectorProps {
  userType: 'customer' | 'therapist';
  setUserType: (type: 'customer' | 'therapist') => void;
}

const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({ userType, setUserType }) => (
  <div className="grid grid-cols-2 gap-4 mb-6">
    <UserTypeButton
      type="customer"
      icon="👤"
      label="Customer"
      isSelected={userType === 'customer'}
      onClick={() => setUserType('customer')}
    />
    <UserTypeButton
      type="therapist"
      icon="👨‍⚕️"
      label="Therapist"
      isSelected={userType === 'therapist'}
      onClick={() => setUserType('therapist')}
    />
  </div>
);

interface UserTypeButtonProps {
  type: 'customer' | 'therapist';
  icon: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const UserTypeButton: React.FC<UserTypeButtonProps> = ({ icon, label, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`p-4 border-2 rounded-lg text-center transition-colors ${
      isSelected
        ? 'border-blue-400 bg-blue-400/20 text-white'
        : 'border-white/30 text-white/80 hover:border-white/50 hover:text-white'
    }`}
  >
    <span className="block text-2xl mb-2">{icon}</span>
    <span className="font-medium">{label}</span>
  </button>
);

interface TherapistSignupProps {
  onSignup: (e: React.FormEvent) => void;
}

const TherapistSignup: React.FC<TherapistSignupProps> = ({ onSignup }) => (
  <div className="text-center">
    <div className="bg-white/10 rounded-lg p-6 mb-6 border border-white/20">
      <span className="text-4xl mb-4 block">👨‍⚕️</span>
      <h3 className="text-xl font-bold text-white mb-2">Become a RubHub Therapist</h3>
      <p className="text-white/80 mb-4">
        Join our network of professional massage therapists and start earning on your schedule.
      </p>
      <ul className="text-sm text-white/80 space-y-2 text-left">
        <li>✅ Flexible working hours</li>
        <li>✅ Competitive earnings</li>
        <li>✅ Professional support</li>
        <li>✅ Safety guaranteed</li>
      </ul>
    </div>

    <button
      onClick={onSignup}
      className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 focus:ring-4 focus:ring-green-400/30 transition-colors font-medium"
    >
      Apply as Therapist
    </button>
  </div>
);

export default LandingPage;