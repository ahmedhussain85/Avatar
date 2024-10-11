import React, { useState, useCallback } from 'react';
import GameModal from './GameModal';
import NiceAvatar from 'react-nice-avatar';
import CountdownTimer from './CountdownTimer'; // Import CountdownTimer

const MemoizedNiceAvatar = React.memo(NiceAvatar);

export default function GamePage() {
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState('');
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
    setShowModal(true);
  };

  const iconStyle = {
    fontSize: '2rem',
    cursor: 'pointer',
    margin: '0 10px',
    color: '#0092D0', // Primary color for icons
  };

  // Inline styles
  const avatarContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const customizerContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '1rem',
  };

  return (
    <div className="p-8 flex flex-col items-center" style={{ backgroundColor: '#88dffc', minHeight: '100vh' }}>
      <h1 style={{ display: 'flex', justifyContent: 'center',marginBottom: '0px', color: '#0092D0', marginTop: '0px' }} className="text-3xl font-bold mb-4">Create your avatar</h1>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0px' }}>
        <CountdownTimer initialTime={600} onCountdownEnd={handleCountdownEnd} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }} className="mb-4">
        <input
          type="text"
          value={userName}
          onChange={handleNameChange}
          placeholder="Enter your name"
          className="border rounded p-2"
          style={{ borderColor: '#0092D0', borderWidth: '2px' }} // Custom border color
        />
      </div>

      <div style={avatarContainerStyle} className="avatar-container mb-4">
        <h2 style={{ color: '#0092D0', marginBottom: '10px' }} className="text-xl font-semibold mb-2">Your Avatar:</h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <MemoizedNiceAvatar style={{ width: '200px', height: '200px' }} {...avatarProps} />
        </div>
      </div>

      <div style={customizerContainerStyle} className="customizer-container">
        {/* Icon Buttons for Avatar Customization */}
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

      {/* Wrapper for Button to ensure centering */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <button
          onClick={randomizeAvatar}
          className="bg-blue-500 text-white py-2 px-4 rounded"
          style={{
            backgroundColor: '#0092D0', // Primary button color
            border: 'none',
            borderRadius: '5px',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#007BB8'} // Darker shade on hover
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0092D0'} // Reset color
        >
          Randomize Avatar
        </button>
      </div>

      <GameModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}














