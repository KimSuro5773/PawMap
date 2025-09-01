import apiClient from "./index";

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 요청 전 로깅
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);

    // 로딩 상태 시작 (필요시 zustand store와 연동)
    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    // 응답 성공 로깅
    console.log(`[API Response] ${response.status} ${response.config.url}`);

    // 로딩 상태 종료
    return response;
  },
  (error) => {
    console.error("[API Response Error]", {
      status: error.response?.status,
      message: error.response?.data?.error || error.message,
      url: error.config?.url,
    });

    // 공통 에러 처리
    if (error.response?.status === 500) {
      console.error("서버 오류가 발생했습니다.");
    } else if (error.response?.status === 400) {
      console.error("잘못된 요청입니다.");
    } else if (!error.response) {
      console.error("네트워크 오류가 발생했습니다.");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
