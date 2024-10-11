import React, { useState, useEffect } from 'react';
import GameModal from './GameModal';



const GamePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(10);

  /*fetch('http://localhost:3000/api/payments/' + {paymentId})
    .then(response => response.json())
    .then(data => {
        this.setState({ items: data }); // Set the fetched data into the state
        if (data != null) {
            console.log(data); // Log the data after it has been fetched and set
        }
    })
    .catch(error => console.error('Error:', error));*/
  

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          setShowModal(true);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to the Game</h1>
      {countdown > 0 && (
        <p>Game will pause in: {countdown} seconds</p>
      )}
      <GameModal isOpen={showModal} onClose={closeModal} />
    </div>
  );
};

export default GamePage;