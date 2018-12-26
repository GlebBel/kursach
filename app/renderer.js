// This file is required by the index.html file and will
// be executed in the renderer process for that window.
var http = require('http');
var fs = require('fs');
const unzipper = require('unzipper')
var archiver = require('archiver');
const axios = require('axios');
const { shell } = require('electron')
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
getFileList()
$('#downloadButton').click(() => updateFolder($('#selector')[0].files[0].path, $('#selector')[0].files[0].name))

$('#updateList').click(() => {
  getFileList()
})

//`retrieveNewURL` accepts the name of the current file and invokes the `/presignedUrl` endpoint to
// generate a pre-signed URL for use in uploading that file: 
function retrieveNewURL(file, cb) {
  $.post('http://104.248.16.212:3000/folder', { name: file.name }, (data) => {
    console.log(data.data)
    cb(data.data.uploadURL, data.data.version)
  })

}

// ``uploadFile` accepts the current filename and the pre-signed URL. It then invokes `XMLHttpRequest()`
// to upload this file to S3 at `play.minio.io:9000` using the URL:
function uploadFile(file, url, path, version) {
  var xhr = new XMLHttpRequest()
  xhr.open('PUT', url, true)
  xhr.send(file)
  xhr.onload = () => {
    if (xhr.status == 200) {
      $('#status').text(`Uploaded ${file.name}.`)
      localFolder = {
        version: version,
        path: path
      } 
      localStorage.setItem(file.name, JSON.stringify(localFolder))
      getFileList()
    }
  }
}

function getFileList() {
  $('#listOfFolders').html('</div><div>')
  axios.get("http://104.248.16.212:3000/folder/getAll").then((res) => {
    updateList(res.data.folders)
  }).catch(err => console.log(err))
}

function updateList(folderList) {
  folderList.forEach(folder => {
    const localFolder = localStorage.getItem(folder.name);
    if (localFolder) {
      const parsed = JSON.parse(localFolder)
      console.log(parsed.version, folder.version)
      $('#listOfFolders').append(createElement(folder.name, parsed.version === folder.version, parsed.path))
    }else{
      $('#listOfFolders').append(createElement(folder.name))
    }
  })
  console.log($('#listOfFolders'))
}
function createElement(name, status, path) {

  let folder = $('<div class=folder></div>')
  folder.append($('<div class=name></div>').text(name))
  if (path) {
    folder.append($('<div class=status></div>').text(status ? 'latest verson': 'Can be update'))
    folder.append($('<div class=path></div>').text(path))
    folder.append($('<button ></button>').text("open").click((e)=>shell.openItem(path)))
    folder.append($('<button></button>').text("upload").click(() => updateFolder(path, name)))
    if(status){
      folder.append($('<button></button>').text("update").click(()=>download(path, name)))
    }
  }
  else {
    folder.append($('<div class=status></div>').text("Didn't douwnload"))
    folder.append($('<input type="file" id="selector" webkitdirectory directory multiple >').text('download')
    .attr('name', name).change(e => download($(e.target)[0].files[0].path, e.target.name)))
  }
  console.log(folder)
  return folder
}

function download(path, name) {
  axios.get('http://104.248.16.212:3000/folder/' + name).then((res) => {
    console.log(res.data)
    var request = http.get(res.data.data.downloadURL, function (response) {
      response.pipe(unzipper.Extract({ path: path }));
      localFolder = {
        version: res.data.data.status,
        path: path + '/' + name
      } 
      localStorage.setItem(name, JSON.stringify(localFolder))
      getFileList();
    })
  })
}

function updateFolder(path, name){
  var archive = archiver('zip');
  var bufs = [];


  archive.on('data', function (d) { bufs.push(d); });
  archive.on('end', function () {
    var buf = Buffer.concat(bufs);
    console.log('len', buf.length, new Uint8Array(buf).buffer)
    const file = new File([new Uint8Array(buf).buffer], name)
    console.log('end', file)
    retrieveNewURL(file, (url, version) => {
      uploadFile(file, url, path , version)
    })
  })
  archive.directory(path, name)
  archive.finalize();
}