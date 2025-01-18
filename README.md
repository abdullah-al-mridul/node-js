Node.js REST API Backend

A pure Node.js REST API backend with user authentication, token management, and URL monitoring capabilities. Built without any external dependencies.

Features

- User Management (CRUD operations)
- Token-based Authentication
- URL Health Monitoring
- File-based Data Storage
- Custom Request/Response Handling

API Endpoints

Users
POST /user - Create new user
GET /user?email=user@example.com - Get user details
PUT /user - Update user information
DELETE /user?email=user@example.com - Delete user

Authentication
POST /token - Create authentication token
GET /token?id=tokenId - Verify token
PUT /token - Extend token expiration
DELETE /token?id=tokenId - Delete token

URL Monitoring
POST /check - Create new URL check
GET /check?id=checkId - Get check details
PUT /check - Update check configuration
DELETE /check?id=checkId - Delete check

Getting Started

Prerequisites

- Node.js (v14 or higher)
- pnpm package manager

Installation

1. Clone the repository
   git clone <repository-url>

2. Install dependencies
   pnpm install

3. Start the server
   pnpm start

The server will start on port 3000 by default.

API Usage

Creating a User:
curl -X POST http://localhost:3000/user \
 -H "Content-Type: application/json" \
 -d '{
"firstName": "John",
"lastName": "Doe",
"email": "john@example.com",
"password": "securepassword",
"phone": "1234567890",
"tos": true
}'

Authentication:
curl -X POST http://localhost:3000/token \
 -H "Content-Type: application/json" \
 -d '{
"email": "john@example.com",
"password": "securepassword"
}'

Creating a URL Check:
curl -X POST http://localhost:3000/check \
 -H "Content-Type: application/json" \
 -H "token: YOUR_TOKEN_HERE" \
 -d '{
"protocol": "https",
"url": "example.com",
"method": "GET",
"successCodes": [200, 201],
"timeOutSeconds": 5
}'

Data Storage

The API uses a file-based storage system with the following structure:
/data
/users/
/tokens/
/checks/

Security Features

- Password hashing using SHA-256
- Token-based authentication
- Request validation
- Input sanitization

Error Handling

The API returns structured error responses:
{
"success": false,
"data": {
"msg": "Error message here"
}
}

Configuration

Server configuration can be modified through environment variables:
PORT - Server port (default: 3000)

Development

To run the server in development mode with auto-reload:
pnpm start

Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

License

This project is licensed under the ISC License.

Author

Abdullah Al Mridul
