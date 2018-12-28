const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.POSTGRESS_URL);
const Folder = sequelize.define('folder', {
    name: { type: Sequelize.STRING(1000), unique: true, allowNull: false },
    status: { type: Sequelize.INTEGER },
    downloadURL: { type: Sequelize.STRING(1000) },
    uploadURL: { type: Sequelize.STRING(1000) },
    downloadCount: { type: Sequelize.INTEGER } 
});


Folder.sync({ force: true });

module.exports = Folder;