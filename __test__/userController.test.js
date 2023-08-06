const request = require('supertest');
const express = require('express');
const userController = require('../controllers/userController');
const User = require('../models/user')
const sequelize = require('../config/database');

const app = express();
app.use(express.json());
app.post('/user/register', userController.register);
app.post('/user/login', userController.login);

describe('User Registration Endpoint', () => {
    it('should register a user successfully', async () => {
        const testEmail = 'registerTest@example.com';
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
        const testEmail3 = 'registerTest@example.com';
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

describe('User Login Endpoint', () => {

    it('should login successfully with valid credentials', async () => {
        const testEmailLogin = 'test@example.com';
        const testPasswordLogin = 'Password123';

        const response = await request(app)
            .post('/user/login')
            .send({
                email: testEmailLogin,
                password: testPasswordLogin
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Logged in successfully');
        expect(response.body.token).toBeDefined();
    });

    it('should fail with invalid email', async () => {
        const testEmailLogin2 = 'wrong@example.com';
        const testPasswordLogin2 = 'Password123';

        const response = await request(app)
            .post('/user/login')
            .send({
                email: testEmailLogin2,
                password: testPasswordLogin2
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Incorrect email or password');
    });

    it('should fail with invalid password', async () => {
        const testEmailLogin3 = 'test@example.com';
        const testPasswordLogin3 = 'wrongPassword';

        const response = await request(app)
            .post('/user/login')
            .send({
                email: testEmailLogin3,
                password: testPasswordLogin3
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Incorrect email or password');
    });
});
