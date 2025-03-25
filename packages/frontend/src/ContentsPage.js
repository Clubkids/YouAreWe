import React from 'react';

const ContentsPage = () => {
  return (
    <div style={{
      backgroundColor: 'black',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1cm',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: '#833ccf', // Updated purple border
        width: '100%',
        height: '100%',
        padding: '0.5cm',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: '#B4A7A5', // Updated grey background
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          {/* Main Heading with CSElijah Font (defined as h1) */}
          <h1 style={{
            fontFamily: 'CSElijah, serif',
            fontSize: '3rem',
            marginBottom: '1rem'
          }}>
            You Are We
          </h1>

          {/* Navigation Links (defined as h2) with Sportage Demo Font */}
          <nav>
            {['Messageboard', 'Projects', 'Search', 'Gig Guide', 'Radio Station'].map((item, index) => (
              <div key={index} style={{ margin: '0.5rem' }}>
                <h2 style={{
                  fontFamily: 'Sportage Demo, sans-serif', // Apply Sportage Demo font
                  fontSize: '1.5rem',
                  fontWeight: 'normal', // Ensure font weight is normal
                  color: '#833ccf'
                }}>
                  <a href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} style={{
                    textDecoration: 'none',
                    color: '#833ccf',
                    fontSize: '1.5rem',
                  }}>
                    {item}
                  </a>
                </h2>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ContentsPage;
