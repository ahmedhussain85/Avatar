import React, { useState, useEffect } from 'react';

export default function CountdownTimer({ initialTime, onCountdownEnd }) {
  const [countdown, setCountdown] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          return 0; // Set countdown to 0 after the timer ends
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Clear interval on component unmount
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      onCountdownEnd(); // Call onCountdownEnd when countdown reaches zero
    }
  }, [countdown, onCountdownEnd]); // Depend on countdown and onCountdownEnd

  return <p className="mb-4">Game will pause in: {countdown} seconds</p>;
}


