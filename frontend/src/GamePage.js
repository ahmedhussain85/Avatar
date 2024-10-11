import React, { useState, useEffect, useCallback, useMemo } from 'react';
import GameModal from './GameModal';
import NiceAvatar from 'react-nice-avatar';
import AvatarCustomizer from './AvatarCustomizer';

const MemoizedNiceAvatar = React.memo(NiceAvatar);

export default function GamePage() {
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(600);

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
    eyeBrowStyle: 'up'
  });

  const memoizedAvatarProps = useMemo(() => avatarProps, [avatarProps]);

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

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleAvatarPropsChange = useCallback((newProps) => {
    setAvatarProps((prevProps) => ({ ...prevProps, ...newProps }));
  }, []);

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Game</h1>
      {countdown > 0 && <p className="mb-4">Game will pause in: {countdown} seconds</p>}

      <div className="avatar-container">
        <h2 className="text-xl font-semibold mb-2">Your Avatar:</h2>
        <MemoizedNiceAvatar
          style={{ width: '200px', height: '200px' }}
          {...memoizedAvatarProps}
        />
      </div>

      <div className="customizer-container">
        <h3 className="text-lg font-semibold mb-2">Customize Your Avatar</h3>
        <AvatarCustomizer
          avatarProps={memoizedAvatarProps}
          onAvatarPropsChange={handleAvatarPropsChange}
        />
      </div>

      <GameModal isOpen={showModal} onClose={closeModal} />
    </div>
  );
}








