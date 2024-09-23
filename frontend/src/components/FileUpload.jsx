import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [files, setFiles] = useState([]); // Array to hold uploaded files

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://16.170.245.26:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFileUrl(response.data.fileUrl);
      setFiles([...files, { url: response.data.fileUrl, key: response.data.key }]); // Add file details to the list
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleDelete = async (key) => {
    try {
      await axios.delete(`http://16.170.245.26:5000/delete/${key}`);
      setFiles(files.filter(file => file.key !== key)); // Remove the file from the list
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  return (
    <div>
      <h1>Upload File to S3</h1>
      <form onSubmit={handleFileUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {fileUrl && (
        <div>
          <h2>File uploaded successfully!</h2>
          <p>File URL: <a href={fileUrl} target="_blank" rel="noopener noreferrer">{fileUrl}</a></p>
        </div>
      )}
      <h2>Uploaded Files</h2>
      <ul>
        {files.map(file => (
          <li key={file.key}>
            <a href={file.url} target="_blank" rel="noopener noreferrer">{file.url}</a>
            <button onClick={() => handleDelete(file.key)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileUpload;
