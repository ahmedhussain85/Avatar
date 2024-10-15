import React, { useState } from 'react';
import GameModal from '../components/GameModal';


const GameModalDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleInitiatePayment = () => {
    console.log('User chose to initiate payment');
    // Add payment logic here
    closeModal();
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <button 
        onClick={openModal}
        style={{
          padding: '0.75rem 1rem',
          fontSize: '1rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Open Game Modal
      </button>
      <GameModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onInitiatePayment={handleInitiatePayment}
      />
    </div>
  );
};

export default GameModalDemo;