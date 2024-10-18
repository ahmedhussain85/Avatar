import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameModal from '../components/GameModal';
import NiceAvatar from 'react-nice-avatar';
import CountdownTimer from '../components/CountdownTimer';

const MemoizedNiceAvatar = React.memo(NiceAvatar);

export default function GamePage() {
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [personNumber, setPersonNumber] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPaid, setHasPaid] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [avatarProps, setAvatarProps] = useState({
    sex: 'man',
    faceColor: '#F9C9B6',
    earSize: 'small',
    hairColor: '#000000',
    hairStyle: 'normal',
    hatColor: '#000000',
    hatStyle: 'none',
    eyeStyle: 'circle',
    glassesStyle: 'none',
    noseStyle: 'short',
    mouthStyle: 'smile',
    shirtStyle: 'hoody',
    shirtColor: '#F4D150',
    bgColor: '#6BD9E9',
    eyeBrowStyle: 'up',
  });

  const options = {
    sex: ['man', 'woman'],
    faceColor: ['#F9C9B6', '#AC6651', '#F4D150'],
    earSize: ['small', 'big'],
    hairColor: ['#000000', '#A55728', '#FFFFFF', '#F4D150'],
    hairStyle: ['normal', 'thick', 'mohawk', 'womanLong', 'womanShort'],
    hatColor: ['#000000', '#F4D150', '#A55728'],
    hatStyle: ['none', 'beanie', 'turban'],
    eyeStyle: ['circle', 'oval', 'smile'],
    eyeBrowStyle: ['up', 'upWoman'],
    glassesStyle: ['none', 'round', 'square'],
    noseStyle: ['short', 'long', 'round'],
    mouthStyle: ['laugh', 'smile', 'peace'],
    shirtStyle: ['hoody', 'short', 'polo'],
    shirtColor: ['#F4D150', '#A55728', '#FFFFFF'],
    bgColor: ['#6BD9E9', '#F4D150', '#9287FF'],
  };

  useEffect(() => {
  const verifyPaymentAndLoadGame = async () => {
    const orderRef = localStorage.getItem('orderRef');
    const storedPersonNumber = localStorage.getItem('personNumber');
    
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

    if (!orderRef) {
      console.log('No orderRef found, redirecting to login');
      navigate('/login');
      return;
    }

    if (storedPersonNumber) {
      setPersonNumber(storedPersonNumber);
    } else {
      await fetchPersonNumber(orderRef);
    }

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


const fetchPersonNumber = async (orderRef) => {
  const maxRetries = 10; // Set the maximum number of retries
  let attempts = 0; // Counter for attempts
  let data = null; // Initialize data variable outside loop

  while (attempts < maxRetries) {
    try {
      // Make the request inside the loop to retry fetching if needed
      const response = await fetch('http://localhost:3000/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderRef }),
      });

      // Parse JSON from response
      data = await response.json();

      // Check if the data is complete and contains the personalNumber
      if (data && data.status === 'complete' && data.completionData && data.completionData.user && data.completionData.user.personalNumber) {
        setPersonNumber(data.completionData.user.personalNumber);
        localStorage.setItem('personNumber', data.completionData.user.personalNumber);
        console.log('Personal Number successfully fetched:', data.completionData.user.personalNumber);
        break; // Exit the loop once the personNumber is successfully retrieved
      }
    } catch (error) {
      console.error("Error fetching or parsing status:", error);
    }

    // If no data or incomplete response, retry
    if (!data || data.status !== 'complete') {
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
    }

    // If max retries are reached, throw error and redirect
    if (attempts === maxRetries) {
      console.error('Failed to fetch status after maximum retries');
      navigate('/login'); // Redirect to login page if retries exhausted
      break;
    }
  }
};


  const chargePayment = async (paymentId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/payments/${paymentId}/charges`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      const isVerified = await verifyCharge(chargeId);
      
      if (isVerified) {
        // If charge verification succeeds, return true and stop retrying
        return true;
      }
  
      // Log an error only if it's the last attempt
      if (attempt === maxAttempts) {
        console.error(`Failed to verify charge after ${maxAttempts} attempts.`);
      } else {
        // Wait for an increasing delay before the next retry
        await new Promise(resolve => setTimeout(resolve, initialDelayMs * Math.pow(2, attempt - 1)));
      }
    }
  
    // Return false if all attempts to verify the charge fail
    return false;
  };

  const handleAvatarPropsChange = useCallback((property) => {
    setAvatarProps((prevProps) => {
      const currentValue = prevProps[property];
      const propertyOptions = options[property];
      const currentIndex = propertyOptions.indexOf(currentValue);
      const nextIndex = (currentIndex + 1) % propertyOptions.length;
      const newValue = propertyOptions[nextIndex];
      return { ...prevProps, [property]: newValue };
    });
  }, []);

  const randomizeAvatar = useCallback(() => {
    const newAvatarProps = Object.keys(avatarProps).reduce((acc, key) => {
      const randomValue = options[key][Math.floor(Math.random() * options[key].length)];
      return { ...acc, [key]: randomValue };
    }, {});
    setAvatarProps(newAvatarProps);
  }, [avatarProps]);

  const handleNameChange = (e) => {
    setUserName(e.target.value);
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
      <h1 style={{ display: 'flex', justifyContent: 'center', marginBottom: '0px', color: '#0092D0', marginTop: '0px' }} className="text-3xl font-bold mb-4">Create your avatar</h1>

      {!hasPaid && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0px' }}>
          <CountdownTimer initialTime={10} onCountdownEnd={handleCountdownEnd} />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center' }} className="mb-4">
        <input
          type="text"
          value={userName}
          onChange={handleNameChange}
          placeholder="Enter your name"
          className="border rounded p-2"
          style={{ borderColor: '#0092D0', borderWidth: '2px' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="avatar-container mb-4">
        <h2 style={{ color: '#0092D0', marginBottom: '10px' }} className="text-xl font-semibold mb-2">Your Avatar:</h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <MemoizedNiceAvatar style={{ width: '200px', height: '200px' }} {...avatarProps} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem' }} className="customizer-container">
        <span style={{ fontSize: '2rem', cursor: 'pointer', margin: '0 10px', color: '#0092D0' }} onClick={() => handleAvatarPropsChange('faceColor')}>🎨</span>
        <span style={{ fontSize: '2rem', cursor: 'pointer', margin: '0 10px', color: '#0092D0' }} onClick={() => handleAvatarPropsChange('earSize')}>👂</span>
        <span style={{ fontSize: '2rem', cursor: 'pointer', margin: '0 10px', color: '#0092D0' }} onClick={() => handleAvatarPropsChange('hairColor')}>💇‍♂️</span>
        <span style={{ fontSize: '2rem', cursor: 'pointer', margin: '0 10px', color: '#0092D0' }} onClick={() => handleAvatarPropsChange('hairStyle')}>💇‍♀️</span>
        <span style={{ fontSize: '2rem', cursor: 'pointer', margin: '0 10px', color: '#0092D0' }} onClick={() => handleAvatarPropsChange('hatColor')}>🎩</span>
        <span style={{ fontSize: '2rem', cursor: 'pointer', margin: '0 10px', color: '#0092D0' }} onClick={() => handleAvatarPropsChange('hatStyle')}>👒</span>
        <span style={{ fontSize: '2rem', cursor: 'pointer', margin: '0 10px', color: '#0092D0' }} onClick={() => handleAvatarPropsChange('eyeStyle')}>👀</span>
        <span style={{ fontSize: '2rem', cursor: 'pointer', margin: '0 10px', color: '#0092D0' }} onClick={() =>   handleAvatarPropsChange('eyeBrowStyle')}>👁️‍🗨️</span>
        <span style={{ fontSize: '2rem', cursor: 'pointer', margin: '0 10px', color: '#0092D0' }} onClick={() => handleAvatarPropsChange('glassesStyle')}>🕶️</span>
        <span style={{ fontSize: '2rem', cursor: 'pointer', margin: '0 10px', color: '#0092D0' }} onClick={() => handleAvatarPropsChange('noseStyle')}>👃</span>
        <span style={{ fontSize: '2rem', cursor: 'pointer', margin: '0 10px', color: '#0092D0' }} onClick={() => handleAvatarPropsChange('mouthStyle')}>👄</span>
        <span style={{ fontSize: '2rem', cursor: 'pointer', margin: '0 10px', color: '#0092D0' }} onClick={() => handleAvatarPropsChange('shirtStyle')}>👕</span>
        <span style={{ fontSize: '2rem', cursor: 'pointer', margin: '0 10px', color: '#0092D0' }} onClick={() => handleAvatarPropsChange('shirtColor')}>👖</span>
        <span style={{ fontSize: '2rem', cursor: 'pointer', margin: '0 10px', color: '#0092D0' }} onClick={() => handleAvatarPropsChange('bgColor')}>🌈</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <button
          onClick={randomizeAvatar}
          className="bg-blue-500 text-white py-2 px-4 rounded"
          style={{
            backgroundColor: '#0092D0',
            border: 'none',
            borderRadius: '5px',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#007BB8'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0092D0'}
        >
          Randomize Avatar
        </button>
      </div>

      <div style={{ marginTop: '1rem', color: '#0092D0' }}>
        <p>Personal Number: {personNumber}</p>
      </div>

      <GameModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
