import React, { useState } from 'react';

const GameModal = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    maxWidth: '400px',
    width: '100%',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    textAlign: 'center',
    color: 'black'
  };

  const buttonStyle = {
    display: 'block',
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const errorStyle = {
    color: 'red',
    marginTop: '1rem',
    textAlign: 'center',
  };

  const onInitiatePayment = async () => {
    setIsLoading(true);
    setError(null);

    const paymentData = {
      order: {
        items: [
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
        amount: 1200,
        currency: "EUR",
        reference: "order_ref_1"
      },
      checkout: {
        integrationType: "HostedPaymentPage",
        returnUrl: "http://localhost:3001/game",
        cancelUrl: "http://example.com/cancel",
        consumer: {
          email: "consumer@example.com"
        },
        termsUrl: "http://example.com/terms"
      }
    };

    try {
      const response = await fetch('http://localhost:3000/api/createpayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Payment initiation failed');
      }

      const data = await response.json();
      
      if (data.hostedPaymentPageUrl) {
        window.location.href = data.hostedPaymentPageUrl;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (err) {
      console.error('Error during payment initiation:', err);
      setError(err.message || 'An error occurred during payment initiation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={titleStyle}>Do you want to keep playing?</h2>
        <button
          style={buttonStyle}
          onClick={onInitiatePayment}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Initiate Payment'}
        </button>
        {error && <p style={errorStyle}>{error}</p>}
      </div>
    </div>
  );
};

export default GameModal;