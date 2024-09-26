import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from "uuid";


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
    formData.append("files", file);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const fullFileName = response.data.fileUrls[0].split('/').pop(); // Extract file name from URL
      const newFile = {
        url: response.data.fileUrls[0],
        key: uuidv4(),
        name: fullFileName,
      };
      setFiles([...files, newFile]);
      setFileUrl(newFile.url);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleDelete = async (name) => {
    try {
      await axios.delete("http://localhost:5000/delete", {
        data: { name },
      });
      setFiles(files.filter((file) => file.name !== name));
    } catch (error) {
      console.error("Error deleting file:", error);
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
            <button onClick={() => handleDelete(file.name)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileUpload;