import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameModal from '../components/GameModal';
import NiceAvatar from 'react-nice-avatar';
import CountdownTimer from '../components/CountdownTimer';

const MemoizedNiceAvatar = React.memo(NiceAvatar);

export default function GamePage() {
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [avatarProps, setAvatarProps] = useState({});
  const [personNumber, setPersonNumber] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPaid, setHasPaid] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyPaymentAndLoadGame = async () => {
      const orderRef = localStorage.getItem('orderRef');
      const storedPersonNumber = localStorage.getItem('personNumber');
      const storedUserName = localStorage.getItem('userName');
      const storedAvatarProps = JSON.parse(localStorage.getItem('avatarProps'));
      
      if (!orderRef || !storedPersonNumber || !storedUserName || !storedAvatarProps) {
        navigate('/avatar');
        return;
      }

      setUserName(storedUserName);
      setAvatarProps(storedAvatarProps);
      setPersonNumber(storedPersonNumber);

      const urlParams = new URLSearchParams(location.search);
      let paymentId = urlParams.get('paymentid') || urlParams.get('paymentId');

      console.log('Initial state:', { orderRef, storedPersonNumber, paymentId, fullUrl: location.search });

      if (!paymentId && location.search.includes('paymentid=')) {
        const paymentIdMatch = location.search.match(/paymentid=([^&]+)/);
        if (paymentIdMatch) {
          paymentId = paymentIdMatch[1];
        }
      }

      console.log('Extracted paymentId:', paymentId);

      const storedHasPaid = localStorage.getItem('hasPaid');
      console.log('Stored hasPaid:', storedHasPaid);

      if (storedHasPaid === 'true') {
        console.log('User has already paid according to localStorage');
        setHasPaid(true);
        setIsLoading(false);
        return;
      }

      if (paymentId) {
        try {
          console.log('Attempting to charge payment:', paymentId);
          const chargeId = await chargePayment(paymentId);
      
          if (chargeId) {
            console.log('Payment charged, chargeId:', chargeId);
      
            let isVerified = false;
            const maxRetries = 10; // Set the maximum number of retries
            let attempts = 0; // Counter for attempts
      
            // Loop until charge is verified or maximum attempts are reached
            while (!isVerified && attempts < maxRetries) {
              console.log(`Verifying charge (Attempt ${attempts + 1}/${maxRetries})`);
              isVerified = await verifyChargeWithRetry(chargeId); // This handles retries
      
              if (isVerified) {
              setHasPaid(true);
              localStorage.setItem('hasPaid', 'true');
              console.log('Payment verified and stored');
              }
              else if (!isVerified) {
                attempts++;
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
              }
              else if (attempts === maxRetries) {
              console.error('Payment verification failed: Charge not found or invalid after multiple attempts');
              setError('Payment verification failed. Please try again or contact support.');
              }
            }
      
            // Check if verification succeeded after all attempts
             
          } //else {
            //console.error('Failed to obtain chargeId after multiple attempts');
            //setError('Failed to process payment. Please try again or contact support.');
          //}
        } catch (err) {
          console.error('Error processing payment:', err);
          setError(`Payment processing failed: ${err.message}`);
        }
      } else {
        console.log('No paymentId found in URL');
      }
      
  
      setIsLoading(false);
    };

    verifyPaymentAndLoadGame();
  }, [location, navigate]);

  const chargePayment = async (paymentId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/payments/${paymentId}/charges`, {
        method: 'POST',
        headers: {
          'Content-Type':   'application/json',
        },
        body: JSON.stringify({
          amount: 1200,
          orderItems: [
            {
              reference: "item_ref_1",
              name: "Item Name",
              quantity: 1,
              unit: "pcs",
              unitPrice: 1000,
              taxRate: 20,
              taxAmount: 200,
              grossTotalAmount: 1200,
              netTotalAmount: 1000
            }
          ],
          shipping: {
            trackingNumber: "TRACK12345",
            provider: "DHL"
          },
          finalCharge: true,
          myReference: "charge_ref_1",
          paymentMethodReference: "method_ref_1"
        }),
      });

      console.log('Charge payment response status:', response.status);
      console.log('Charge payment response headers:', response.headers);

      const responseText = await response.text();
      console.log('Charge payment response text:', responseText);

      if (response.ok || response.status === 500) {
        try {
          const data = JSON.parse(responseText);
          if (data.chargeId) {
            return data.chargeId;
          } else {
            console.error('Charge ID not found in server response');
            return null;
          }
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
          return null;
        }
      } else if (response.status === 402) {
        console.log('Payment already charged');
        try {
          const data = JSON.parse(responseText);
          return data.chargeId || null;
        } catch (parseError) {
          console.error('Error parsing JSON for 402 response:', parseError);
          return null;
        }
      } else {
        console.error(`Unexpected response status: ${response.status}`, responseText);
        return null;
      }
    } catch (err) {
      console.error('Charge payment error:', err);
      return null;
    }
  };

  const verifyCharge = async (chargeId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/charges/${chargeId}`);
      console.log('Charge verification response status:', response.status);
      
      const responseText = await response.text();
      console.log('Charge verification response text:', responseText);

      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          console.log('Charge verification data:', data);
          return data && data.chargeId && data.amount > 0;
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
          return false;
        }
      } else {
        console.error('Verify charge error:', response.status, response.statusText);
        return false;
      }
    } catch (err) {
      console.error('Error verifying charge:', err);
      return false;
    }
  };

  const verifyChargeWithRetry = async (chargeId, maxAttempts = 10, initialDelayMs = 1000) => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`Verifying charge attempt ${attempt}/${maxAttempts}`);
      const isVerified = await verifyCharge(chargeId);
      if (isVerified) {
        return true;
      }
      if (attempt < maxAttempts) {
        const delayMs = initialDelayMs * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`Verification attempt ${attempt} failed, retrying in ${delayMs}ms`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    return false;
  };

  const handleCountdownEnd = () => {
    if (!hasPaid) {
      setShowModal(true);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="p-8 flex flex-col items-center" style={{ backgroundColor: '#88dffc', minHeight: '100vh' }}>
      <h1 style={{ display: 'flex', justifyContent: 'center', marginBottom: '0px', color: '#0092D0', marginTop: '0px' }} className="text-3xl font-bold mb-4">Welcome to the Game, {userName}!</h1>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0px' }}>
        
      {(hasPaid === null || hasPaid === false) && (
        <CountdownTimer initialTime={10} onCountdownEnd={handleCountdownEnd} />
      )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="avatar-container mb-4">
        <h2 style={{ color: '#0092D0', marginBottom: '10px' }} className="text-xl font-semibold mb-2">Your Avatar:</h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <MemoizedNiceAvatar style={{ width: '200px', height: '200px' }} {...avatarProps} />
        </div>
      </div>

      <div style={{ marginTop: '1rem', color: '#0092D0' }}>
        <p>Personal Number: {personNumber}</p>
      </div>

      <GameModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

