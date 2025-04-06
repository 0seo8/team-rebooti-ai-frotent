import axios, { AxiosInstance } from 'axios';

/**
 * 기본 API 클라이언트 인스턴스
 */
const api: AxiosInstance = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 요청 인터셉터 설정
 */
api.interceptors.request.use(
  (config) => {
    // 요청 전에 수행할 작업
    return config;
  },
  (error) => {
    // 요청 오류 처리
    return Promise.reject(error);
  },
);

/**
 * 응답 인터셉터 설정
 */
api.interceptors.response.use(
  (response) => {
    // 응답 데이터 처리
    return response;
  },
  (error) => {
    // 응답 오류 처리
    return Promise.reject(error);
  },
);

export default api;
