// frontend/src/pages/TherapistOnboarding.js
import React, { useState } from 'react';

const TherapistOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [application, setApplication] = useState({
    personalInfo: {},
    professionalInfo: {},
    certifications: [],
    availability: {},
    videoRecording: null
  });

  const steps = [
    { number: 1, title: 'Personal Information' },
    { number: 2, title: 'Professional Details' },
    { number: 3, title: 'Certifications' },
    { number: 4, title: 'Availability' },
    { number: 5, title: 'Video Introduction' },
    { number: 6, title: 'Video Assesments' },
    { number: 7, title: 'Review & Submit' }
  ];

  const handleVideoUpload = (event: { target: { files: any[]; }; }) => {
    const file = event.target.files[0];
    // Handle video upload logic
    setApplication(prev => ({
      ...prev,
      videoRecording: file
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Therapist Onboarding</h1>
        
        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {steps.map(step => (
            <div key={step.number} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step.number === currentStep ? 'bg-blue-600 text-white' :
                step.number < currentStep ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {step.number}
              </div>
              <span className="text-sm mt-2 text-gray-600">{step.title}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            {/* Form fields for personal info */}
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Video Introduction</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
           
              <label htmlFor="video-upload" className="cursor-pointer">
                <div className="text-gray-500">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2">Upload your introduction video</p>
                  <p className="text-sm">Maximum 2 minutes</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={currentStep === 1}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentStep(prev => prev + 1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            {currentStep === steps.length ? 'Submit Application' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TherapistOnboarding;