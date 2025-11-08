// frontend/src/pages/SecurityDashboard.tsx
import React, { useState, useEffect } from 'react';

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
}

type PanicAction = 'call_saps' | 'notify_security' | 'send_saps_email' | 'resolve';

const SecurityDashboard: React.FC = () => {
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);
  const [showActionModal, setShowActionModal] = useState<boolean>(false);

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
          customer: 'John Doe',
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
        }
      }
    ];
    setSecurityAlerts(mockAlerts);
  }, []);

  const handlePanicAction = async (action: PanicAction, alertId: string): Promise<void> => {
    const alert = securityAlerts.find(a => a.id === alertId);
    
    if (!alert) return;

    switch (action) {
      case 'call_saps':
        // Call SAPS logic
        console.log('Calling SAPS for alert:', alertId);
        // Integration with SAPS API or phone system
        window.open(`tel:10111`);
        break;
        
      case 'notify_security':
        // Notify security company
        console.log('Notifying security company:', alert.securityCompany.name);
        // Send email/SMS to security company
        await sendSecurityNotification(alert);
        break;
        
      case 'send_saps_email':
        // Send email to SAPS
        await sendSAPSEmail(alert);
        break;
        
      case 'resolve':
        // Mark as resolved
        setSecurityAlerts(prev => prev.filter(a => a.id !== alertId));
        break;
        
      default:
        console.warn('Unknown action:', action);
    }
    
    setShowActionModal(false);
  };

  const sendSecurityNotification = async (alert: SecurityAlert): Promise<void> => {
    // Mock email/SMS sending
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
              <div key={alert.id} className="border border-red-300 rounded-lg p-4 bg-red-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-semibold">
                        PANIC BUTTON
                      </span>
                      <span className="text-sm text-gray-600">
                        {alert.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-red-800 text-lg mb-2">
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
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
                    >
                      Take Action
                    </button>
                    <button 
                      onClick={() => handlePanicAction('resolve', alert.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
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
              <button
                onClick={() => handlePanicAction('call_saps', selectedAlert.id)}
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Call SAPS (10111)</span>
              </button>
              
              <button
                onClick={() => handlePanicAction('notify_security', selectedAlert.id)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Notify {selectedAlert.securityCompany.name}</span>
              </button>
              
              <button
                onClick={() => handlePanicAction('send_saps_email', selectedAlert.id)}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 flex items-center justify-center space-x-2"
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
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityDashboard;