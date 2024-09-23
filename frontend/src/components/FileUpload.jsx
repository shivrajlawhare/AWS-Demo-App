import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [fileUrls, setFileUrls] = useState([]);
  const [uploadProgress, setUploadProgress] = useState([]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post('http://16.170.245.26:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percent = Math.round((loaded * 100) / total);
          setUploadProgress(percent);
        },
      });

      setFileUrls(response.data.fileUrls);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const handleDelete = async (fileKey) => {
    // Call the delete API to delete the file
    try {
      await axios.delete(`http://16.170.245.26:5000/delete/${fileKey}`);
      // Optionally, remove the deleted file URL from the fileUrls state
      setFileUrls(prev => prev.filter(url => !url.includes(fileKey)));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  return (
    <div>
      <h1>Upload Files to S3</h1>
      <form onSubmit={handleFileUpload}>
        <input type="file" multiple onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {uploadProgress > 0 && <div>Upload Progress: {uploadProgress}%</div>}
      {fileUrls.length > 0 && (
        <div>
          <h2>Uploaded Files:</h2>
          <ul>
            {fileUrls.map((url, index) => (
              <li key={index}>
                <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                <button onClick={() => handleDelete(url.split('/').pop())}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
