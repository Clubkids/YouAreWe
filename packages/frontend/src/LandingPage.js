import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [imageIndex, setImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [displayGif, setDisplayGif] = useState(false);
  const [showOk, setShowOk] = useState(false);

  // Load manifest.json and select random images (excluding 'gif1.gif')
  useEffect(() => {
    fetch('/images/manifest.json')
      .then(response => response.json())
      .then(data => {
        const allImages = data.filter(filename => filename !== 'gif1.gif');
        const numToSelect = Math.min(30, allImages.length);
        const selected = [];
        while (selected.length < numToSelect) {
          const randomIndex = Math.floor(Math.random() * allImages.length);
          const randomImage = allImages[randomIndex];
          if (!selected.includes(randomImage)) {
            selected.push(randomImage);
          }
        }
        const fullPaths = selected.map(file => `/images/${file}`);
        setImages(fullPaths);
      })
      .catch(err => console.error('Error loading image manifest:', err));
  }, []);

  // Preload selected images
  useEffect(() => {
    if (images.length) {
      images.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    }
  }, [images]);

  // Flash each image for half the time (150ms); then show the GIF for 3700ms and finally display the OK text
  useEffect(() => {
    if (images.length) {
      let count = 0;
      const interval = setInterval(() => {
        setImageIndex(count);
        count++;
        if (count >= images.length) {
          clearInterval(interval);
          setDisplayGif(true);
          setTimeout(() => {
            setDisplayGif(false);
            setShowOk(true);
          }, 3700);
        }
      }, 150);
      return () => clearInterval(interval);
    }
  }, [images]);

  // Handle OK Click (Navigate to Contents Page)
  const handleOkClick = () => {
    navigate('/contents');
  };

  return (
    <div
      className="landing-page"
      style={{
        backgroundColor: 'black',
        height: '100vh',
        position: 'relative',
        color: 'white',
        fontFamily: 'initial' // This resets the font to the default, overriding global fonts.
      }}
    >
      {/* Flashing images */}
      {!displayGif && !showOk && images.length > 0 && (
        <img
          src={images[imageIndex]}
          alt="flashing"
          loading="eager"
          style={{
            maxWidth: '90%',
            maxHeight: '90%',
            objectFit: 'contain',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      )}

      {/* GIF display */}
      {displayGif && (
        <img
          src={`/images/gif1.gif?timestamp=${new Date().getTime()}`}
          alt="gif"
          loading="eager"
          style={{
            maxWidth: '125%', // Enlarged 25%
            maxHeight: '125%',
            objectFit: 'contain',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      )}

      {/* Clickable OK Text */}
      {showOk && (
        <span
          onClick={handleOkClick}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '2.25rem',
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'color 0.2s ease-in-out'
          }}
          onMouseOver={(e) => e.target.style.color = 'lightgray'}
          onMouseOut={(e) => e.target.style.color = 'white'}
        >
          OK
        </span>
      )}
    </div>
  );
};

export default LandingPage;
