// frontend/src/hooks/usePanicNotification.ts
import { useState, useCallback } from 'react';

// TypeScript interfaces
interface User {
  id: string;
  name: string;
  type: 'therapist' | 'customer' | 'admin';
  phone: string;
  email: string;
}

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface Request {
  id: string;
  customer: string;
  scheduledTime: Date;
}

interface EmergencyContact {
  name: string;
  phone?: string;
  email?: string;
  relationship: string;
}

interface SecurityCompany {
  name: string;
  contact?: string;
  email?: string;
  phone?: string;
}

interface Notifications {
  sms: boolean;
  email: boolean;
  autoSecurityCompany: boolean;
  autoSAPS: boolean;
}

interface SapsIntegration {
  stationContact?: string;
  autoDispatch: boolean;
}

interface SecurityPreferences {
  notifications: Notifications;
  sapsIntegration: SapsIntegration;
}

interface PanicData {
  user: User;
  location: Location;
  request: Request;
  emergencyContacts: EmergencyContact[];
  securityCompany?: SecurityCompany;
  securityPreferences: SecurityPreferences;
}

interface NotificationState {
  loading: boolean;
  error: string | null;
  success: boolean;
  sentNotifications: {
    emergencyContacts: boolean;
    securityCompany: boolean;
    saps: boolean;
    admin: boolean;
  };
}

interface UsePanicNotificationReturn {
  notificationState: NotificationState;
  handlePanicAlert: (panicData: PanicData) => Promise<void>;
  resetNotificationState: () => void;
}

export const usePanicNotification = (): UsePanicNotificationReturn => {
  const [notificationState, setNotificationState] = useState<NotificationState>({
    loading: false,
    error: null,
    success: false,
    sentNotifications: {
      emergencyContacts: false,
      securityCompany: false,
      saps: false,
      admin: false,
    },
  });

  // Mock email sending function
  const sendEmail = useCallback(async (to: string, subject: string, message: string): Promise<void> => {
    try {
      // In a real implementation, this would call your backend API
      console.log(`Sending email to: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Email sent successfully to ${to}`);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error(`Failed to send email to ${to}`);
    }
  }, []);

  // Mock SMS sending function
  const sendSMS = useCallback(async (to: string, message: string): Promise<void> => {
    try {
      // In a real implementation, this would call your backend API or Twilio
      console.log(`Sending SMS to: ${to}`);
      console.log(`Message: ${message}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log(`SMS sent successfully to ${to}`);
    } catch (error) {
      console.error('Failed to send SMS:', error);
      throw new Error(`Failed to send SMS to ${to}`);
    }
  }, []);

  // Mock push notification function
  const sendPushNotification = useCallback(async (panicData: PanicData): Promise<void> => {
    try {
      console.log('Sending push notification for panic alert');
      
      // Simulate push notification
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Push notification sent successfully');
    } catch (error) {
      console.error('Failed to send push notification:', error);
      throw new Error('Failed to send push notification');
    }
  }, []);

  const notifyEmergencyContacts = useCallback(async (panicData: PanicData): Promise<void> => {
    const { emergencyContacts, user, location } = panicData;
    
    for (const contact of emergencyContacts) {
      const message = `EMERGENCY ALERT - ${user.name} has activated the panic button.
        
Location: ${location.address}
Time: ${new Date().toLocaleString()}
Coordinates: ${location.lat}, ${location.lng}

Please check on them immediately.

- RubGo Massage Security System`;

      if (contact.phone) {
        await sendSMS(contact.phone, message);
      }
      
      if (contact.email) {
        await sendEmail(contact.email, 'URGENT: Panic Button Activated', message);
      }
    }
  }, [sendSMS, sendEmail]);

  const notifySecurityCompany = useCallback(async (panicData: PanicData): Promise<void> => {
    const { securityCompany, user, location, request } = panicData;
    
    if (!securityCompany) return;

    const message = `SECURITY ALERT - Panic Button Activated
      
Client: ${user.name}
Service: Massage therapy session
Customer: ${request.customer}
Location: ${location.address}
Coordinates: ${location.lat}, ${location.lng}
Time: ${new Date().toLocaleString()}

This is an automated alert from RubGo Massage security system.
Immediate response required.`;

    if (securityCompany.contact) {
      await sendSMS(securityCompany.contact, message);
    }
    
    if (securityCompany.email) {
      await sendEmail(securityCompany.email, 'Security Alert - Panic Button', message);
    }
  }, [sendSMS, sendEmail]);

  const notifySAPS = useCallback(async (panicData: PanicData): Promise<void> => {
    const { user, location, request, securityPreferences } = panicData;
    
    const sapsMessage = `SAPS EMERGENCY ALERT - Panic Button
      
Incident Details:
- Person in Distress: ${user.name}
- Contact: ${user.phone}
- Location: ${location.address}
- Coordinates: ${location.lat}, ${location.lng}
- Time of Incident: ${new Date().toLocaleString()}

Service Context:
- Service Provider: RubGo Massage
- Customer: ${request.customer}
- Scheduled Service: ${request.scheduledTime}

This is an automated emergency alert from RubGo Massage security system.
Immediate police response may be required.`;

    // Send email to SAPS
    if (securityPreferences.sapsIntegration?.stationContact) {
      await sendEmail(
        securityPreferences.sapsIntegration.stationContact,
        'EMERGENCY: Panic Button Alert - RubGo Massage',
        sapsMessage
      );
    }

    // Also send to general SAPS emergency email if available
    await sendEmail(
      'saps-emergency@saps.gov.za',
      'EMERGENCY: Panic Button Alert - RubGo Massage',
      sapsMessage
    );
  }, [sendEmail]);

  const notifyAdmin = useCallback(async (panicData: PanicData): Promise<void> => {
    const adminMessage = `PANIC BUTTON ACTIVATED - ADMIN ALERT
      
User: ${panicData.user.name} (${panicData.user.type})
Location: ${panicData.location.address}
Time: ${new Date().toLocaleString()}

Notifications Sent:
- Emergency Contacts: ${panicData.emergencyContacts.length}
- Security Company: ${panicData.securityCompany?.name || 'None'}
- SAPS: ${panicData.securityPreferences.notifications.autoSAPS ? 'Yes' : 'No'}

Action Required: Please monitor this situation and provide assistance.`;

    // Send to all admin users
    const adminEmails = ['admin@rubgo.com', 'security@rubgo.com'];
    
    for (const email of adminEmails) {
      await sendEmail(email, 'ADMIN: Panic Button Activated', adminMessage);
    }

    // Send push notifications to admin mobile app
    await sendPushNotification(panicData);
  }, [sendEmail, sendPushNotification]);

  const handlePanicAlert = useCallback(async (panicData: PanicData): Promise<void> => {
    setNotificationState(prev => ({ ...prev, loading: true, error: null, success: false }));

    try {
      console.log(`Processing panic alert for ${panicData.user.name} at ${panicData.location.address}`);

      const { securityPreferences } = panicData;
      const sentNotifications = {
        emergencyContacts: false,
        securityCompany: false,
        saps: false,
        admin: false,
      };

      // 1. Notify emergency contacts
      if (securityPreferences.notifications.sms || securityPreferences.notifications.email) {
        await notifyEmergencyContacts(panicData);
        sentNotifications.emergencyContacts = true;
      }

      // 2. Notify security company (within 25km radius)
      if (securityPreferences.notifications.autoSecurityCompany) {
        await notifySecurityCompany(panicData);
        sentNotifications.securityCompany = true;
      }

      // 3. Auto-contact SAPS if enabled
      if (securityPreferences.notifications.autoSAPS) {
        await notifySAPS(panicData);
        sentNotifications.saps = true;
      }

      // 4. Send push notifications to admin
      await notifyAdmin(panicData);
      sentNotifications.admin = true;

      setNotificationState({
        loading: false,
        error: null,
        success: true,
        sentNotifications,
      });

      console.log('Panic alert notifications sent successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send panic notifications';
      
      setNotificationState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        success: false,
      }));
      
      console.error('Error handling panic alert:', error);
    }
  }, [notifyEmergencyContacts, notifySecurityCompany, notifySAPS, notifyAdmin]);

  const resetNotificationState = useCallback((): void => {
    setNotificationState({
      loading: false,
      error: null,
      success: false,
      sentNotifications: {
        emergencyContacts: false,
        securityCompany: false,
        saps: false,
        admin: false,
      },
    });
  }, []);

  return {
    notificationState,
    handlePanicAlert,
    resetNotificationState,
  };
};

// Export types for use in other components
export type {
  PanicData,
  User,
  Location,
  Request,
  EmergencyContact,
  SecurityCompany,
  SecurityPreferences,
  NotificationState,
};