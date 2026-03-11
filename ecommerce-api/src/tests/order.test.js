import { describe, it, expect, vi, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import Order from '../models/order.js';
import Product from '../models/product.js';
import jwt from 'jsonwebtoken';

describe('Order Integration Tests (Mocked)', () => {
    let token;
    const mockOrderRequest = {
        user: '507f1f77bcf86cd799439011',
        products: [
            { productId: '507f1f77bcf86cd799439012', quantity: 2, price: 50 }
        ],
        shippingAddress: '507f1f77bcf86cd799439013',
        paymentMethod: '507f1f77bcf86cd799439014',
        shippingCost: 10
    };

    beforeAll(() => {
        token = jwt.sign({ userId: 'user123', role: 'customer' }, process.env.JWT_SECRET || 'test_secret');
    });

    it('should create an order successfully when stock is available', async () => {
        Product.findById.mockResolvedValue({
            _id: '507f1f77bcf86cd799439012',
            name: 'Test Product',
            price: 50,
            stock: 10
        });

        Product.findByIdAndUpdate.mockResolvedValue(true);

        // Mock create result
        Order.create.mockResolvedValue({
            _id: 'ord123',
            ...mockOrderRequest,
            totalPrice: 110,
            populate: vi.fn().mockReturnThis()
        });

        const response = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${token}`)
            .send(mockOrderRequest);

        expect(response.status).toBe(201);
    });

    it('should fail to create order if stock is insufficient', async () => {
        Product.findById.mockResolvedValue({
            _id: '507f1f77bcf86cd799439012',
            name: 'Test Product',
            price: 50,
            stock: 1
        });

        const response = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${token}`)
            .send(mockOrderRequest);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Cannot create order due to stock issues');
    });
});
