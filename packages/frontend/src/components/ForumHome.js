// src/components/ForumHome.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForumHome = () => {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    axios.get('http://170.64.231.250:4000/api/threads')
      .then(response => setThreads(response.data.data))
      .catch(err => console.error('Error fetching threads:', err));
  }, []);

  return (
    <div>
      <h1>Forum Threads</h1>
      <Link to="/new-thread">Create New Thread</Link>
      <ul>
        {threads.map(thread => (
          <li key={thread.id}>
            <Link to={`/thread/${thread.id}`}>{thread.attributes.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ForumHome;
