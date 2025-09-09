const fs = require("fs");
const crypto = require("crypto")
const {
  S3Client,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage"); // Add this import
const {
  TextractClient,
  StartDocumentAnalysisCommand,
  GetDocumentAnalysisCommand,
} = require("@aws-sdk/client-textract");
const { parseResults } = require("../config/parseResults");
const LabResult = require("../models/labResultModel"); 

const ENCRYPTION_KEY = process.env.LABRESULT_ENCRYPTION_KEY || "your-32-byte-key-1234567890123456";
const IV_LENGTH = 16;

function encrypt(text) {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(JSON.stringify(text));
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
  
const textract = new TextractClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

const processFile = async (req, res) => {
  let filePath;

  try {
    if (!req.file) throw new Error("No file uploaded.");

    filePath = req.file.path;
    
    // Generate unique file key with timestamp and patient ID
    const patientId = req.params.id;
    const timestamp = Date.now();
    const fileExtension = req.file.originalname.split('.').pop();
    const fileKey = `uploads/${patientId}/${timestamp}_${req.file.originalname}`;

    // Read file as buffer (fixes the stream warning)
    const fileBuffer = fs.readFileSync(filePath);
    
    // Upload using the Upload class for better handling
    const upload = new Upload({
      client: s3,
      params: {
        Bucket: BUCKET_NAME,
        Key: fileKey,
        Body: fileBuffer, // Use buffer instead of stream
        ContentType: req.file.mimetype,
        ContentLength: req.file.size, // Explicitly set content length
      },
    });

    // Upload the file to S3
    const uploadResult = await upload.done();
    console.log("Upload completed:", uploadResult.Location);

    // Generate S3 URL for the uploaded file
    const s3FileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    // Start Textract job
    const startCommand = new StartDocumentAnalysisCommand({
      DocumentLocation: { S3Object: { Bucket: BUCKET_NAME, Name: fileKey } },
      FeatureTypes: ["TABLES", "FORMS"],
    });
    const { JobId } = await textract.send(startCommand);

    if (!JobId) throw new Error("Failed to initiate Textract job.");

    // Poll for results
    const pollTextractResults = async () => {
      for (let attempt = 0; attempt < 10; attempt++) {
        const getCommand = new GetDocumentAnalysisCommand({ JobId });
        const result = await textract.send(getCommand);

        if (result.JobStatus === "SUCCEEDED") {
          return result.Blocks || [];
        } else if (result.JobStatus === "FAILED") {
          throw new Error("Textract job failed.");
        }

        await wait(5000);
      }
      throw new Error("Textract job timed out.");
    };

    const analysisResult = await pollTextractResults();

    // Extract text content
    const extractedText = analysisResult
      .filter((block) => block.BlockType === "LINE" && block.Text)
      .map((block) => block.Text);

    const parsedResults = await parseResults(extractedText);

    // Save results to the database with all required fields
    if (!patientId) {
      throw new Error("Patient ID is required.");
    }

    const latestLabResult = await LabResult.findOne().sort({ labResultId: -1 });
    const newLabResultId = latestLabResult ? latestLabResult.labResultId + 1 : 1;

    const labResult = new LabResult({
      labResultId: newLabResultId,
      patientId,
      resultData: encrypt(parsedResults), // Encrypted extracted data
      fileUrl: s3FileUrl, // S3 URL for PDF access
      s3Key: fileKey, // S3 key for file management
      fileType: req.file.mimetype, // MIME type
      fileSize: req.file.size, // File size in bytes
      originalFileName: req.file.originalname, // Original filename
      notificationStatus: "notified",
      createdAt: new Date().toISOString()
    });

    await labResult.save();

    res.json({ 
      success: true, 
      text: parsedResults,
      fileUrl: s3FileUrl,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      labResultId: newLabResultId,
      message: "File uploaded and processed successfully"
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(400).json({ success: false, error: error.message });
  } finally {
    // Clean up local file
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

module.exports = { processFile };