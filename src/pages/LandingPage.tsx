// frontend/src/pages/LandingPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication - in real app, this would be an API call
    if (formData.email === 'admin@rubgo.com' && formData.password === 'admin') {
      navigate('/');
    } else {
      // For demo purposes, redirect to home for any login
      navigate('/');
    }
  };

  const handleTherapistSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to therapist onboarding
    navigate('/therapists/onboarding');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
          // Alternative serene massage-related images:
          // - https://images.unsplash.com/photo-1544168185-4d8cba7f2ed7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80
          // - https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80
          // - https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/70 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Header */}
      <header className="relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
           
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-white/90 hover:text-white font-medium transition-colors">Features</a>
              <a href="#download" className="text-white/90 hover:text-white font-medium transition-colors">Download App</a>
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
                Scan the QR code to download the RubGo app and book your first massage today.
              </p>
              
              
              {/* QR Code Placeholder */}
              <div className="bg-white rounded-lg p-6 flex items-center justify-center mb-6 border border-white/30">
                <div className="text-center">
                 <img
                                  src={'./assets/images/Rubbgo2.png'}
                                  alt={'Korporate Logo'}
                                  className="mr-auto w-full h-full md:w-25 md:h-16 object-contain transition-all duration-200 hover:opacity-90"
                                />

                              <div className="flex justify-center items-center gap-4">
                              <img
                                src={'./assets/images/android qr.png'}
                                alt={'Android QR Code'}
                                className="max-w-48 max-h-48 w-auto h-auto object-contain transition-all duration-200 hover:opacity-90 hover:scale-105"
                              />
                              <img
                                src={'./assets/images/apple qr.png'}
                                alt={'Apple QR Code'}
                                className="max-w-48 max-h-48 w-auto h-auto object-contain transition-all duration-200 hover:opacity-90 hover:scale-105"
                              />
                            </div>
                            <div className="flex justify-center items-center gap-4">
                              <img
                                src={'./assets/images/android.png'}
                                alt={'Android QR Code'}
                                className="max-w-48 max-h-48 w-auto h-auto object-contain transition-all duration-200 hover:opacity-90 hover:scale-105"
                              />
                              <img
                                src={'./assets/images/apple.png'}
                                alt={'Apple QR Code'}
                                className="max-w-48 max-h-48 w-auto h-auto object-contain transition-all duration-200 hover:opacity-90 hover:scale-105"
                              />
                            </div>
                  <div className="w-48 h-15 bg-white/30 border-2 border-white/40 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <div className="text-center">
                          
                      <div className="text-white text-lg font-semibold mb-2">RubGo</div>
                      <div className="text-white/80 text-sm">Scan to Download</div>
                    </div>
                  </div>
                  <p className="text-sm text-white/80">Scan with your phone camera</p>
                </div>
              </div>

              {/* App Store Links */}
              <div className="flex space-x-4 justify-center">
                <button className="flex items-center justify-center bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                  <span className="mr-2">📱</span>
                  App Store
                </button>
                <button className="flex items-center justify-center bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium">
                  <span className="mr-2">🤖</span>
                  Play Store
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Forms */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl p-8 max-w-md mx-auto lg:mx-0">
            {/* Tab Navigation */}
               <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-green-600">RubGo</span>
              <span className="text-sm text-gray-400">CRM</span>
            </div>
           <h1></h1>
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
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-4 font-medium text-center border-b-2 transition-colors ${
                  activeTab === 'signup'
                    ? 'border-blue-400 text-white'
                    : 'border-transparent text-white/70 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Sign In Form */}
            {activeTab === 'signin' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors text-white placeholder-white/60"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors text-white placeholder-white/60"
                    placeholder="Enter your password"
                  />
                </div>

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

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-400/30 transition-colors font-medium"
                >
                  Sign In
                </button>

                <div className="text-center">
                  <p className="text-sm text-white/70">
                    Admin demo: admin@rubgo.com / admin
                  </p>
                </div>
              </form>
            )}

            {/* Sign Up Form */}
            {activeTab === 'signup' && (
              <div>
                {/* User Type Selection */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => setUserType('customer')}
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      userType === 'customer'
                        ? 'border-blue-400 bg-blue-400/20 text-white'
                        : 'border-white/30 text-white/80 hover:border-white/50 hover:text-white'
                    }`}
                  >
                    <span className="block text-2xl mb-2">👤</span>
                    <span className="font-medium">Customer</span>
                  </button>
                  <button
                    onClick={() => setUserType('therapist')}
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      userType === 'therapist'
                        ? 'border-blue-400 bg-blue-400/20 text-white'
                        : 'border-white/30 text-white/80 hover:border-white/50 hover:text-white'
                    }`}
                  >
                    <span className="block text-2xl mb-2">👨‍⚕️</span>
                    <span className="font-medium">Therapist</span>
                  </button>
                </div>

                {userType === 'customer' ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-white mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors text-white placeholder-white/60"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="signupEmail" className="block text-sm font-medium text-white mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="signupEmail"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors text-white placeholder-white/60"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label htmlFor="signupPassword" className="block text-sm font-medium text-white mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="signupPassword"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors text-white placeholder-white/60"
                        placeholder="Create a password"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-400/30 transition-colors font-medium"
                    >
                      Create Account
                    </button>
                  </form>
                ) : (
                  <div className="text-center">
                    <div className="bg-white/10 rounded-lg p-6 mb-6 border border-white/20">
                      <span className="text-4xl mb-4 block">👨‍⚕️</span>
                      <h3 className="text-xl font-bold text-white mb-2">Become a RubGo Therapist</h3>
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
                      onClick={handleTherapistSignup}
                      className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 focus:ring-4 focus:ring-green-400/30 transition-colors font-medium"
                    >
                      Apply as Therapist
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Divider */}
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

export default LandingPage;