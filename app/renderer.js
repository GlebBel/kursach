// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var file_system = require('fs');
var archiver = require('archiver');

var archive = archiver('zip');

// output.on('close', function () {
//     console.log(archive.pointer() + ' total bytes');
//     console.log('archiver has been finalized and the output file descriptor has closed.');
// });

// archive.on('error', function(err){
//     throw err;
// });
// console.log(archive)
// archive.pipe(output);
// archive.directory('./folder')
// archive.finalize();

    $('#downloadButton').click(function () {
      console.log($('#selector')[0].files[0].path)
      var output = file_system.createWriteStream($('#selector')[0].path);
        // Retrieve a URL from our server.
        retrieveNewURL(file, url => {
          // Upload the file to the server.
          uploadFile(file, url)
        })
    })

    //`retrieveNewURL` accepts the name of the current file and invokes the `/presignedUrl` endpoint to
    // generate a pre-signed URL for use in uploading that file: 
    function retrieveNewURL(file, cb) {
      $.post('http://localhost:3000/file', { orderID: 123456, metadata: JSON.stringify({ filename: 'gleb.mp4' }) }, (data) => {
        console.log(data.data.uploadURL)
        cb(data.data.uploadURL)
      })

    }

    // ``uploadFile` accepts the current filename and the pre-signed URL. It then invokes `XMLHttpRequest()`
    // to upload this file to S3 at `play.minio.io:9000` using the URL:
    function uploadFile(file, url) {
      var xhr = new XMLHttpRequest()
      xhr.open('PUT', url, true)
      xhr.send(file)
      xhr.onload = () => {
        if (xhr.status == 200) {
          $('#status').text(`Uploaded ${file.name}.`)
        }
      }
    }