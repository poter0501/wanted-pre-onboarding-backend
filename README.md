## 지원자 성명
#### 이도영
## 애플리케이션의 실행 방법 (엔드포인트 호출 방법 포함)
### 서버 실행 방법
```
npm start
```
### test 코드 실행 방법
```
npm test
```
### 엔드포인트 호출 방법
아래에 사용된 email, password, token, id등은 원하는 실제 값으로 변경하여 사용
1. 회원가입
```
curl -X POST http://52.78.8.13:3000/user/register \
-H "Content-Type: application/json" \
-d '{
    "email": "사용자 이메일",
    "password": "사용자 비밀번호"
}'
```
2. 로그인
```
curl -X POST http://52.78.8.13:3000/user/login \
-H "Content-Type: application/json" \
-d '{
    "email": "사용자 이메일",
    "password": "사용자 비밀번호"
}'
```
3. 게시글 생성
```
curl -X POST http://52.78.8.13:3000/article/post \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <token>" \
-d '{
    "content": "게시글 내용"
}'
```
4. 게시글 목록 조회
```
curl -X GET "http://52.78.8.13:3000/article/list?page=3&limit=5"
```
5. 특정 게시글 조회
```
curl -X GET "http://52.78.8.13:3000/article/:id"
```
6. 특정 게시글 수정
```
curl -X PUT http://52.78.8.13:3000/article/:id \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <token>" \
-d '{
    "content": "게시글 내용"
}'
```
7. 특정 게시글 삭제
```
curl -X DELETE http://52.78.8.13:3000/article/:id \
-H "Authorization: Bearer <token>"
```
## 데이터베이스 테이블 구조
### User Table

| Column   | Type          | Constraints                   |
|----------|---------------|-------------------------------|
| id       | INTEGER       | PRIMARY KEY, AUTO_INCREMENT   |
| email    | STRING        | UNIQUE                        |
| password | STRING        | -                             |
| createdAt| DATE/TIME | auto-generated by Sequelize |
| updatedAt| DATE/TIME | auto-generated by Sequelize |

### Article Table

| Column   | Type   | Constraints               |
|----------|--------|---------------------------|
| id       | INTEGER| PRIMARY KEY, AUTO_INCREMENT, NOT NULL |
| author   | STRING | NOT NULL                  |
| content  | TEXT   | NOT NULL                  |
| createdAt| DATE/TIME | auto-generated by Sequelize |
| updatedAt| DATE/TIME | auto-generated by Sequelize |

## 구현한 API의 동작을 촬영한 데모 영상 링크
[API 데모 영상](https://drive.google.com/file/d/1SJ_CHyu2CtFJ_78Pce85fFQOeD2PGjHs/view?usp=sharing)

## 구현 방법 및 이유에 대한 간략한 설명
- Javascript/Express 로 서버를 작성
- Jest 를 사용해서 각각의 엔드포인트별 간단한 테스트 코드 작성
- email, password 검증 모듈
    - email과 password 검증의 경우 회원가입, 로그인 두개의 엔드포인트에서 사용되기 때문에 따로 함수로 작성해 사용

- 토큰 검증 Middleware
    - 사용자 인증이 필요한 요청에 대해서 라우팅 전에 유효한 토큰인지 검증하는 Middleware

- 회원 가입
    - 위에서 설명한 검증 모듈을 사용해 email, password 검증
    - 전달 받은 password는 암호화(hash)하여 DB에 저장
- 로그인
    - 회원 가입과 마찬가지로 email, password 검증 모듈 사용 -> DB에 접근하기 전에 검증해 유효하지 않은 요청의 일부에 대해서 DB접근 차단
    - 로그인 성공시 클라이언트에게 토큰 반환
- 게시글 목록 조회
    - offset 기반의 pagenation 구현
## API 명세(request/response 포함)
### [1. 사용자 정보](#사용자-정보)
-  [회원 가입](#회원-가입)
-  [로그인](#로그인)
### [2. 게시글](#게시글)
-  [게시글 생성](#게시글-생성)
-  [게시글 목록 조회](#게시글-목록-조회)
-  [특정 게시글 조회](#특정-게시글-조회)
-  [특정 게시글 수정](#특정-게시글-수정)
-  [특정 게시글 삭제](#특정-게시글-삭제)


### 사용자 정보
#### 회원 가입
- URL: 'user/register'
- Method: 'POST'
- Request: 
    ``` Json
    // Body
    {
        "email": "사용자 이메일",
        "password": "사용자 비밀번호"
    }
    ```
- Response:
    ``` Json
    // Success, state code: 201 Created
    {
        "message": "User registered successfully",
        "user": {
        "id": 1, // unique userId
        "email": "사용자 이메일",
        "password": "암호화된 비밀번호",
        "updatedAt": "갱신일자",
        "createdAt": "생성일자"
        }
    }
    // Fail, state code: 400 Bad Request
    // When email, password validation was failed
    {
        "message": "Invalid email format"
    }
    {
        "message": "Invalid password format"
    }
    // Fail, state code: 400 Bad Request
    // When email was already exist
    {
        "message": "Email already in use"
    }
    ```
#### 로그인
- URL: 'user/login'
- Method: 'POST'
- Request: 
    ``` Json
    // Body
    {
        "email": "사용자 이메일",
        "password": "사용자 비밀번호"
    }
    ```
- Response:
    ``` Json
    // Success, state code: 200 OK
    {
        "message": "Logged in successfully",
        "token": "<token>"
    }
    // Fail, state code: 400 Bad Request
    // When email, password validation was failed
    {
        "message": "Invalid email format"
    }
    {
        "message": "Invalid password format"
    }
    // Fail, state code: 401 Unauthorized
    {
        "message": "Incorrect email or password"
    }
    ```

### 게시글
#### 게시글 생성
- URL: 'article/post'
- Method: 'POST'
- Request: 
    ``` Json
    // Header
    {
        "Authorization": "Bearer <token>"
    }
    // Body
    {
        "content": "게시글 내용"
     }
    ```
- Response:
    ``` Json
    // Success, state code: 201 Created
    {
        "message": "Article created successfully",
        "article": {
            "id": 1, //unique articleId
            "author": 1, //unique userId
            "content": "게시글 내용",
            "updatedAt": "갱신 일자",
            "createdAt": "생성 일자"
            }
    }
    // Fail, state code: 500
    {
        "message": "Error creating article",
        "error": "error"
    }
    ```
#### 게시글 목록 조회
- URL: 'article/list'
- Method: 'GET'
- Request: 
    ``` Json
    // ex)
    'article/list?page=3&limit=5'
    ```
- Response:
    ``` Json
    // Success, state code: 200 OK
    {
        "articles": [
            {
                "id": 10, // 게시글 articleId
                "author": "1", // 작성자 userId
                "content": "게시글 내용",
                "createdAt": "생성 일자",
                "updatedAt": "갱신 일자"
            },
            // ... 
        ],
        "pagination": {
            "totalItems": 20, // all items
            "itemsPerPage": 5, // limit
            "currentPage": 3,  // current page
            "totalPages": 4 // total pages
        }
    }
    // Fail, state code: 500
    {
        "message": "Error fetching articles",
        "error": "error"
    }
    ```
#### 특정 게시글 조회
- URL: 'article/:id'
- Method: 'GET'
- Response:
    ``` Json
    // Success, state code: 200 OK
    {
        "id": 13, // 게시글 Id(articleId)
        "author": "30", // 작성자 Id(userId)
        "content": "게시글 내용",
        "createdAt": "생성 일자",
        "updatedAt": "갱신 일자"
    }
    // Fail, state code: 500
    {
        "message": "Error retrieving articles",
        "error": "error"
    }
    ```
#### 특정 게시글 수정
- URL: 'article/:id'
- Method: 'PUT'
- Request: 
    ``` Json
    // Header
    {
        "Authorization": "Bearer <token>"
    }
    // Body
    {
        "content": "게시글 내용"
     }
    ```
- Response:
    ``` Json
    // Success, state code: 200 OK
    {
        "message": "Article updated successfully",
        "article": {
            "id": 12, // 게시글 Id
            "author": "1", // 작성자 Id
            "content": "수정된 게시글 내용",
            "createdAt": "생성 일자",
            "updatedAt": "갱신 일자"
        }
    }
    // Fail, state code: 404 Not Found
    {
        "message": "Article not found"
    }
    // Fail, state code: 403 Forbidden
    {
        "message": "You are not authorized to edit this article"
    }
    // Fail, state code: 500
    {
        "message": "Error updating article",
        "error": "error"
    }
    ```
#### 특정 게시글 삭제
- URL: 'article/:id'
- Method: 'DELETE'
- Request: 
    ``` Json
    // Header
    {
        "Authorization": "Bearer <token>"
    }
    ```
- Response:
    ``` Json
    // Success, state code: 200 OK
    {
        "message": "Article deleted successfully"
    }
    // Fail, state code: 404 Not Found
    {
        "message": "Article not found"
    }
    // Fail, state code: 403 Forbidden
    {
        "message": "You are not authorized to edit this article"
    }
    // Fail, state code: 500
    {
        "message": "Error deleting article",
        "error": "error"
    }
    ```
