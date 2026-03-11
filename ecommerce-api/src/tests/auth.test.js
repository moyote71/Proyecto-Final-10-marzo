import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import User from '../models/user.js';
import bcrypt from 'bcrypt';

describe('Auth Integration Tests (Mocked)', () => {
    const testUser = {
        displayName: 'Test User',
        email: 'test@example.com',
        password: 'Password123'
    };

    it('should register a new user successfully', async () => {
        // checkUserExist usa findOne
        User.findOne().exec.mockResolvedValue(null);

        const response = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        expect(response.status).toBe(201);
    });

    it('should not register a user with an existing email', async () => {
        User.findOne().exec.mockResolvedValue({ email: testUser.email });

        const response = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('User already exist');
    });

    it('should login successfully with correct credentials', async () => {
        const hashPassword = await bcrypt.hash(testUser.password, 10);

        User.findOne().exec.mockResolvedValue({
            _id: '507f1f77bcf86cd799439011',
            displayName: testUser.displayName,
            email: testUser.email,
            hashPassword,
            role: 'customer'
        });

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
    });

    it('should return 400 for invalid credentials', async () => {
        const hashPassword = await bcrypt.hash('OtherPassword', 10);

        User.findOne().exec.mockResolvedValue({
            _id: '507f1f77bcf86cd799439011',
            email: testUser.email,
            hashPassword
        });

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid credentials');
    });

    it('should validate registration fields', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'invalid-email',
                password: '123'
            });

        expect(response.status).toBe(422);
        expect(response.body.errors).toBeDefined();
    });
});
