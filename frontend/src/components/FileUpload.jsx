import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from "uuid";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [files, setFiles] = useState([]); // Array to hold uploaded files
  const [images, setImages] = useState([]); // Array to hold uploaded files

  useEffect(() => {
    fetchImages();
  }, [files,images]);

  const fetchImages = async () => {
    try {
      const response = await axios.get('http://13.60.42.69:5000/images');
      if (response.data) {
        setImages(response.data);
      } else {
        console.error('No images found');
        setImages([]); // Set images to an empty array if no data is returned
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      setImages([]); // Set images to an empty array if an error occurs
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await axios.post("http://13.60.42.69:5000/upload", formData, {
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
      await axios.delete("http://13.60.42.69:5000/delete", {
        data: { name },
      });
      setFiles(files.filter((file) => file.name !== name));
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  return (
    <div className='flex justify-center items-center flex-col  text-slate-200'>
      <h1 className='font-bold size-14 w-auto mt-12 mb-10 text-3xl m-auto py-4'>Upload File to S3</h1>
      <form onSubmit={handleFileUpload} className='flex justify-center items-center flex-col gap-y-2'>
        <input type="file" className='border border-black' onChange={handleFileChange} />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-5 py-2 px-4 rounded">Upload</button>
      </form>
      {fileUrl && (
        <div className='my-5'>
          <h2>File uploaded successfully!</h2>
          <p>File URL: <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">{fileUrl}</a></p>
        </div>
      )}
      <h2 className='my-5 text-xl font-bold'>Files from S3 Bucket</h2>
      <div className="grid grid-cols-3 gap-4">
        {Array.isArray(images) && images.map(image => (
          <div key={image.key} className="flex flex-col items-center p-4 border border-gray-200 rounded">
            <img src={image.url} alt={image.key} className="w-full h-48 object-cover rounded-t" />
            <button onClick={() => handleDelete(image.key)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;