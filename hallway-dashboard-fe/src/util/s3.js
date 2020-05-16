const S3 = require('aws-sdk/clients/s3');

export const getObject = (key) => {
    const s3 = new S3({
        accessKeyId: process.env.REACT_APP_S3_READ_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_S3_READ_ACCESS_KEY_SECRET,
        region: process.env.REACT_APP_AWS_REGION
    });
    return s3.getObject({
        Bucket: process.env.REACT_APP_STORAGE_BUCKET,
        Key: key
    }).promise();
}