const app = require('express').Router();
const Actions = require('../controllers/file');
const Validator = require('../middlewares/validation');
const Schemas = require('../helpers/schemas');

console.info('[User] Auth router connected');

app.get('/getAll', Actions.getAll);
/**
* @swagger
* /file/{orderId}:
*   get:
*     tags:
*     - "file"
*     summary: "get download URL from orderID"
*     description: "Returns a download URL"
*     produces:
*     - "application/xml"
*     - "application/json"
*     parameters:
*     - name: "orderId"
*       in: "path"
*       description: "ID of the video"
*       required: true
*       type: "string"
*     responses:
*       200:
*         description: "successful operation"
*         content:
*           application/json:
*             schema:
*               type: "object"
*               properties:
*                 downloadURL:
*                   type: "string"
*                 metadata:
*                   type: "object"
*       400:
*         description: "File is not already download"
*       404:
*         description: "Order ID not found"
*/
app.get('/:name', Actions.downloadFolder);

/**
* @swagger
* /file/{orderId}:
*   delete:
*     tags:
*     - "file"
*     summary: "Delete file"
*     description: "Delete file vith given ID"
*     produces:
*     - "application/xml"
*     - "application/json"
*     parameters:
*     - name: "orderId"
*       in: "path"
*       description: "ID of the video"
*       required: true
*       type: "string"
*     responses:
*       200:
*         description: "successful operation"
*       404:
*         description: "Order ID not found"
*/

app.delete('/:name', Actions.deleteFolder);

/**
* @swagger
* /file/:
*   post:
*     tags:
*     - "file"
*     summary: "Upload file"
*     description: "get upload URL"
*     produces:
*     - "application/xml"
*     - "application/json"
*     parameters:
*     - in: "body"
*       name: "body"
*       description: "ID of the video"
*       required: true
*       schema:
*         type: "object"
*         properties:
*           orderID:
*             type: "string"
*           metadata:
*             type: "object"
*           expire:
*             type: "integer"
*           mime:
*             type: "string"
*     responses:
*       200:
*         description: "successful operation"
*       400:
*         description: "File with this order ID is already exist"
*/
app.post('/', Validator.bodyValidation.bind(this, Schemas.uploadFolder), Actions.uploadFolder); 




module.exports = app;

