import React, { memo, useCallback } from 'react';

const AvatarCustomizer = memo(({ avatarProps, onAvatarPropsChange }) => {
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    onAvatarPropsChange({ [name]: value });
  }, [onAvatarPropsChange]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block">
          Sex:
          <select name="sex" value={avatarProps.sex} onChange={handleChange} className="ml-2">
            <option value="man">Man</option>
            <option value="woman">Woman</option>
          </select>
        </label>
      </div>

      <div>
        <label className="block">
          Face Color:
          <input type="color" name="faceColor" value={avatarProps.faceColor} onChange={handleChange} className="ml-2" />
        </label>
      </div>

      <div>
        <label className="block">
          Ear Size:
          <select name="earSize" value={avatarProps.earSize} onChange={handleChange} className="ml-2">
            <option value="small">Small</option>
            <option value="big">Big</option>
          </select>
        </label>
      </div>

      <div>
        <label className="block">
          Hair Color:
          <input type="color" name="hairColor" value={avatarProps.hairColor} onChange={handleChange} className="ml-2" />
        </label>
      </div>

      <div>
        <label className="block">
          Hair Style:
          <select name="hairStyle" value={avatarProps.hairStyle} onChange={handleChange} className="ml-2">
            <option value="normal">Normal</option>
            <option value="thick">Thick</option>
            <option value="mohawk">Mohawk</option>
            <option value="womanLong">Long</option>
            <option value="womanShort">Short</option>
          </select>
        </label>
      </div>

      <div>
        <label className="block">
          Hat Color:
          <input type="color" name="hatColor" value={avatarProps.hatColor} onChange={handleChange} className="ml-2" />
        </label>
      </div>

      <div>
        <label className="block">
          Hat Style:
          <select name="hatStyle" value={avatarProps.hatStyle} onChange={handleChange} className="ml-2">
            <option value="none">None</option>
            <option value="beanie">Beanie</option>
            <option value="turban">Turban</option>
          </select>
        </label>
      </div>

      <div>
        <label className="block">
          Eye Style:
          <select name="eyeStyle" value={avatarProps.eyeStyle} onChange={handleChange} className="ml-2">
            <option value="circle">Circle</option>
            <option value="oval">Oval</option>
            <option value="smile">Smile</option>
          </select>
        </label>
      </div>

      <div>
        <label className="block">
          Eyebrow Style:
          <select name="eyeBrowStyle" value={avatarProps.eyeBrowStyle} onChange={handleChange} className="ml-2">
            <option value="up">Up</option>
            <option value="upWoman">Up W</option>
          </select>
        </label>
      </div>

      <div>
        <label className="block">
          Glasses Style:
          <select name="glassesStyle" value={avatarProps.glassesStyle} onChange={handleChange} className="ml-2">
            <option value="none">None</option>
            <option value="round">Round</option>
            <option value="square">Square</option>
          </select>
        </label>
      </div>

      <div>
        <label className="block">
          Nose Style:
          <select name="noseStyle" value={avatarProps.noseStyle} onChange={handleChange} className="ml-2">
            <option value="short">Short</option>
            <option value="long">Long</option>
            <option value="round">Round</option>
          </select>
        </label>
      </div>

      <div>
        <label className="block">
          Mouth Style:
          <select name="mouthStyle" value={avatarProps.mouthStyle} onChange={handleChange} className="ml-2">
            <option value="laugh">Laugh</option>
            <option value="smile">Smile</option>
            <option value="peace">Peace</option>
          </select>
        </label>
      </div>

      <div>
        <label className="block">
          Shirt Style:
          <select name="shirtStyle" value={avatarProps.shirtStyle} onChange={handleChange} className="ml-2">
            <option value="hoody">Hoody</option>
            <option value="short">Short</option>
            <option value="polo">Polo</option>
          </select>
        </label>
      </div>

      <div>
        <label className="block">
          Shirt Color:
          <input type="color" name="shirtColor" value={avatarProps.shirtColor} onChange={handleChange} className="ml-2" />
        </label>
      </div>

      <div>
        <label className="block">
          Background Color:
          <input type="color" name="bgColor" value={avatarProps.bgColor} onChange={handleChange} className="ml-2" />
        </label>
      </div>
      
    </div>
    
  );
});

export default AvatarCustomizer;









