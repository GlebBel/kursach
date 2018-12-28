const express = require('express');
const Folder = require('../Models/Folder')
const minioClient = require('../config/minio')

exports.uploadFolder = (req, res, next) => {
    Folder.findOne({ where: { name: req.body.name } }).then(folder => {
        try {
            if (folder) {
                console.log('status', folder.status)
                folder.update({status:folder.status+1}).then(() => {res.status(200).json({data:{ uploadURL: folder.uploadURL, status: folder.status}})})
            }
            else {
                Folder
                    .build({ name: req.body.name })
                    .save()
                    .then(newFolder => {
                        minioClient.presignedPutObject('folders', newFolder.name, (err, url) => {
                            if (err) throw ({ message: 'Server error', status: 500 });
                            console.log('url', url)
                            newFolder.uploadURL = url;
                            newFolder.status = 1
                            newFolder.save().then(() => { console.log('done!') });
                            res.status(200).json({
                                success: true,
                                data: {
                                    uploadURL: url,
                                    status: 1 
                                }
                            })
                        })
                    })
            }
        } catch (error) {
            return next(error)
        }
    })
};


exports.downloadFolder = (req, res, next) => {
    Folder.findOne({ where: { name: req.params.name } }).then(folder => {
        try {
            if (!folder) throw ({ message: 'Order ID not found', status: 404 });
            if (!folder.status) throw ({ message: 'Folder is not already download', status: 400 });
            res.status(200).json({
                success: true,
                data: {
                    downloadURL: folder.downloadURL,
                    status: folder.status,
                }
            })
        } catch (error) {
            return next(error)
        }
    })
}


exports.deleteFolder = (req, res, next) => {
    console.log(req.params.name)
    Folder.findOne({ where: { name: req.params.name } }).then(folder => {
        try {
            if (!folder) throw ({ message: 'Order ID not found', status: 404 });
            if (!folder.status) {
                folder.destroy({ force: true }).then(() => {
                    res.status(200).json({
                        success: true
                    })
                })
            }
            else {
                minioClient.removeObject('folders', folder.name, function (err) {
                    if (err) {
                        throw ({ message: 'Server error', status: 500 });
                    }
                    folder.destroy({ force: true }).then(() => {
                        res.status(200).json({
                            success: true
                        })
                    })
                })
            }
        } catch (error) {
            return next(error)
        }
    })
}

exports.getAll = (req, res, next) => {
    Folder.findAll().then(folders => {
        try {
            if (!folders) throw ({ message: 'No folders', status: 404 });
            else {
                res.json({ folders: folders });
            }
        } catch (error) {
            return next(error)
        }
    })
}
