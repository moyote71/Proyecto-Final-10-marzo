import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const productsLatency = new Trend('products_latency', true);
const searchLatency = new Trend('search_latency', true);

export const options = {
  stages: [
    { duration: '1m', target: 20 },   // Rampa: 0 → 20 VUs
    { duration: '3m', target: 20 },   // Carga sostenida
    { duration: '1m', target: 0 },    // Bajada
  ],
  thresholds: {
    http_req_duration:  ['p(95)<500'],
    products_latency:   ['p(95)<200'],
    search_latency:     ['p(95)<300'],
    errors:             ['rate<0.01'],
  },
};

const BASE_URL = 'http://localhost:4000/api';

export function setup() {
  const res = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ email: 'admin@email.com', password: 'admin123' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  const token = res.json('token');
  if (!token) { throw new Error('Setup: login falló — verifica credenciales'); }
  return { token };
}

export default function (data) {
  const authHeaders = {
    headers: { Authorization: `Bearer ${data.token}` },
  };

  // Test 1: GET /products (paginación)
  const r1 = http.get(`${BASE_URL}/products?page=1&limit=10`);
  productsLatency.add(r1.timings.duration);
  errorRate.add(r1.status !== 200);
  check(r1, {
    'products status 200': (r) => r.status === 200,
    'products tiene data': (r) => r.json('data') !== undefined,
  });

  // Test 2: GET /products/search con filtros
  const r2 = http.get(`${BASE_URL}/products/search?q=laptop&sort=price&order=asc`);
  searchLatency.add(r2.timings.duration);
  errorRate.add(r2.status !== 200);
  check(r2, { 'search status 200': (r) => r.status === 200 });

  // Test 3: GET /orders (admin autenticado)
  const r3 = http.get(`${BASE_URL}/orders`, authHeaders);
  errorRate.add(![200, 403].includes(r3.status));

  // Test 4: GET /categories (pública)
  const r4 = http.get(`${BASE_URL}/categories`);
  errorRate.add(r4.status !== 200);
  check(r4, { 'categories status 200': (r) => r.status === 200 });

  sleep(1);
}
