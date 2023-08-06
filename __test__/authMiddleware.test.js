require('dotenv').config();
const httpMocks = require('node-mocks-http');
const authMiddleware = require('../middlewares/authMiddleware');
const jwt = require('jsonwebtoken');


describe('authMiddleware', () => {
    it('should return 403 if no token is provided', () => {
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();
        const next = jest.fn();

        authMiddleware(req, res, next);

        expect(res.statusCode).toBe(403);
    });

    it('should return 401 for invalid token', () => {
        const req = httpMocks.createRequest({
            headers: {
                authorization: 'invalidtoken'
            }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();

        authMiddleware(req, res, next);

        expect(res.statusCode).toBe(401);
    });

    it('should call next() for a valid token', () => {
        // 임의의 사용자 ID
        const testUserId = 12345;

        // 유효한 토큰 생성
        const validToken = jwt.sign({ id: testUserId }, process.env.JWT_SECRET);

        const req = httpMocks.createRequest({
            headers: {
                authorization: `Bearer ${validToken}`
            }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();

        authMiddleware(req, res, next);

        // next()가 호출되었는지 확인
        expect(next).toHaveBeenCalled();

        // req.userId가 제대로 설정되었는지 확인
        expect(req.userId).toBe(testUserId);
    });
});

