// src/components/ThreadView.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import YouTube from 'react-youtube';

const ThreadView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [thread, setThread] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Fetching thread with id:", id);
    // Direct URL to fetch the thread by ID
    axios
      .get(`http://170.64.231.250:4000/api/threads/${id}?populate=*`)
      .then(response => {
        console.log("Thread API response:", response.data);
        if (response.data && response.data.data) {
          setThread(response.data.data);
        } else {
          setError("Thread data not found.");
        }
      })
      .catch(err => {
        console.error("Error fetching thread:", err);
        setError("Error fetching thread.");
      });
  }, [id]);

  if (error) {
    return (
      <div style={{
        backgroundColor: 'black',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        {error}
      </div>
    );
  }

  if (!thread) {
    return (
      <div style={{
        backgroundColor: 'black',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        Loading...
      </div>
    );
  }

  // Extract thread data
  const threadTitle = thread?.attributes?.title || 'Untitled Thread';
  const threadContent = thread?.attributes?.content || [];
  const youtubeUrl = thread?.attributes?.youtube_url;
  
  // Process posts data
  const posts = [];
  if (thread?.attributes?.posts?.data && Array.isArray(thread.attributes.posts.data)) {
    thread.attributes.posts.data.forEach(post => {
      posts.push({
        id: post.id,
        content: post.attributes?.content || []
      });
    });
  }

  // Helper to extract a YouTube video ID from a URL
  function extractVideoId(url) {
    if (!url) return null;
    const regExp = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  }
  const videoId = extractVideoId(youtubeUrl);

  return (
    <div style={{
      backgroundColor: 'black',
      width: '100vw',
      minHeight: '100vh',
      padding: '1cm',
      boxSizing: 'border-box',
      color: 'white'
    }}>
      <button
        onClick={() => navigate('/messageboard')}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '1.8rem',
          cursor: 'pointer',
          textDecoration: 'none',
          outline: 'none',
          marginBottom: '1rem'
        }}
      >
        Back
      </button>
      <div style={{
        backgroundColor: '#833ccf',
        padding: '0.5cm',
        borderRadius: '5px'
      }}>
        <h1 style={{
          fontFamily: 'CSElijah, serif',
          fontSize: '3rem',
          marginBottom: '1rem'
        }}>
          {threadTitle}
        </h1>

        {/* Render thread content */}
        <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
          {Array.isArray(threadContent) && threadContent.length > 0
            ? threadContent.map((block, idx) => (
                <p key={idx} style={{ marginBottom: '0.5cm' }}>
                  {block.children && block.children[0]?.text ? block.children[0].text : null}
                </p>
              ))
            : <p>No content available</p>}
        </div>

        {/* Render YouTube video if available */}
        {videoId && (
          <div style={{ marginBottom: '1rem' }}>
            <YouTube videoId={videoId} opts={{ width: '100%', height: '390' }} />
          </div>
        )}

        <h2 style={{ marginBottom: '0.5cm' }}>Posts</h2>

        {posts.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {posts.map(post => (
              <li
                key={post.id}
                style={{
                  margin: '0.5cm 0',
                  padding: '0.5cm',
                  backgroundColor: '#B4A7A5',
                  borderRadius: '5px'
                }}
              >
                {Array.isArray(post.content) && post.content.length > 0 ? (
                  post.content.map((block, bidx) => (
                    <p key={bidx} style={{ fontSize: '1.2rem', marginBottom: '0.5cm' }}>
                      {block.children && block.children[0]?.text ? block.children[0].text : null}
                    </p>
                  ))
                ) : (
                  <p>No content</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default ThreadView;