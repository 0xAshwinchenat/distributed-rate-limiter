import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const userId = Math.floor(Math.random() * 1000);
  const res = http.get('http://localhost:8080/api/profile', {
    headers: {
      'user-id': userId,
    },
  });
  check(res, {
    'is status 200': (r) => r.status === 200,
    'is status 429': (r) => r.status === 429,
  });
  sleep(1);
}
