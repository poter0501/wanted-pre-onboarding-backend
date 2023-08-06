require('dotenv').config();

const request = require('supertest');
const express = require('express');
const userController = require('../controllers/userController');
const User = require('../models/user')
const sequelize = require('../config/database');

const app = express();
app.use(express.json());
app.post('/user/register', userController.register);

describe('User Registration Endpoint', () => {
    // 데이터베이스 연결
    beforeAll(async () => {
        await sequelize.authenticate();
    });

    // 모든 테스트가 완료된 후 데이터베이스 연결 종료
    afterAll(async () => {
        await sequelize.close();
    });


    it('should register a user successfully', async () => {
        const testEmail = 'test@example.com';
        const testPassword = 'Password123';

        // 회원가입 요청
        const response = await request(app)
            .post('/user/register')
            .send({
                email: testEmail,
                password: testPassword
            });

        // 응답 검증
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User registered successfully');

        // 데이터베이스에서 사용자 정보 조회
        const user = await User.findOne({ where: { email: testEmail } });

        // 사용자 정보 검증
        expect(user).not.toBeNull();
        expect(user.email).toBe(testEmail);
        // 비밀번호는 암호화되어 저장되므로, 입력한 비밀번호와는 다르게 저장되어 있습니다.
        expect(user.password).not.toBe(testPassword);

        // 테스트 데이터 삭제 (cleanup)
        await user.destroy();
    });

    it('should return an error for invalid email format', async () => {
        const testEmail2 = 'invalidEmail';
        const testPassword2 = 'Password123';

        const response = await request(app)
            .post('/user/register')
            .send({
                email: testEmail2,
                password: testPassword2
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid email format');
    });
    it('should return an error for invalid password format', async () => {
        const testEmail3 = 'test@example.com';
        const testPassword3 = '1234';

        const response = await request(app)
            .post('/user/register')
            .send({
                email: testEmail3,
                password: testPassword3
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid password format');
    });
});
