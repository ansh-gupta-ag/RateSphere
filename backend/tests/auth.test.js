const request = require('supertest');
const app = require('../src/server');

describe('Auth Endpoints', () => {
  describe('POST /api/auth/signup', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        name: 'Test User With Valid Name Length',
        email: `test${Date.now()}@example.com`,
        password: 'Test@123!',
        address: '123 Test Street'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', userData.email);
    });

    it('should reject signup with short name', async () => {
      const userData = {
        name: 'Short',
        email: 'test@example.com',
        password: 'Test@123!',
        address: '123 Test Street'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData);

      expect(response.status).toBe(400);
    });

    it('should reject signup with weak password', async () => {
      const userData = {
        name: 'Test User With Valid Name Length',
        email: 'test@example.com',
        password: 'weak',
        address: '123 Test Street'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'User@123!'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should reject login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
    });
  });
});
