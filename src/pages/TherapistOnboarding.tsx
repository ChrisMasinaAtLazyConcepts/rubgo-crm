// frontend/src/pages/TherapistOnboarding.tsx
import React, { useState } from 'react';

// Type definitions
interface PersonalInfo {
  firstName: string;
  lastName: string;
  idNumber: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  emergencyContact: string;
}

interface ProfessionalInfo {
  institution: string;
  qualification: string;
  graduationYear: string;
  yearsExperience: string;
  previousCompanies: string[];
  specialties: string[];
  hourlyRate: string;
  description: string;
}

interface Certification {
  name: string;
  type: string;
  uploaded: boolean;
  fileName: string;
}

interface Availability {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
}

interface VideoIntroduction {
  uploaded: boolean;
  fileName: string;
  duration: string;
}

interface VideoAssessment {
  id: number;
  question: string;
  thumbnail: string;
  duration: string;
  uploaded: boolean;
  requirements: string;
}

interface Application {
  personalInfo: PersonalInfo;
  professionalInfo: ProfessionalInfo;
  certifications: Certification[];
  availability: Availability;
  videoIntroduction: VideoIntroduction;
  videoAssessments: VideoAssessment[];
}

interface Step {
  number: number;
  title: string;
}

const TherapistOnboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedVideo, setSelectedVideo] = useState<VideoAssessment | null>(null);
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);

  const [application, setApplication] = useState<Application>({
    personalInfo: {
      firstName: "Sarah",
      lastName: "Wilson",
      idNumber: "8501235255089",
      dateOfBirth: "1985-01-23",
      gender: "Female",
      email: "sarah.wilson@email.com",
      phone: "+27 72 123 4567",
      address: "123 Main Street, Sandton, Johannesburg, 2196",
      emergencyContact: "John Wilson - +27 83 987 6543"
    },
    professionalInfo: {
      institution: "University of Witwatersrand",
      qualification: "Bachelor of Health Sciences in Physiotherapy",
      graduationYear: "2008",
      yearsExperience: "15",
      previousCompanies: [
        "Netcare Milpark Hospital",
        "Sports Science Institute of South Africa",
        "Private Practice - Bryanston"
      ],
      specialties: ["Deep Tissue Massage", "Sports Rehabilitation", "Myofascial Release"],
      hourlyRate: "R450",
      description: "With over 15 years of experience in physiotherapy and therapeutic massage, I specialize in sports rehabilitation and deep tissue techniques. My approach combines evidence-based practice with a holistic understanding of musculoskeletal health."
    },
    certifications: [
      { name: "South African ID Document", type: "id", uploaded: true, fileName: "id_document.pdf" },
      { name: "Driver's Licence", type: "license", uploaded: true, fileName: "drivers_license.pdf" },
      { name: "Physiotherapy Degree", type: "degree", uploaded: true, fileName: "physio_degree.pdf" },
      { name: "Sports Massage Certification", type: "certificate", uploaded: true, fileName: "sports_massage_cert.pdf" },
      { name: "First Aid & CPR", type: "certificate", uploaded: true, fileName: "first_aid_cert.pdf" }
    ],
    availability: {
      monday: ["09:00-12:00", "14:00-18:00"],
      tuesday: ["09:00-12:00", "14:00-18:00"],
      wednesday: ["09:00-12:00", "14:00-18:00"],
      thursday: ["09:00-12:00", "14:00-18:00"],
      friday: ["09:00-12:00", "14:00-17:00"],
      saturday: ["10:00-14:00"],
      sunday: []
    },
    videoIntroduction: {
      uploaded: true,
      fileName: "introduction_video.mp4",
      duration: "1:45"
    },
    videoAssessments: [
      {
        id: 1,
        question: "Record yourself performing a deep tissue massage on the upper back and explain your technique as you go",
        thumbnail: "/api/placeholder/300/200",
        duration: "2:30",
        uploaded: true,
        requirements: "Ensure good lighting and clear audio"
      },
      {
        id: 2,
        question: "Demonstrate a Swedish massage sequence on the forearm and explain the benefits",
        thumbnail: "/api/placeholder/300/200",
        duration: "3:15",
        uploaded: true,
        requirements: "Show proper hand positioning and pressure control"
      },
      {
        id: 3,
        question: "Explain how you would assess a client with lower back pain before starting treatment",
        thumbnail: "/api/placeholder/300/200",
        duration: "4:20",
        uploaded: true,
        requirements: "Include client consultation and assessment steps"
      }
    ]
  });

  const steps: Step[] = [
    { number: 1, title: 'Personal Information' },
    { number: 2, title: 'Professional Details' },
    { number: 3, title: 'Certifications' },
    { number: 4, title: 'Availability' },
    { number: 5, title: 'Video Introduction' },
    { number: 6, title: 'Video Assessments' }
  ];

  const handleVideoPlay = (video: VideoAssessment): void => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  const assessmentQuestions: string[] = [
    "Record yourself doing a deep tissue massage and explain as you go",
    "Demonstrate proper stretching techniques for hamstrings",
    "Show your approach to treating shoulder tension",
    "Explain your safety protocols during massage sessions",
    "Demonstrate communication with a client during session",
    "Show your setup and preparation process",
    "Explain how you adapt techniques for different body types",
    "Demonstrate pressure control on sensitive areas",
    "Show your post-massage aftercare advice",
    "Explain how you handle client discomfort during session"
  ];

  const handleNextStep = (): void => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePreviousStep = (): void => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleCompleteApplication = (): void => {
    // Handle application submission
    console.log('Application submitted:', application);
    alert('Application submitted successfully!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Therapist Onboarding</h1>
        <p className="text-gray-600 mb-6">Complete your profile to start accepting clients</p>
        
        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {steps.map((step: Step) => (
            <div key={step.number} className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step.number === currentStep ? 'bg-blue-600 text-white' :
                step.number < currentStep ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {step.number < currentStep ? '✓' : step.number}
              </div>
              <span className="text-sm mt-2 text-gray-600 text-center">{step.title}</span>
              <div className={`h-1 w-full mt-2 ${
                step.number < currentStep ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
            </div>
          ))}
        </div>

        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                  {application.personalInfo.firstName}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                  {application.personalInfo.lastName}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID Number</label>
                <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                  {application.personalInfo.idNumber}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                  {application.personalInfo.dateOfBirth}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                  {application.personalInfo.address}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                  {application.personalInfo.email}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                  {application.personalInfo.phone}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Professional Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Professional Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Institution Studied</label>
                <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                  {application.professionalInfo.institution}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                  {application.professionalInfo.qualification}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
                <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                  {application.professionalInfo.graduationYear}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                  {application.professionalInfo.yearsExperience} years
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Previous Companies</label>
                <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                  {application.professionalInfo.previousCompanies.join(', ')}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialties</label>
                <div className="flex flex-wrap gap-2">
                  {application.professionalInfo.specialties.map((specialty: string, index: number) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Professional Introduction</label>
                <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 min-h-32">
                  {application.professionalInfo.description}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Certifications */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Certifications & Documents</h2>
            <div className="space-y-4">
              {application.certifications.map((doc: Certification, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{doc.name}</h3>
                      <p className="text-sm text-gray-500">{doc.fileName}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Uploaded
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Availability */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Weekly Availability</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(application.availability).map(([day, slots]) => (
                <div key={day} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 capitalize mb-3">{day}</h3>
                  {slots.length > 0 ? (
                    <div className="space-y-2">
                      {slots.map((slot: string, index: number) => (
                        <div key={index} className="bg-blue-50 text-blue-700 px-3 py-2 rounded text-sm font-medium">
                          {slot}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Not available</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Video Introduction */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Video Introduction</h2>
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-green-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Personal Introduction Video</h3>
                  <p className="text-gray-600 text-sm">Tell us about yourself and your approach to massage therapy</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Uploaded
                </span>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{application.videoIntroduction.fileName}</h4>
                    <p className="text-sm text-gray-500">Duration: {application.videoIntroduction.duration}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      "Hi, I'm Sarah Wilson. With 15 years of experience in therapeutic massage, I believe in a holistic approach to wellness. My focus is on creating personalized treatment plans that address both immediate concerns and long-term health goals..."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Video Assessments */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Video Assessments</h2>
            <p className="text-gray-600">Technical assessment videos demonstrating your massage techniques</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {application.videoAssessments.map((video: VideoAssessment, index: number) => (
                <div key={video.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <div 
                      className="w-full h-48 bg-gray-200 flex items-center justify-center cursor-pointer"
                      onClick={() => handleVideoPlay(video)}
                    >
                      <svg className="w-16 h-16 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Assessment {index + 1}</h3>
                    <p className="text-sm text-gray-600 mb-3">{video.question}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{video.requirements}</span>
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                        Submitted
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Assessment Questions Completed</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                {assessmentQuestions.map((question: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {question}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Video Modal */}
        {showVideoModal && selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">Assessment Video</h3>
                <button 
                  onClick={() => setShowVideoModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <div className="bg-gray-900 aspect-video rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    <p>Video Player - {selectedVideo.duration}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Question:</h4>
                  <p className="text-gray-700">{selectedVideo.question}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handlePreviousStep}
            disabled={currentStep === 1}
            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg disabled:opacity-50 hover:bg-gray-400 transition-colors"
          >
            Previous
          </button>
         <button
            onClick={currentStep === steps.length ? () => window.location.href = '/therapists' : handleNextStep}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {currentStep === steps.length ? 'Close' : 'Next Step'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TherapistOnboarding;