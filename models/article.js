const Sequelize = require('sequelize');
const db = require('../config/database');

const Article = db.define('article', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    author: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    }
}, {
    timestamps: true  // 생성시간 (createdAt) 및 수정시간 (updatedAt) 자동 관리
});

module.exports = Article;
