import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VideoPlayer = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/videos');
        setVideos(response.data);
      } catch (error) {
        console.error('Error fetching video list:', error);
        setError('Error fetching video list. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  
  useEffect(() => {
    if (selectedVideoId) {
      const fetchVideo = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await axios.get(`http://localhost:5000/api/video/${selectedVideoId}`);
          if (response.data && response.data.video_path) {
            setVideoUrl(`http://localhost:5000${response.data.video_path}`);
          } else {
            setError('Video path not found in response.');
          }
        } catch (error) {
          console.error('Error fetching video:', error);
          setError('Error fetching video. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchVideo();
    } else {
      setVideoUrl('');
    }
  }, [selectedVideoId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Video Player</h1>
      
      {loading && <p className="text-gray-600 text-lg">Loading videos...</p>}
      {error && <p className="text-red-600 text-lg">{error}</p>}
      
      {!loading && !error && (
        <>
          <div className="mb-6">
            <label htmlFor="videoSelect" className="text-xl font-semibold text-gray-700">Select a video:</label>
            <select
              id="videoSelect"
              className="ml-2 p-2 border border-gray-300 rounded-lg shadow-sm"
              onChange={(e) => setSelectedVideoId(e.target.value)}
              value={selectedVideoId}
            >
              <option value="">-- Choose a video --</option>
              {videos.length > 0 ? (
                videos.map((video) => (
                  <option key={video.id} value={video.id}>
                    Video {video.id}
                  </option>
                ))
              ) : (
                <option value="">No videos available</option>
              )}
            </select>
          </div>
          
          {videoUrl && (
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-4">
              <video controls className="w-full h-auto rounded-lg">
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
