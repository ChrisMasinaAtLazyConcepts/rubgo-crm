// frontend/src/pages/SecurityDashboard.tsx
import React, { useState, useEffect, useRef } from 'react';


// Define TypeScript interfaces
interface User {
  name: string;
  type: string;
  phone: string;
}

interface Request {
  id: string;
  customer: string;
  address: string;
  scheduledTime: Date;
}

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface Notifications {
  emergencyContacts: boolean;
  securityCompany: boolean;
  saps: boolean;
}

interface SecurityCompany {
  name: string;
  contact: string;
}

interface SecurityAlert {
  id: string;
  type: string;
  user: User;
  request: Request;
  location: Location;
  timestamp: Date;
  status: string;
  notifications: Notifications;
  securityCompany: SecurityCompany;
  streamAvailable?: boolean;
}

interface StreamStatus {
  audio: boolean;
  video: boolean;
  connected: boolean;
}

type PanicAction = 'call_saps' | 'notify_security' | 'send_saps_email' | 'resolve' | 'start_stream' | 'stop_stream';


const SecurityDashboard: React.FC = () => {
   const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);
  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  const [showStreamModal, setShowStreamModal] = useState<boolean>(false);
  const [streamStatus, setStreamStatus] = useState<StreamStatus>({ audio: false, video: false, connected: false });
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [flashingAlerts, setFlashingAlerts] = useState<Set<string>>(new Set());
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Mock data with enhanced panic alerts
    const mockAlerts: SecurityAlert[] = [
      {
        id: '1',
        type: 'panic_button',
        user: {
          name: 'Sarah Wilson',
          type: 'therapist',
          phone: '+27 72 123 4567'
        },
        request: {
          id: 'req-001',
          customer: 'Chris Masina',
          address: '123 Main St, Johannesburg',
          scheduledTime: new Date()
        },
        location: {
          lat: -26.2041,
          lng: 28.0473,
          address: '123 Main St, Johannesburg'
        },
        timestamp: new Date(),
        status: 'active',
        notifications: {
          emergencyContacts: true,
          securityCompany: false,
          saps: false
        },
        securityCompany: {
          name: 'ADT Security',
          contact: '+27 11 234 5678'
        },
        streamAvailable: true
      }
    ];
    setSecurityAlerts(mockAlerts);
    
    // Start flashing for all active alerts
    const alertIds = mockAlerts.map(alert => alert.id);
    setFlashingAlerts(new Set(alertIds));
  }, []);

  // Effect to handle flashing animation
  useEffect(() => {
    if (flashingAlerts.size === 0) return;

    const interval = setInterval(() => {
      // The flashing is handled by CSS animation, this just ensures it continues
    }, 2000);

    return () => clearInterval(interval);
  }, [flashingAlerts]);

  const handlePanicAction = async (action: PanicAction, alertId: string): Promise<void> => {
    const alert = securityAlerts.find(a => a.id === alertId);
    
    if (!alert) return;

    switch (action) {
      case 'call_saps':
        console.log('Calling SAPS for alert:', alertId);
        window.open(`tel:10111`);
        // Stop flashing when action is taken
        setFlashingAlerts(prev => {
          const newSet = new Set(prev);
          newSet.delete(alertId);
          return newSet;
        });
        break;
        
      case 'notify_security':
        console.log('Notifying security company:', alert.securityCompany.name);
        await sendSecurityNotification(alert);
        // Stop flashing when action is taken
        setFlashingAlerts(prev => {
          const newSet = new Set(prev);
          newSet.delete(alertId);
          return newSet;
        });
        break;
        
      case 'send_saps_email':
        await sendSAPSEmail(alert);
        // Stop flashing when action is taken
        setFlashingAlerts(prev => {
          const newSet = new Set(prev);
          newSet.delete(alertId);
          return newSet;
        });
        break;
        
      case 'start_stream':
        await startLiveStream(alert);
        // Don't stop flashing when starting stream - it's still active
        break;
        
      case 'stop_stream':
        stopLiveStream();
        break;
        
      case 'resolve':
        stopLiveStream();
        setSecurityAlerts(prev => prev.filter(a => a.id !== alertId));
        // Stop flashing when resolved
        setFlashingAlerts(prev => {
          const newSet = new Set(prev);
          newSet.delete(alertId);
          return newSet;
        });
        break;
        
      default:
        console.warn('Unknown action:', action);
    }
    
    if (action !== 'start_stream') {
      setShowActionModal(false);
    }
  };

  const startLiveStream = async (alert: SecurityAlert): Promise<void> => {
    try {
      setShowActionModal(false);
      setShowStreamModal(true);
      
      // Simulate connecting to device stream
      console.log(`Connecting to live stream from ${alert.user.name}'s device...`);
      
      // In a real implementation, this would connect to the device's WebRTC stream
      // For demo purposes, we'll simulate connection
      setTimeout(() => {
        setStreamStatus({ audio: true, video: true, connected: true });
        
        // Start recording the stream for evidence
        startRecording();
      }, 2000);

    } catch (error) {
      console.error('Failed to start live stream:', error);
      // alert('Failed to connect to device stream. Please try again.');
    }
  };

  const stopLiveStream = (): void => {
    if (isRecording) {
      stopRecording();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setStreamStatus({ audio: false, video: false, connected: false });
    setShowStreamModal(false);
  };

  const startRecording = async (): Promise<void> => {
    try {
      // In a real implementation, this would record the actual stream from the device
      // For demo, we'll simulate recording
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        // Save or upload the recording
        saveRecording(blob);
      };
      
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = (): void => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const saveRecording = (blob: Blob): void => {
    // In a real implementation, upload to cloud storage or save locally
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `panic-alert-recording-${new Date().getTime()}.webm`;
    a.click();
    
    console.log('Recording saved:', blob.size, 'bytes');
  };

  const sendSecurityNotification = async (alert: SecurityAlert): Promise<void> => {
    const emailData = {
      to: alert.securityCompany.contact,
      subject: 'URGENT: Panic Button Activated',
      message: `Panic button activated by ${alert.user.name} at ${alert.location.address}. Coordinates: ${alert.location.lat}, ${alert.location.lng}`
    };
    console.log('Sending security notification:', emailData);
  };

  const sendSAPSEmail = async (alert: SecurityAlert): Promise<void> => {
    const emailData = {
      to: 'saps-emergency@saps.gov.za',
      subject: 'Panic Button Emergency Alert - RubGo Massage',
      message: `
        EMERGENCY ALERT - Panic Button Activated
        
        User: ${alert.user.name} (${alert.user.type})
        Contact: ${alert.user.phone}
        Location: ${alert.location.address}
        Coordinates: ${alert.location.lat}, ${alert.location.lng}
        Time: ${alert.timestamp.toLocaleString()}
        
        Service Details:
        - Customer: ${alert.request.customer}
        - Scheduled Time: ${alert.request.scheduledTime.toLocaleString()}
        
        This is an automated alert from RubGo Massage security system.
      `
    };
    console.log('Sending SAPS email:', emailData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Security Center</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-red-100 border border-red-300 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800">Active Panic Alerts</h3>
          <p className="text-3xl font-bold text-red-800">{securityAlerts.length}</p>
        </div>
        
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800">Pending Selfie Checks</h3>
          <p className="text-3xl font-bold text-yellow-800">3</p>
        </div>
        
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800">SAPS Calls Today</h3>
          <p className="text-3xl font-bold text-blue-800">2</p>
        </div>
        
        <div className="bg-green-100 border border-green-300 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800">Resolved Today</h3>
          <p className="text-3xl font-bold text-green-800">12</p>
        </div>
      </div>

      {/* Active Panic Alerts */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Active Security Alerts</h2>
        {securityAlerts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No active security alerts</p>
        ) : (
          <div className="space-y-4">
            {securityAlerts.map(alert => (
              <div 
                key={alert.id} 
                className={`
                  border rounded-lg p-4 transition-all duration-500 relative overflow-hidden
                  ${flashingAlerts.has(alert.id) 
                    ? 'border-red-400 bg-red-50 shadow-lg flash-alert' 
                    : 'border-red-300 bg-red-50'
                  }
                `}
              >
                {/* Flashing overlay */}
                {flashingAlerts.has(alert.id) && (
                  <div className="absolute inset-0 bg-red-200 opacity-0 pulse-overlay pointer-events-none"></div>
                )}
                
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`
                        px-2 py-1 rounded-full text-sm font-semibold
                        ${flashingAlerts.has(alert.id)
                          ? 'bg-red-200 text-red-800 animate-pulse'
                          : 'bg-red-100 text-red-800'
                        }
                      `}>
                        PANIC BUTTON
                      </span>
                      <span className="text-sm text-gray-600">
                        {alert.timestamp.toLocaleTimeString()}
                      </span>
                      {alert.streamAvailable && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
                          LIVE STREAM AVAILABLE
                        </span>
                      )}
                      {flashingAlerts.has(alert.id) && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold animate-pulse">
                          URGENT ACTION REQUIRED
                        </span>
                      )}
                    </div>
                    
                    <h3 className={`
                      font-semibold text-lg mb-2
                      ${flashingAlerts.has(alert.id) ? 'text-red-700 animate-pulse' : 'text-red-800'}
                    `}>
                      {alert.user.name} ({alert.user.type})
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Location:</strong> {alert.location.address}</p>
                        <p><strong>Coordinates:</strong> {alert.location.lat}, {alert.location.lng}</p>
                        <p><strong>Contact:</strong> {alert.user.phone}</p>
                      </div>
                      <div>
                        <p><strong>Customer:</strong> {alert.request.customer}</p>
                        <p><strong>Scheduled:</strong> {alert.request.scheduledTime.toLocaleString()}</p>
                        <p><strong>Security Company:</strong> {alert.securityCompany.name}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {alert.notifications.emergencyContacts && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          Emergency Contacts Notified
                        </span>
                      )}
                      {alert.notifications.securityCompany && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          Security Company Notified
                        </span>
                      )}
                      {alert.notifications.saps && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                          SAPS Notified
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <button 
                      onClick={() => {
                        setSelectedAlert(alert);
                        setShowActionModal(true);
                      }}
                      className={`
                        px-4 py-2 rounded-lg text-sm text-white font-semibold transition-all duration-200
                        ${flashingAlerts.has(alert.id)
                          ? 'bg-red-600 hover:bg-red-700 animate-pulse shadow-lg'
                          : 'bg-red-600 hover:bg-red-700'
                        }
                      `}
                    >
                      Take Action
                    </button>
                    <button 
                      onClick={() => handlePanicAction('resolve', alert.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                    >
                      Mark Resolved
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

          {/* Action Modal */}
      {showActionModal && selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Emergency Actions</h2>
            <p className="text-gray-600 mb-4">
              Select an action for the panic alert from {selectedAlert.user.name}
            </p>
            
            <div className="space-y-3">
              {selectedAlert.streamAvailable && (
                <button
                  onClick={() => handlePanicAction('start_stream', selectedAlert.id)}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 flex items-center justify-center space-x-2 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Start Live Stream</span>
                </button>
              )}
              
              <button
                onClick={() => handlePanicAction('call_saps', selectedAlert.id)}
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Call SAPS (10111)</span>
              </button>
              
              <button
                onClick={() => handlePanicAction('notify_security', selectedAlert.id)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Notify {selectedAlert.securityCompany.name}</span>
              </button>
              
              <button
                onClick={() => handlePanicAction('send_saps_email', selectedAlert.id)}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 flex items-center justify-center space-x-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Send Email to SAPS</span>
              </button>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowActionModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Stream Modal */}
      {showStreamModal && selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Live Stream - {selectedAlert.user.name}
              </h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {streamStatus.connected && (
                    <>
                      <div className="flex items-center space-x-1">
                        <div className={`w-3 h-3 rounded-full ${streamStatus.video ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-white text-sm">Video</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className={`w-3 h-3 rounded-full ${streamStatus.audio ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-white text-sm">Audio</span>
                      </div>
                      {isRecording && (
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-red-400 text-sm">Recording</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <button
                  onClick={() => handlePanicAction('stop_stream', selectedAlert.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Stop Stream
                </button>
              </div>
            </div>

            <div className="bg-black rounded-lg p-4 mb-4">
              {streamStatus.connected ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  <audio ref={audioRef} autoPlay />
                  <div className="absolute bottom-4 left-4 bg-red-600 text-white px-3 py-1 rounded text-sm">
                    LIVE
                  </div>
                </div>
              ) : (
                <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white">Connecting to device stream...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white text-sm">
              <div>
                <h3 className="font-semibold mb-2">Alert Information</h3>
                <p><strong>User:</strong> {selectedAlert.user.name}</p>
                <p><strong>Location:</strong> {selectedAlert.location.address}</p>
                <p><strong>Time:</strong> {selectedAlert.timestamp.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Stream Controls</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={startRecording}
                    disabled={isRecording}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {isRecording ? 'Recording...' : 'Start Recording'}
                  </button>
                  <button
                    onClick={stopRecording}
                    disabled={!isRecording}
                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 disabled:opacity-50 transition-colors"
                  >
                    Stop Recording
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add custom CSS for flashing animation */}
      <style>{`
        @keyframes panicFlash {
          0%, 100% { 
            border-color: #f87171;
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          50% { 
            border-color: #dc2626;
            box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.4);
          }
        }
        @keyframes pulseOverlay {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.3; }
        }
        .animate-panic-flash {
          animation: panicFlash 1.5s ease-in-out infinite;
        }
        .animate-pulse-overlay {
          animation: pulseOverlay 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SecurityDashboard;