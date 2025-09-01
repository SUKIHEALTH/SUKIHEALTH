// setup-s3-permissions.js
require('dotenv').config();
const { 
    S3Client, 
    PutBucketCorsCommand, 
    GetBucketCorsCommand,
    PutBucketPolicyCommand,
    GetBucketPolicyCommand,
    PutPublicAccessBlockCommand,
    GetPublicAccessBlockCommand
} = require("@aws-sdk/client-s3");

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

// 1. CORS Configuration
const corsConfiguration = {
    CORSRules: [
        {
            AllowedHeaders: ["*"],
            AllowedMethods: ["GET", "HEAD"],
            AllowedOrigins: [
                "http://localhost:3000",
                "http://localhost:3001",
                "https://hercule-health-uat.polussolutions.com", // Replace with your actual domain
                "*" // Allow all origins (remove in production for security)
            ],
            ExposeHeaders: [
                "ETag",
                "Content-Length",
                "Content-Type"
            ],
            MaxAgeSeconds: 3600
        }
    ]
};

// 2. Bucket Policy for Public Read Access
const bucketPolicy = {
    Version: "2012-10-17",
    Statement: [
        {
            Sid: "PublicReadGetObject",
            Effect: "Allow",
            Principal: "*",
            Action: "s3:GetObject",
            Resource: `arn:aws:s3:::${BUCKET_NAME}/*`
        }
    ]
};

// 3. Public Access Block Configuration (allow public reads)
const publicAccessBlock = {
    BlockPublicAcls: false,
    IgnorePublicAcls: false,
    BlockPublicPolicy: false,
    RestrictPublicBuckets: false
};

async function setupBucketPermissions() {
    try {
        console.log('🚀 Setting up S3 bucket permissions...\n');

        // Step 1: Configure Public Access Block
        console.log('1️⃣ Configuring Public Access Block...');
        await s3.send(new PutPublicAccessBlockCommand({
            Bucket: BUCKET_NAME,
            PublicAccessBlockConfiguration: publicAccessBlock
        }));
        console.log('✅ Public Access Block configured');

        // Step 2: Set Bucket Policy
        console.log('\n2️⃣ Setting Bucket Policy...');
        await s3.send(new PutBucketPolicyCommand({
            Bucket: BUCKET_NAME,
            Policy: JSON.stringify(bucketPolicy)
        }));
        console.log('✅ Bucket Policy applied');

        // Step 3: Set CORS
        console.log('\n3️⃣ Setting CORS Configuration...');
        await s3.send(new PutBucketCorsCommand({
            Bucket: BUCKET_NAME,
            CORSConfiguration: corsConfiguration
        }));
        console.log('✅ CORS configuration applied');

        // Step 4: Verify configurations
        await verifyConfigurations();

        console.log('\n🎉 All configurations applied successfully!');
        console.log('Your PDFs should now be accessible from the frontend.');

    } catch (error) {
        console.error('❌ Error setting up bucket permissions:', error.message);
        
        if (error.name === 'NoSuchBucket') {
            console.error('🔍 Bucket does not exist. Please check your bucket name.');
        } else if (error.name === 'AccessDenied') {
            console.error('🔐 Access denied. Your AWS user needs the following permissions:');
            console.error('   - s3:PutBucketPolicy');
            console.error('   - s3:PutBucketCors');
            console.error('   - s3:PutBucketPublicAccessBlock');
            console.error('   - s3:GetBucketPolicy');
            console.error('   - s3:GetBucketCors');
        }
    }
}

async function verifyConfigurations() {
    try {
        console.log('\n🔍 Verifying configurations...');

        // Check Public Access Block
        const publicAccess = await s3.send(new GetPublicAccessBlockCommand({
            Bucket: BUCKET_NAME
        }));
        console.log('📋 Public Access Block:', publicAccess.PublicAccessBlockConfiguration);

        // Check Bucket Policy
        try {
            const policy = await s3.send(new GetBucketPolicyCommand({
                Bucket: BUCKET_NAME
            }));
            console.log('📋 Bucket Policy applied successfully');
        } catch (error) {
            if (error.name === 'NoSuchBucketPolicy') {
                console.log('⚠️  No bucket policy found');
            } else {
                throw error;
            }
        }

        // Check CORS
        try {
            const cors = await s3.send(new GetBucketCorsCommand({
                Bucket: BUCKET_NAME
            }));
            console.log('📋 CORS Rules:', cors.CORSRules.length, 'rule(s) configured');
        } catch (error) {
            if (error.name === 'NoSuchCORSConfiguration') {
                console.log('⚠️  No CORS configuration found');
            } else {
                throw error;
            }
        }

    } catch (error) {
        console.error('❌ Error verifying configurations:', error.message);
    }
}

// Function to test a specific file URL
async function testFileAccess(fileKey = 'test-file.pdf') {
    const testUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    console.log(`\n🧪 Test URL: ${testUrl}`);
    console.log('Try accessing this URL in your browser to test permissions.');
}

async function main() {
    console.log(`Setting up permissions for bucket: ${BUCKET_NAME}`);
    console.log(`Region: ${process.env.AWS_REGION}\n`);

    await setupBucketPermissions();
    await testFileAccess();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { setupBucketPermissions, verifyConfigurations };