import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const BankIDLogin = () => {
  const [isLoadingThis, setIsLoadingThis] = useState(false);
  const [isLoadingOther, setIsLoadingOther] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [authData, setAuthData] = useState(null);
  const [endUserIp, setEndUserIp] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [qrCodeImage, setQrCodeImage] = useState('');
  const eventSourceRef = useRef(null);

  useEffect(() => {
    const fetchIpAndAuthenticate = async () => {
      try {
        const ipResponse = await fetch('http://localhost:3000/api/get-ip');
        const ipData = await ipResponse.json();
        setEndUserIp(ipData.ip);

        const authResponse = await fetch('http://localhost:3000/authenticate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endUserIp: ipData.ip,
            requirement: {}
          }),
        });

        if (!authResponse.ok) {
          throw new Error('Authentication failed');
        }

        const authResult = await authResponse.json();
        setAuthData(authResult);
        console.log('Authentication successful:', authResult);
      } catch (err) {
        console.error('Error during initial setup:', err);
        setError(err instanceof Error ? err.message : 'An error occurred during setup');
      }
    };

    fetchIpAndAuthenticate();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const handleLoginThisDevice = async () => {
    setIsLoadingThis(true);
    setError(null);
    setSuccess(false);

    try {
      const urlResponse = await fetch('http://localhost:3000/generateBankIDUrl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          autoStartToken: authData.autoStartToken,
          returnUrl: "http://localhost:3001/game"
        }),
      });

      if (!urlResponse.ok) {
        throw new Error('Failed to generate BankID URL');
      }

      const bankIdUrl = await urlResponse.text();
      console.log('BankID URL generated:', bankIdUrl);

      window.location.href = bankIdUrl;

      window.addEventListener('focus', function onFocus() {
        window.removeEventListener('focus', onFocus);
        window.location.reload();
      });

      setSuccess(true);
    } catch (err) {
      console.error('Error during BankID process:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during the BankID process');
    } finally {
      setIsLoadingThis(false);
    }
  };

  const handleLoginAnotherDevice = () => {
    setIsLoadingOther(true);
    setError(null);
    setSuccess(false);
    setQrCode('');
    setQrCodeImage('');

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const url = new URL('http://localhost:3000/generateQrCode');
    url.searchParams.append('qrStartToken', authData.qrStartToken);
    url.searchParams.append('qrStartSecret', authData.qrStartSecret);

    eventSourceRef.current = new EventSource(url);

    eventSourceRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.qrCode) {
          setQrCode(data.qrCode);
        }
        if (data.qrCodeImage) {
          setQrCodeImage(`data:image/png;base64,${data.qrCodeImage}`);
        }
      } catch (err) {
        // If parsing fails, assume it's the expiration message
        if (event.data === "QR code expired after 30 seconds.") {
          setError(event.data);
          setIsLoadingOther(false);
          setQrCode('');
          setQrCodeImage('');
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
          }
        } else {
          console.error('Error parsing event data:', err);
        }
      }
    };

    eventSourceRef.current.onerror = (error) => {
      console.error('EventSource failed:', error);
      setError('Failed to generate QR code');
      setIsLoadingOther(false);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f0f0',
    fontFamily: 'Arial, sans-serif',
  };

  const cardStyle = {
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    textAlign: 'center',
    color: 'black',
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '1rem',
  };

  const alertStyle = {
    padding: '0.75rem',
    borderRadius: '4px',
    marginTop: '1rem',
  };

  const errorAlertStyle = {
    ...alertStyle,
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
  };

  const successAlertStyle = {
    ...alertStyle,
    backgroundColor: '#fff3cd',
    color: '#856404',
    border: '1px solid #ffeeba',
  };

  const qrCodeStyle = {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>BankID Login</h1>
        <button 
          onClick={handleLoginThisDevice} 
          disabled={isLoadingThis || isLoadingOther || !authData}
          style={buttonStyle}
        >
          {isLoadingThis ? 'Processing...' : 'Login with this device'}
        </button>
        <button 
          onClick={handleLoginAnotherDevice} 
          disabled={isLoadingThis || isLoadingOther || !authData}
          style={buttonStyle}
        >
          {isLoadingOther ? 'Processing...' : 'Login with another device'}
        </button>
        {error && (
          <div style={errorAlertStyle}>
            <strong>Error:</strong> {error}
          </div>
        )}
        {success && (
          <div style={successAlertStyle}>
            BankID process initiated!
          </div>
        )}
        {qrCodeImage && (
          <div style={qrCodeStyle}>
            <strong>Scan this QR Code:</strong>
            <img src={qrCodeImage} alt="QR Code" style={{ width: '200px', height: '200px' }} />
          </div>
        )}
        {!qrCodeImage && qrCode && (
          <div style={qrCodeStyle}>
            <strong>Scan this QR Code:</strong>
            <QRCodeSVG value={qrCode} size={200} level="H" />
          </div>
        )}
      </div>
    </div>
  );
};

export default BankIDLogin;

