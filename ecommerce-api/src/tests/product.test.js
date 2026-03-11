import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import Product from '../models/product.js';

describe('Product Integration Tests (Mocked)', () => {
    const mockProduct = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Test Product',
        price: 99.99,
        stock: 10,
        category: '507f1f77bcf86cd799439012'
    };

    it('should fetch products with pagination', async () => {
        Product.find().exec.mockResolvedValue([mockProduct]);
        Product.countDocuments.mockResolvedValue(1);

        const response = await request(app).get('/api/products?page=1&limit=10');

        expect(response.status).toBe(200);
        expect(response.body.products).toHaveLength(1);
    });

    it('should search products with filters', async () => {
        Product.find().exec.mockResolvedValue([mockProduct]);
        Product.countDocuments.mockResolvedValue(1);

        const response = await request(app).get('/api/products/search?q=test&minPrice=50');

        expect(response.status).toBe(200);
    });

    it('should return 404 for non-existent product', async () => {
        const validId = '507f1f77bcf86cd799439099';
        Product.findById().exec.mockResolvedValue(null);

        const response = await request(app).get(`/api/products/${validId}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Product not found');
    });
});
