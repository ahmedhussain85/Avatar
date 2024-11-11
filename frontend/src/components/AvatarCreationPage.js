import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NiceAvatar from 'react-nice-avatar';
import Modal from './Modal';

const MemoizedNiceAvatar = React.memo(NiceAvatar);

export default function AvatarCreationPage() {
  const [userName, setUserName] = useState('');
  const [personNumber, setPersonNumber] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    const fetchPersonNumber = async () => {
      const orderRef = localStorage.getItem('orderRef');
      if (!orderRef) {
        navigate('/login');
        return;
      }
  
      const maxRetries = 10;
      let attempts = 0;
      let data = null;
  
      while (attempts < maxRetries) {
        try {
          const response = await fetch('http://localhost:3000/status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderRef }),
          });
  
          data = await response.json();
  
          if (data && data.status === 'complete' && data.completionData && data.completionData.user && data.completionData.user.personalNumber) {
            const fetchedPersonNumber = data.completionData.user.personalNumber;
            setPersonNumber(fetchedPersonNumber);
            localStorage.setItem('personNumber', fetchedPersonNumber);
  
            let existingUser = null;
            let userCheckAttempts = 0;
            const maxUserCheckAttempts = 5;

            while (!existingUser && userCheckAttempts < maxUserCheckAttempts) {
              // Fetch users from the database
              const usersResponse = await fetch('http://localhost:3000/database/users');
              const users = await usersResponse.json();
  
              // Check if a user with the same personNumber exists
              existingUser = users.find(user => user.personNumber === fetchedPersonNumber);
              console.log("info: " + existingUser);
              console.log("info2: " + users)
              
  
              if (existingUser) {
                console.log(`User with personNumber ${fetchedPersonNumber} already exists in the database.`);
                // Fetch and set user data here
                const userDataResponse = await fetch(`http://localhost:3000/database/users/${fetchedPersonNumber}`);
                if (userDataResponse.ok) {
                  const userData = await userDataResponse.json();
                  if (userData.avatarInfo) {
                    setAvatarProps(userData?.avatarInfo?.avatarInfo);
                    setUserName(userData?.avatarInfo?.avatarInfo?.userName);
                    console.log(userData?.avatarInfo);
                    console.log(userData?.avatarInfo?.avatarInfo?.userName);
                    //console.log("Full object:", JSON.stringify(userData, null, 2));
                  }
                }
              } else {
                userCheckAttempts++;
                if (userCheckAttempts < maxUserCheckAttempts) {
                  await new Promise(resolve => setTimeout(resolve, 1000));
                }
              }
            }

            if (!existingUser) {
              // Create a new user in the database
              const newUser = {
                personNumber: fetchedPersonNumber,
                avatarInfo: {
                  userName: "anyusername",
                  sex: "man",
                  faceColor: "",
                  earSize: "",
                  hairColor: "",
                  hairStyle: "",
                  hatColor: "",
                  hatStyle: "",
                  eyeStyle: "",
                  glassesStyle: "",
                  noseStyle: "",
                  mouthStyle: "",
                  shirtStyle: "",
                  shirtColor: "",
                  bgColor: "",
                  eyeBrowStyle: ""
                },
                hasPaid: false,
                userType: "user",
                hasLicense: false
              };
  
              try {
                const createUserResponse = await fetch('http://localhost:3000/database/users', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(newUser),
                });
  
                if (createUserResponse.ok) {
                  console.log(`New user with personNumber ${fetchedPersonNumber} created in the database.`);
                } else {
                  console.error(`Failed to create new user with personNumber ${fetchedPersonNumber} in the database.`);
                }
              } catch (error) {
                console.error("Error creating new user:", error);
              }
            }
  
            break;
          }
        } catch (error) {
          console.error("Error fetching or parsing data:", error);
        }
  
        if (localStorage.getItem('orderRef') !== null) {
          break;
        }
  
        if (!data || data.status !== 'complete') {
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
  
        if (attempts === maxRetries) {
          console.error('Failed to fetch status after maximum retries');
          navigate('/login');
          break;
        }
      }
    };
  
    fetchPersonNumber();
  }, [navigate]);

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

  const randomizeAvatar = () => {
    const newAvatarProps = { ...avatarProps };
  
    for (const key in avatarProps) {
      // Check if the key exists in options
      if (options.hasOwnProperty(key)) {
        // Validate if the value exists in the options list
        if (options[key].includes(avatarProps[key])) {
          const randomValue = options[key][Math.floor(Math.random() * options[key].length)];
          newAvatarProps[key] = randomValue;
        } else {
          console.warn(`Invalid value for ${key}: ${avatarProps[key]}. Setting to a random value.`);
          // Set to a random value from the options
          newAvatarProps[key] = options[key][Math.floor(Math.random() * options[key].length)];
        }
      } else {
        console.warn(`Key ${key} is not in options, skipping randomization.`);
      }
    }
  
    setAvatarProps(newAvatarProps);
  };//, [avatarProps]);

  const handleNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handleSaveAvatar = async () => {
    try {
      const updatedAvatarInfo = {
        avatarInfo: {
          ...avatarProps,
          userName: userName
        }
      };

      const response = await fetch(`http://localhost:3000/database/users/${personNumber}/avatarInfo`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAvatarInfo),
      });

      if (response.ok) {
        console.log('Avatar information updated successfully');
        localStorage.setItem('avatarProps', JSON.stringify(updatedAvatarInfo.avatarInfo));
        localStorage.setItem('userName', userName);
        navigate('/game');
      } else {
        const errorData = await response.json();
        console.error('Failed to update avatar information:', errorData);
        setError('Failed to save avatar. Please try again.');
      }
    } catch (error) {
      console.error('Error updating avatar information:', error);
      setError('An error occurred while saving the avatar. Please try again.');
    }
  };

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="p-8 flex flex-col items-center" style={{ backgroundColor: '#88dffc', minHeight: '100vh', position: 'relative' }}>
      <button
        onClick={openModal}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0092D0',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          position: 'absolute',
          top: '5%', 
          left: '10px',
          transform: 'translateY(-50%)',
        }}
      >
        Settings
      </button>

      <h1 style={{ display: 'flex', justifyContent: 'center', marginBottom: '0px', color: '#0092D0', marginTop: '0px' }} className="text-3xl font-bold mb-4">
        Create your avatar
      </h1>

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
        <h2 style={{ color: '#0092D0', marginBottom: '10px' }} className="text-xl font-semibold mb-2">
          Your Avatar:
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <MemoizedNiceAvatar style={{ width: '200px', height: '200px' }} {...avatarProps} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem' }} className="customizer-container">
        {Object.keys(options).map((option) => (
          <span
            key={option}
            style={{ fontSize: '2rem', cursor: 'pointer', margin: '0 10px', color: '#0092D0' }}
            onClick={() => handleAvatarPropsChange(option)}
          >
            {option === 'faceColor' ? '🎨' : 
             option === 'earSize' ? '👂' : 
             option === 'hairColor' ? '💇‍♂️' : 
             option === 'hairStyle' ? '💇‍♀️' : 
             option === 'hatColor' ? '🎩' : 
             option === 'hatStyle' ? '👒' : 
             option === 'eyeStyle' ? '👀' : 
             option === 'glassesStyle' ? '🕶️' : 
             option === 'noseStyle' ? '👃' : 
             option === 'mouthStyle' ? '👄' : 
             option === 'shirtStyle' ? '👕' : 
             option === 'shirtColor' ? '🧥' : ''}
          </span>
        ))}
        <span
          style={{ fontSize: '2rem', cursor: 'pointer', margin: '0 10px', color: '#0092D0' }}
          onClick={randomizeAvatar}
        >
          🎲
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <button
          onClick={handleSaveAvatar}
          style={{
            backgroundColor: '#0092D0',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            marginTop: '10px',
          }}
        >
          Save Avatar
        </button>
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2>Settings</h2>
          {/* Add settings content here */}
        </Modal>
      )}
    </div>
  );
}




/*import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NiceAvatar from 'react-nice-avatar';

const MemoizedNiceAvatar = React.memo(NiceAvatar);

export default function AvatarCreationPage() {
  const [userName, setUserName] = useState('');
  const [personNumber, setPersonNumber] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    const fetchPersonNumber = async () => {
      const orderRef = localStorage.getItem('orderRef');
      if (!orderRef) {
        navigate('/login');
        return;
      }

      const maxRetries = 10;
      let attempts = 0;
      let data = null;

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

      if (localStorage.getItem('orderRef') !== null) {
        break;
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

    fetchPersonNumber();
  }, [navigate]);

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

  const handleSaveAvatar = () => {
    localStorage.setItem('avatarProps', JSON.stringify(avatarProps));
    localStorage.setItem('userName', userName);
    navigate('/game');
  };

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="p-8 flex flex-col items-center" style={{ backgroundColor: '#88dffc', minHeight: '100vh' }}>
      <h1 style={{ display: 'flex', justifyContent: 'center', marginBottom: '0px', color: '#0092D0', marginTop: '0px' }} className="text-3xl font-bold mb-4">Create your avatar</h1>

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
        <span style={{ fontSize: '2rem', cursor: 'pointer', margin: '0 10px', color: '#0092D0' }} onClick={() => handleAvatarPropsChange('eyeBrowStyle')}>👁️‍🗨️</span>
        <span style={{ fontSize: '2rem', cursor: 'pointer', margin: '0 10px', color: '#0092D0' }} onClick={() => handleAvatarPropsChange('glassesStyle')}>🕶️</span>
        <span style={{ fontSize: '2rem', cursor: 'pointer', margin: '0 10px', color: '#0092D0' }} onClick={() => handleAvatarPropsChange('noseStyle')}>👃</span>
        <span style={{ fontSize: '2rem', cursor: 'pointer', margin: '0 10px', color: '#0092D0' }} onClick={() => handleAvatarPropsChange('mouthStyle')}>👄</span>
        <span style={{ fontSize: '2rem', cursor: 'pointer', margin: '0 10px', color: '#0092D0' }} onClick={() => handleAvatarPropsChange('shirtStyle')}>👕</span>
        <span style={{ fontSize: '2rem', cursor: 'pointer', margin: '0 10px', color: '#0092D0' }} onClick={() => handleAvatarPropsChange('shirtColor')}>🎽</span>
        <span style={{ fontSize: '2rem', cursor: 'pointer', margin: '0 10px', color: '#0092D0' }} onClick={() => handleAvatarPropsChange('bgColor')}>🌈</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
      <button 
        onClick={randomizeAvatar}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4"
        style={{ backgroundColor: '#0092D0' }}
      >
        Randomize Avatar
      </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
      <button
        onClick={handleSaveAvatar}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
        style={{ backgroundColor: '#0092D0' }}
      >
        Save Avatar
      </button>
      </div>
    </div>
  );
}*/

