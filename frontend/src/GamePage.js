import React, { useState, useEffect, useCallback } from 'react';
import GameModal from './GameModal';
import NiceAvatar from 'react-nice-avatar';

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
    eyeBrowStyle: 'up',
  });

  // Define all possible options for each property
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

    return () => clearInterval(timer); // Clear interval on component unmount
  }, []);

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

  const iconStyle = {
    fontSize: '2rem',
    cursor: 'pointer',
    margin: '0 10px',
  };

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Game</h1>
      {countdown > 0 && <p className="mb-4">Game will pause in: {countdown} seconds</p>}

      <div className="avatar-container">
        <h2 className="text-xl font-semibold mb-2">Your Avatar:</h2>
        <MemoizedNiceAvatar style={{ width: '200px', height: '200px' }} {...avatarProps} />
      </div>

      <div className="customizer-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: '20px 0' }}>
        {/* Icon Buttons for Avatar Customization */}
        <span style={iconStyle} onClick={() => handleAvatarPropsChange('sex')}>
          {avatarProps.sex === 'man' ? '👨' : '👩'}
        </span>
        <span style={iconStyle} onClick={() => handleAvatarPropsChange('faceColor')}>🎨</span>
        <span style={iconStyle} onClick={() => handleAvatarPropsChange('earSize')}>👂</span>
        <span style={iconStyle} onClick={() => handleAvatarPropsChange('hairColor')}>💇‍♂️</span>
        <span style={iconStyle} onClick={() => handleAvatarPropsChange('hairStyle')}>💇‍♀️</span>
        <span style={iconStyle} onClick={() => handleAvatarPropsChange('hatColor')}>🎩</span>
        <span style={iconStyle} onClick={() => handleAvatarPropsChange('hatStyle')}>👒</span>
        <span style={iconStyle} onClick={() => handleAvatarPropsChange('eyeStyle')}>👀</span>
        <span style={iconStyle} onClick={() => handleAvatarPropsChange('eyeBrowStyle')}>👁️‍🗨️</span>
        <span style={iconStyle} onClick={() => handleAvatarPropsChange('glassesStyle')}>🕶️</span>
        <span style={iconStyle} onClick={() => handleAvatarPropsChange('noseStyle')}>👃</span>
        <span style={iconStyle} onClick={() => handleAvatarPropsChange('mouthStyle')}>👄</span>
        <span style={iconStyle} onClick={() => handleAvatarPropsChange('shirtStyle')}>👕</span>
        <span style={iconStyle} onClick={() => handleAvatarPropsChange('shirtColor')}>👖</span>
        <span style={iconStyle} onClick={() => handleAvatarPropsChange('bgColor')}>🌈</span>
      </div>

      <GameModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}










