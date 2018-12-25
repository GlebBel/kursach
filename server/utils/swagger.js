const swaggerJSDoc = require('swagger-jsdoc');
const fs = require('fs');

const options = {
  swaggerDefinition: {
    info: {
      title: 'Video Server', // Title (required)
      version: '1.0.0' // Version (required)
    }
  },
  apis: ['./src/routes/**/*.js', './src/Models/**/*.js'] // Path to the API docs
};

fs.writeFileSync('./utils/docs.js', JSON.stringify(swaggerJSDoc(options)));
