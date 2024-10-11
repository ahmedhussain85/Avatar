import React, { useState, useEffect } from 'react';

export default function CountdownTimer({ initialTime, onCountdownEnd }) {
  const [countdown, setCountdown] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          onCountdownEnd();
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Clear interval on component unmount
  }, [onCountdownEnd]);

  return <p className="mb-4">Game will pause in: {countdown} seconds</p>;
}
