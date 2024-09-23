const express = require('express');
const cors = require('cors');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Enable CORS for all requests
app.use(cors());

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname);
    },
  }),
});

// Allow multiple file uploads
app.post('/upload', upload.array('files'), (req, res) => {
  if (!req.files || req.files.length === 0) {
    console.error('File upload failed');
    return res.status(500).json({ error: 'Error uploading files.' });
  }

  const fileUrls = req.files.map(file => `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.key}`);
  
  res.send({ fileUrls });
});

// Add this route to handle the delete request
app.delete('/delete/:key', async (req, res) => {
  const { key } = req.params; // Get the key from the URL parameters

  try {
    const deleteParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
    };

    // Delete the object from S3
    await s3.send(new DeleteObjectCommand(deleteParams));

    res.status(200).send({ message: 'File deleted successfully.' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).send({ error: 'Error deleting file.' });
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



// const express = require('express');
// const cors = require('cors'); // Import cors
// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const { S3Client } = require('@aws-sdk/client-s3');
// const dotenv = require('dotenv');

// dotenv.config();

// const app = express();

// // Enable CORS for all requests
// app.use(cors());

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.BUCKET_NAME,
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: function (req, file, cb) {
//       cb(null, Date.now().toString() + '-' + file.originalname);
//     },
//   }),
// });

// app.post('/upload', upload.single('file'), (req, res) => {
//   if (!req.file) {
//     console.error('File upload failed');
//     return res.status(500).json({ error: 'Error uploading file.' });
//   }
  
//   res.send({
//     fileUrl: `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.file.key}`
//   });
// });


// const port = 5000;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
