import { useState } from 'react';
import axios from 'axios';

const VideoUploadForm = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      
      if (file.size > 50 * 1024 * 1024) { 
        setMessage('File is too large. Max size is 50 MB.');
        return;
      }
      setVideoFile(file);
      setMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      setMessage('Please select a video file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);

    try {
      const response = await axios.post('http://localhost:5000/api/upload-video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error uploading video:', error);
      setMessage('Error uploading video. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl mb-4">Upload a Video</h2>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="block w-full mb-4 p-2 border"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Upload Video
        </button>
        {message && <p className="mt-4 text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default VideoUploadForm;
