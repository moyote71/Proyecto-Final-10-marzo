import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(99)<1500'], // 99% de requests < 1.5s bajo estrés
    http_req_failed:   ['rate<0.05'],  // < 5% errores
  },
};

const BASE_URL = 'http://localhost:4000/api';

export default function () {
  const r1 = http.get(`${BASE_URL}/products`);
  check(r1, { 'products ok': (r) => r.status === 200 });

  const r2 = http.get(`${BASE_URL}/products/search?q=phone`);
  check(r2, { 'search ok': (r) => r.status === 200 });

  sleep(0.5);
}
