require('dotenv').config();
const sequelize = require('./config/database');

beforeAll(async () => {
    await sequelize.authenticate();
});

afterAll(async () => {
    await sequelize.close();
});
