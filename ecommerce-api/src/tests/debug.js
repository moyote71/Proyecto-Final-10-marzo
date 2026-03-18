import app from '../app.js';
import request from 'supertest';
import User from '../models/user.js';
import { vi } from 'vitest';

async function run() {
    User.findOne().exec.mockResolvedValue(null);
    const testUser = { displayName: 'Test', email: 't@e.com', password: 'P12' };
    const res = await request(app).post('/api/auth/register').send(testUser);
    console.log(res.status, res.body);
}
run().catch(console.error);
