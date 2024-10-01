import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const VideoDisplay = ({ videoId }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Received videoId:', videoId); 

    const fetchVideo = async () => {
      if (!videoId) {
        setError('No video ID provided.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching video from: http://localhost:5000/api/video/${videoId}`); 

        const response = await axios.get(`http://localhost:5000/api/video/${videoId}`);
        console.log('Response:', response.data); 

        if (response.data && response.data.video_path) {
          setVideoUrl(`http://localhost:5000${response.data.video_path}`);
        } else {
          setError('Video path not found in response.');
        }
      } catch (error) {
        console.error('Error fetching video metadata:', error);
        setError('Error fetching video. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      {loading && <p className="text-gray-500">Loading video...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {videoUrl && !loading && !error ? (
        <video controls className="max-w-full max-h-full rounded shadow-md">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        !loading && !error && <p className="text-gray-500">No video available</p>
      )}
    </div>
  );
};

VideoDisplay.propTypes = {
  videoId: PropTypes.string.isRequired,
};

export default VideoDisplay;
