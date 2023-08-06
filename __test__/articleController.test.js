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
describe('articleController.list', () => {

    let req, res, mockArticles;

    beforeAll(() => {
        // 13개의 모의 Article 생성
        mockArticles = Array.from({ length: 13 }).map((_, i) => {
            return { 
                id: 13 - i, 
                author: `testAuthor${13 - i}`, 
                content: `testContent${13 - i}` 
            };
        });
    });

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
    });

    it('should fetch the latest 5 paginated articles from a set of 13 and return 200', async () => {
        req.query.page = '1';
        req.query.limit = '5';

        // 첫 페이지에 대한 응답 설정: 가장 최근의 5개 Article 반환
        const mockResponse = {
            count: 13,
            rows: mockArticles.slice(0, 5)
        };

        Article.findAndCountAll.mockResolvedValue(mockResponse);

        await articleController.list(req, res);
        const responseData = JSON.parse(res._getData());

        const expectedResponse = {
            articles: mockArticles.slice(0, 5),
            pagination: {
                totalItems: 13,
                itemsPerPage: 5,
                currentPage: 1,
                totalPages: 3
            }
        };

        expect(res.statusCode).toBe(200);
        expect(responseData).toEqual(expectedResponse);
    });
    it('should fetch the last 3 articles when the 3rd page is requested from a set of 13', async () => {
        req.query.page = '3';
        req.query.limit = '5';
    
        // 세 번째 페이지에 대한 응답 설정: Article 1,2,3 반환
        const mockResponse = {
            count: 13,
            rows: mockArticles.slice(10, 13)
        };
    
        Article.findAndCountAll.mockResolvedValue(mockResponse);
    
        await articleController.list(req, res);
        const responseData = JSON.parse(res._getData());
    
        const expectedResponse = {
            articles: mockArticles.slice(10, 13),
            pagination: {
                totalItems: 13,
                itemsPerPage: 5,
                currentPage: 3,
                totalPages: 3
            }
        };
    
        expect(res.statusCode).toBe(200);
        expect(responseData).toEqual(expectedResponse);
    });

    it('should return 500 if there is an error', async () => {
        Article.findAndCountAll.mockRejectedValue(new Error('Test error'));

        await articleController.list(req, res);
        const responseData = JSON.parse(res._getData()); // 응답을 객체로 변환

        const expectedErrorResponse = {
            message: 'Error fetching articles',
            error: 'Test error'
        };

        expect(res.statusCode).toBe(500);
        expect(responseData).toEqual(expectedErrorResponse);
    });
});
describe('getArticleById', () => {
    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
    });

    it('should retrieve an article by its ID and return 200', async () => {
        const mockArticle = {
            id: 1,
            author: 'testAuthor',
            content: 'testContent'
        };
        Article.findByPk.mockResolvedValue(mockArticle);

        req.params.id = '1'; // 주어진 게시글 ID 설정

        await articleController.getArticleById(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual(mockArticle);
    });

    it('should return 404 if the article is not found', async () => {
        Article.findByPk.mockResolvedValue(null);

        req.params.id = '99';  // 존재하지 않는 게시글 ID 설정

        await articleController.getArticleById(req, res);

        expect(res.statusCode).toBe(404);
        expect(res._getData()).toEqual({ message: 'Article not found' });
    });

    it('should return 500 if there is an error', async () => {
        Article.findByPk.mockRejectedValue(new Error('Test error'));

        req.params.id = '1'; 

        await articleController.getArticleById(req, res);

        const responseData = res._getData();
        
        expect(res.statusCode).toBe(500);
        expect(responseData.message).toBe('Error retrieving article');
        expect(responseData.error).toBe('Test error');
    });
});