import React from 'react';

interface DownloadSectionProps {
  appStoreUrl?: string;
  googlePlayUrl?: string;
  qrCodeIos?: string;
  qrCodeAndroid?: string;
}

const DownloadSection: React.FC<DownloadSectionProps> = ({
  appStoreUrl = "#",
  googlePlayUrl = "#",
  qrCodeIos,
  qrCodeAndroid
}) => {
  return (
    <div className="download-section">
      <h2 className="section-title">Download Our App</h2>
      
      <div className="download-container">
        <div className="qr-section">
          <div className="qr-code">
            {qrCodeIos ? (
              <img src={qrCodeIos} alt="QR Code for App Store" />
            ) : (
              <div>QR Code for App Store</div>
            )}
          </div>
          <div className="qr-label">Scan for iOS</div>
          
          <div className="qr-code">
            {qrCodeAndroid ? (
              <img src={qrCodeAndroid} alt="QR Code for Google Play" />
            ) : (
              <div>QR Code for Google Play</div>
            )}
          </div>
          <div className="qr-label">Scan for Android</div>
        </div>
        
        <div className="stores-section">
          <a href={appStoreUrl} className="store-button app-store" target="_blank" rel="noopener noreferrer">
            <div className="store-logo">
              {/* Apple logo SVG */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 16.96 2.93997 12.04 4.69997 8.94C5.56997 7.33 7.12997 6.32 8.81997 6.32C10.22 6.32 11.45 7.24 12.34 7.24C13.19 7.24 14.67 6.26 16.32 6.43C16.99 6.46 18.39 6.66 19.43 7.84C19.36 7.91 17.39 9.41 17.42 11.81C17.45 14.65 19.87 15.66 19.91 15.67C19.87 15.74 19.49 17.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" fill="black"/>
              </svg>
            </div>
            <div className="store-text">
              <p>Download on the</p>
              <p>App Store</p>
            </div>
          </a>
          
          <a href={googlePlayUrl} className="store-button google-play" target="_blank" rel="noopener noreferrer">
            <div className="store-logo">
              {/* Google Play logo SVG */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.60999 1.31L13.79 12L3.60999 22.69C3.45999 22.56 3.32999 22.43 3.20999 22.28C2.81999 21.81 2.60999 21.2 2.60999 20.52V3.48C2.60999 2.8 2.81999 2.19 3.20999 1.72C3.32999 1.57 3.45999 1.44 3.60999 1.31Z" fill="white"/>
                <path d="M20.76 11.29L16.64 9.13L13.79 12L16.64 14.87L20.76 12.71C21.18 12.47 21.44 12.01 21.44 11.5C21.44 10.99 21.18 10.53 20.76 10.29Z" fill="white"/>
                <path d="M15.65 7.56L14.06 6.12L8.67001 11.5L14.06 16.88L15.65 15.44L11.83 11.5L15.65 7.56Z" fill="white"/>
                <path d="M16.64 9.13L15.65 7.56L8.67001 11.5L15.65 15.44L16.64 14.87L20.76 12.71C21.18 12.47 21.44 12.01 21.44 11.5C21.44 10.99 21.18 10.53 20.76 10.29L16.64 9.13Z" fill="white"/>
              </svg>
            </div>
            <div className="store-text">
              <p>Get it on</p>
              <p>Google Play</p>
            </div>
          </a>
          
          <div className="divider">
            <span>OR</span>
          </div>
          
          <p style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>
            Scan the QR codes with your phone's camera to download directly
          </p>
        </div>
      </div>
    </div>
  );
};

export default DownloadSection;