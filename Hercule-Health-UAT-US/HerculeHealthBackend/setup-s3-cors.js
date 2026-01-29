// setup-s3-cors.js
require('dotenv').config(); // Load environment variables
const { S3Client, PutBucketCorsCommand, GetBucketCorsCommand } = require("@aws-sdk/client-s3");

// Initialize S3 client with your credentials
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// CORS configuration
const corsConfiguration = {
    CORSRules: [
        {
            AllowedHeaders: ["*"],
            AllowedMethods: ["GET", "HEAD", "PUT", "POST"],
            AllowedOrigins: [
                "http://localhost:3000", // Your local development
                "http://localhost:3001", // In case you use different port
                "https://hercule-health-uat.polussolutions.com", // Replace with your actual production domain
                // Add more domains as needed
            ],
            ExposeHeaders: [
                "ETag",
                "Content-Length",
                "Content-Type",
                "x-amz-request-id"
            ],
            MaxAgeSeconds: 3600 // 1 hour
        }
    ]
};

// Function to set up CORS
async function setupCORS() {
    try {
        console.log('Setting up CORS for bucket:', process.env.AWS_BUCKET_NAME);
        
        const command = new PutBucketCorsCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            CORSConfiguration: corsConfiguration
        });

        const result = await s3.send(command);
        console.log("✅ CORS configuration applied successfully!");
        console.log("Result:", result);
        
        // Verify the CORS configuration
        await verifyCORS();
        
    } catch (error) {
        console.error("❌ Error setting CORS:", error.message);
        
        // Common error explanations
        if (error.name === 'NoSuchBucket') {
            console.error("🔍 The bucket doesn't exist. Check your AWS_BUCKET_NAME in .env file");
        } else if (error.name === 'AccessDenied') {
            console.error("🔐 Access denied. Check your AWS credentials and bucket permissions");
        } else if (error.name === 'InvalidAccessKeyId') {
            console.error("🔑 Invalid AWS Access Key. Check your AWS_ACCESS_KEY_ID in .env file");
        }
    }
}

// Function to verify CORS configuration
async function verifyCORS() {
    try {
        console.log('\n🔍 Verifying CORS configuration...');
        
        const command = new GetBucketCorsCommand({
            Bucket: process.env.AWS_BUCKET_NAME
        });

        const result = await s3.send(command);
        console.log("✅ Current CORS configuration:");
        console.log(JSON.stringify(result.CORSRules, null, 2));
        
    } catch (error) {
        console.error("❌ Error verifying CORS:", error.message);
    }
}

// Function to check environment variables
function checkEnvironmentVariables() {
    const requiredVars = ['AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_BUCKET_NAME'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
        console.error("❌ Missing environment variables:");
        missingVars.forEach(varName => {
            console.error(`   - ${varName}`);
        });
        console.error("\nPlease check your .env file and ensure all required variables are set.");
        return false;
    }
    
    console.log("✅ All required environment variables are set:");
    console.log(`   - AWS_REGION: ${process.env.AWS_REGION}`);
    console.log(`   - AWS_BUCKET_NAME: ${process.env.AWS_BUCKET_NAME}`);
    console.log(`   - AWS_ACCESS_KEY_ID: ${process.env.AWS_ACCESS_KEY_ID.substring(0, 8)}...`);
    console.log(`   - AWS_SECRET_ACCESS_KEY: ${process.env.AWS_SECRET_ACCESS_KEY.substring(0, 8)}...`);
    
    return true;
}

// Main execution
async function main() {
    console.log("🚀 Starting S3 CORS setup...\n");
    
    // Check environment variables first
    if (!checkEnvironmentVariables()) {
        process.exit(1);
    }
    
    console.log("\n📋 CORS Configuration to be applied:");
    console.log(JSON.stringify(corsConfiguration, null, 2));
    
    // Set up CORS
    await setupCORS();
    
    console.log("\n🎉 CORS setup completed!");
    console.log("You can now view PDFs in your frontend application.");
}

// Run the script
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { setupCORS, verifyCORS };