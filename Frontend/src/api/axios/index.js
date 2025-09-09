import axios from 'axios';
import { setupInterceptors } from './interceptors';

// Backend API 베이스 URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 인터셉터 설정 적용
setupInterceptors(apiClient);

export default apiClient;
