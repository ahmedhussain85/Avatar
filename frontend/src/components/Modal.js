// Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          width: '400px',
          textAlign: 'center',
        }}
      >
        {children}
        <button /*onClick={}*/ style={{ marginTop: '20px' }}>Buy License</button>
        <button onClick={onClose} style={{ marginTop: '20px' }}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
