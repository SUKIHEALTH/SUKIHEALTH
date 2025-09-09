const { decryptBuffer } = require("../config/s3Service")
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

// Function to fetch file data from S3
const fetchFileDataFromS3 = async (fileUrl) => {
  // Extract the S3 key from the fileUrl
  const s3Key = fileUrl.split('.com/')[1]; // Extracts everything after '.com/'

  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME, // Replace with your bucket name
    Key: s3Key, // The extracted S3 object key
  };

  try {
    const data = await s3.getObject(s3Params).promise();
    return data.Body; // Return the raw data from S3 (binary)
  } catch (err) {
    console.error('Error fetching data from S3:', err);
    throw new Error('Error fetching file data');
  }
};

// Function to handle file conversion based on message type
const convertFileData = (data, messageType) => {
  let base64Data = data.toString('base64'); // Convert binary data to base64 string

  // Remove MIME type prefix and return just the base64 string
  return base64Data;
};

module.exports = {
  fetchFileData: async (req, res) => {
    const { fileUrl, messageType } = req.body;
    console.log("messageType::", messageType);

    try {
      // Fetch encrypted file data from S3
      const encryptedFileData = await fetchFileDataFromS3(fileUrl);
      // Decrypt the file buffer using the shared function
      const decryptedFileData = decryptBuffer(encryptedFileData);

      // Convert the decrypted file data based on the messageType
      const convertedData = convertFileData(decryptedFileData, messageType);

      res.json({ data: convertedData, messageType: messageType });
    } catch (error) {
      console.error('Error in fetchFileData:', error);
      res.status(500).json({ error: error.message });
    }
  }
};
