// src/components/MessageboardPage.js
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import YouTube from 'react-youtube';

const MessageboardPage = () => {
  const [threads, setThreads] = useState([]);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const threadsPerPage = 6; // 6 threads per page
  const navigate = useNavigate();
  
  // Refs for DOM manipulation
  const contentAreaRef = useRef(null);
  const youtubeContainerRef = useRef(null);

  // Fetch video URL and threads on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch threads
        const threadsResponse = await axios.get('http://170.64.231.250:4000/api/threads?populate=*');
        if (threadsResponse.data && threadsResponse.data.data) {
          setThreads(threadsResponse.data.data);
        }

        // Fetch current video state
        const videoResponse = await axios.get('http://170.64.231.250:4000/api/youtube-states?sort=createdAt:desc&pagination[limit]=1');
        if (videoResponse.data?.data?.[0]?.attributes) {
          const videoState = videoResponse.data.data[0].attributes;
          setCurrentVideoUrl(videoState.url || '');
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        // Use mock data if API is unavailable
        setThreads([
          { id: 1, attributes: { title: "First Thread", content: "This is a sample thread" } },
          { id: 2, attributes: { title: "Second Thread", content: "Another sample discussion" } },
          { id: 3, attributes: { title: "Third Thread", content: "More sample content here" } },
          { id: 4, attributes: { title: "Fourth Thread", content: "Discussion about something" } },
          { id: 5, attributes: { title: "Fifth Thread", content: "Another interesting topic" } },
          { id: 6, attributes: { title: "Sixth Thread", content: "The last sample thread" } }
        ]);
      }
    };

    fetchInitialData();
  }, []);

  // Removed dynamic YouTube width calculation since we're now using static 30% width

  // Update YouTube URL in backend
  const updateVideoUrl = (url) => {
    // Just update the local state without any validation
    setCurrentVideoUrl(url);
    
    // Only send to backend if it's a valid YouTube URL
    if (url && (url.includes('youtube.com') || url.includes('youtu.be'))) {
      axios.post('http://170.64.231.250:4000/api/youtube-states', {
        data: { url }
      }).catch(error => {
        console.error('Error updating video URL:', error);
      });
    }
  };

  const extractVideoId = (url) => {
    if (!url) return null;
    
    // Log the URL to debug
    console.log("Extracting video ID from URL:", url);
    
    // Handle both youtube.com and youtu.be URLs
    let regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    let match = url.match(regExp);
    
    // Log the match result
    console.log("Match result:", match);
    
    if (match && match[1]) {
      console.log("Extracted video ID:", match[1]);
      return match[1];
    }
    
    // Try a simpler regex as fallback for youtu.be links
    if (url.includes('youtu.be/')) {
      const simplePath = url.split('youtu.be/')[1];
      if (simplePath && simplePath.length >= 11) {
        const simpleId = simplePath.substring(0, 11);
        console.log("Extracted video ID (simple method):", simpleId);
        return simpleId;
      }
    }
    
    // Try a simpler regex as fallback for youtube.com links
    if (url.includes('v=')) {
      const parts = url.split('v=')[1];
      if (parts) {
        const videoId = parts.split('&')[0];
        if (videoId && videoId.length === 11) {
          console.log("Extracted video ID (simple method):", videoId);
          return videoId;
        }
      }
    }
    
    console.log("Could not extract video ID");
    return null;
  };

  const totalPages = Math.ceil(threads.length / threadsPerPage);
  const currentThreads = threads.slice((currentPage - 1) * threadsPerPage, currentPage * threadsPerPage);

  return (
    <div style={{
      backgroundColor: 'black',
      minHeight: '100vh',
      width: '100%',
      padding: '1cm',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: '#833ccf',
        width: '100%',
        minHeight: 'calc(100vh - 2cm)',
        padding: '0.5cm',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden' /* Add this to ensure proper containment */
      }}>
        {/* Home button */}
        <div style={{ 
          position: 'absolute', 
          top: '0.5cm', 
          left: '0.5cm',
          zIndex: 100
        }}>
          <button
            onClick={() => navigate('/contents')}
            style={{
              fontFamily: 'CSElijah, serif',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'black',
              fontSize: '1.8rem',
              cursor: 'pointer',
              textDecoration: 'none',
              outline: 'none',
              padding: '5px',
              margin: '5px'
            }}
          >
            Home
          </button>
        </div>

        <div 
          ref={contentAreaRef}
          style={{
            backgroundColor: '#B4A7A5',
            width: '100%',
            minHeight: 'calc(100vh - 3cm)',
            padding: '1cm 10px', /* Changed from 1cm all around to 1cm top/bottom and 10px left/right */
            boxSizing: 'border-box',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <h1 style={{
            fontFamily: 'CSElijah, serif',
            fontSize: '3rem',
            textAlign: 'center',
            margin: '0.75cm 0 1cm',
            paddingTop: '0.5cm'
          }}>
            Messageboard
          </h1>

          {/* Main content wrapper */}
          <div style={{ 
            position: 'relative',
            width: '100%',
            boxSizing: 'border-box',
            minHeight: '600px' /* Ensure minimum height for layout */
          }}>
            {/* Threads Section */}
            <div style={{ 
              width: '70%', /* Width of 70% */
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              boxSizing: 'border-box'
            }}>
              {/* Page Counter */}
              <div style={{
                fontFamily: 'SaxMono, monospace', /* Changed to Sax Mono for consistency */
                marginBottom: '10px',
                marginTop: '0',
                color: 'black',
                fontSize: '0.9rem',
                letterSpacing: '0.5px',
                paddingLeft: '2px' /* Added 2px padding to the left */
              }}>
                Page {currentPage} of {totalPages}
              </div>

              {/* Threads List */}
              <div id="threads-container" style={{
                border: '1px solid #833ccf',
                borderBottom: 'none',
                marginTop: '0' /* No top margin for alignment */
              }}>
                {currentThreads.length > 0 ? (
                  currentThreads.map((thread) => (
                    <div key={thread.id} style={{
                      display: 'flex',
                      padding: '10px', // Exactly 10px padding all around
                      backgroundColor: '#B4A7A5',
                      borderBottom: '1px solid #833ccf',
                      height: '90px', // 70px profile + 20px total padding (10px top + 10px bottom)
                      boxSizing: 'border-box'
                    }}>
                      {/* Profile Picture Box */}
                      <div style={{
                        width: '70px', // 70px × 70px as requested
                        height: '70px',
                        backgroundColor: '#833ccf',
                        marginRight: '10px',
                        flexShrink: 0
                      }}></div>
                      
                      {/* Thread Content */}
                      <div style={{ 
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '70px', // Same height as profile picture
                        position: 'relative' // For precise positioning of text elements
                      }}>
                        {/* Thread Title - 5px below the top of profile picture */}
                        <Link to={`/thread/${thread.id}`} style={{
                          textDecoration: 'none',
                          color: 'black',
                          fontSize: '1.3rem',
                          fontFamily: 'EskapadeFraktur, serif', /* Changed to Eskapade Fraktur font */
                          fontWeight: 'normal', /* Fraktur font looks better with normal weight */
                          display: 'block',
                          margin: '5px 0 0 0', // 5px top margin, no margin elsewhere
                          padding: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          lineHeight: '1.3rem',
                          position: 'absolute',
                          top: '0',
                          textTransform: 'lowercase' /* Force lowercase */
                        }}>
                          {thread.attributes?.title || "Untitled Thread"}
                        </Link>
                        
                        {/* Thread Preview - 10px below the bottom of thread title */}
                        <p style={{ 
                          color: 'black',
                          fontFamily: 'SaxMono, monospace', /* Changed to Sax Mono font */
                          fontSize: '0.9rem', /* Slightly smaller for monospace */
                          margin: 0,
                          padding: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          lineHeight: '1rem',
                          position: 'absolute',
                          top: 'calc(5px + 1.3rem + 10px)', // 5px initial top margin + title height + 10px gap
                          textTransform: 'lowercase', /* Force lowercase */
                          letterSpacing: '0.5px' /* Better spacing for monospace */
                        }}>
                          {thread.attributes?.content || "No preview available"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{
                    padding: '10px',
                    borderBottom: '1px solid #833ccf'
                  }}>
                    <p style={{ 
                      color: 'black',
                      fontFamily: 'SaxMono, monospace', /* Changed to Sax Mono font */
                      fontSize: '0.9rem',
                      letterSpacing: '0.5px',
                      textTransform: 'lowercase' /* Force lowercase */
                    }}>No threads found.</p>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: '0.5cm',
                position: 'relative',
                marginTop: '5px', /* Only 5px space below thread panel */
                marginLeft: '2px', /* 2px to the right */
                marginBottom: '0', /* No bottom margin */
                paddingBottom: '5px'
              }}>
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    style={{
                      padding: '0.2cm 0.3cm',
                      backgroundColor: 'transparent',
                      color: '#333',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'SaxMono, monospace',
                      fontSize: '0.9rem',
                      letterSpacing: '0.5px',
                      textTransform: 'lowercase'
                    }}
                  >
                    Previous
                  </button>
                )}
                
                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    style={{
                      padding: '0.2cm 0.3cm',
                      backgroundColor: 'transparent',
                      color: '#333',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'SaxMono, monospace',
                      fontSize: '0.9rem',
                      letterSpacing: '0.5px',
                      textTransform: 'lowercase'
                    }}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>

            {/* YouTube Section - Fixed width with specific margins */}
            <div 
              ref={youtubeContainerRef}
              style={{ 
                width: 'calc(30% - 20px)', /* Width with margins */
                boxSizing: 'border-box',
                position: 'absolute',
                left: 'calc(70% + 10px)', /* 70% (width of thread panel) + 10px margin */
                right: '10px', /* 10px from right edge */
                top: '34px', /* Align exactly with top of threads container */
                bottom: '0', /* Stretch to bottom */
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ 
                  border: '1px solid #666',
                  width: '100%',
                  marginBottom: '5px', /* Changed from 10px to 5px - space between URL input and video */
                  boxSizing: 'border-box',
                  backgroundColor: 'white', /* Add background color for visibility */
                  flexShrink: 0 /* Prevent container from shrinking */
                }}>
                <input
                  type="text"
                  value={currentVideoUrl}
                  onChange={(e) => updateVideoUrl(e.target.value)}
                  placeholder="Enter YouTube URL"
                  style={{
                    width: '100%',
                    padding: '0.5cm 10px', /* 0.5cm top/bottom with 10px left/right */
                    boxSizing: 'border-box',
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'white'
                  }}
                />
              </div>
              <div style={{ 
                backgroundColor: '#808080',
                width: '100%',
                boxSizing: 'border-box',
                padding: 0,
                flexShrink: 0 /* Prevent container from shrinking */
              }}>
                {extractVideoId(currentVideoUrl) && (
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '210px', /* Added 10px to account for borders */
                    border: '5px solid #808080',
                    boxSizing: 'border-box',
                    overflow: 'hidden' /* Ensures iframe doesn't overflow */
                  }}>
                    <YouTube
                      videoId={extractVideoId(currentVideoUrl)}
                      opts={{
                        width: '100%',
                        height: '200px',
                        playerVars: {
                          modestbranding: 1,
                          controls: 1,
                          showinfo: 0,
                          fs: 0,
                          iv_load_policy: 3,
                          rel: 0
                        }
                      }}
                      style={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none' /* Remove default iframe border */
                      }}
                    />
                  </div>
                )}
              </div>
              
              {/* Spacer to push image to bottom */}
              <div style={{ flex: 1 }}></div>
              
              {/* Image below YouTube video */}
              <div style={{
                marginTop: '10px', /* 10px below YouTube video */
                width: '100%',
                boxSizing: 'border-box',
                overflow: 'hidden',
                height: '180px', /* Fixed reasonable height */
                marginBottom: '0' /* Align with bottom of threads panel */
              }}>
                <img 
                  src="/images/Image_487.webp" 
                  alt="Random image" 
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    objectFit: 'cover',
                    border: '5px solid #808080',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageboardPage;