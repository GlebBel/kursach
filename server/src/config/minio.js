const Minio = require('minio')
const Folder = require('../Models/Folder')

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_END_POINT,
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
});

minioClient.makeBucket('folders', function (err) {
    if (err) return console.log('Error creating bucket.', err);
    console.log('Bucket created successfully.');
})


let poller = minioClient.listenBucketNotification('folders', '', '', ['s3:ObjectCreated:Put']);


poller.on('notification', record => {
    minioClient.presignedGetObject('folders', record.s3.object.key, function (err, presignedUrl) {
        try {
            if (err) throw err;
            Folder.findOne({ where: { name: record.s3.object.key } }).then(folder => {
                if (!folder) throw new Error('no file');
                folder.downloadURL = presignedUrl;
                folder.save().then(() => { console.log('done!') });
            })
        } catch (err) {
            console.log(err)
        }
    })

})
module.exports = minioClient;