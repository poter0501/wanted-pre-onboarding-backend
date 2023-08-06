const httpMocks = require('node-mocks-http');
const articleController = require('../controllers/articleController');
const Article = require('../models/article');

jest.mock('../models/article');

describe('articleController.post', () => {
    it('should return 201 and the created article', async () => {
        const req = httpMocks.createRequest({
            body: {
                author: 'testAuthor',
                content: 'testContent'
            },
            userId: 1
        });
        const res = httpMocks.createResponse();
    
        const mockArticle = { id: 1, author: 'testAuthor', content: 'testContent' };
        Article.create.mockResolvedValue(mockArticle);
    
        const expectedResponse = {
            message: "Article created successfully",
            article: mockArticle
        };
    
        await articleController.post(req, res);
    
        const receivedResponse = JSON.parse(res._getData()); // 응답을 객체로 변환

        expect(res.statusCode).toBe(201);
        expect(receivedResponse).toEqual(expectedResponse);
    });    

    it('should return 500 on error', async () => {
        const req = httpMocks.createRequest({
            body: {
                author: 'testAuthor',
                content: 'testContent'
            },
            userId: 1
        });
        const res = httpMocks.createResponse();

        Article.create.mockRejectedValue(new Error('Test error'));

        await articleController.post(req, res);

        expect(res.statusCode).toBe(500);
    });
});
