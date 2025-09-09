/**
 * axios 인터셉터 설정
 * @param {import('axios').AxiosInstance} apiClient - axios 인스턴스
 */
export const setupInterceptors = (apiClient) => {
  // 요청 인터셉터
  apiClient.interceptors.request.use(
    (config) => {
      // 요청 시작 시간 기록 (디버깅용)
      config.metadata = { startTime: new Date() };
      
      // 개발 환경에서 요청 로그
      if (import.meta.env.DEV) {
        console.log(`🚀 API 요청: ${config.method?.toUpperCase()} ${config.url}`, {
          params: config.params,
          data: config.data,
        });
      }
      
      return config;
    },
    (error) => {
      console.error('❌ 요청 인터셉터 에러:', error);
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터
  apiClient.interceptors.response.use(
    (response) => {
      // 응답 시간 계산 (디버깅용)
      const endTime = new Date();
      const duration = endTime - response.config.metadata?.startTime;
      
      // 개발 환경에서 응답 로그
      if (import.meta.env.DEV) {
        console.log(`✅ API 응답: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`, {
          status: response.status,
          data: response.data,
        });
      }
      
      // 한국관광공사 API 응답 구조 확인
      if (response.data?.response?.header) {
        const { resultCode, resultMsg } = response.data.response.header;
        
        if (resultCode !== '0000') {
          const error = new Error(`TourAPI 에러: ${resultMsg} (코드: ${resultCode})`);
          error.tourApiError = true;
          error.resultCode = resultCode;
          throw error;
        }
      }
      
      return response.data;
    },
    (error) => {
      // 응답 시간 계산 (에러 시에도)
      const endTime = new Date();
      const duration = error.config?.metadata ? endTime - error.config.metadata.startTime : 0;
      
      // 개발 환경에서 에러 로그
      if (import.meta.env.DEV) {
        console.error(`❌ API 에러: ${error.config?.method?.toUpperCase() || 'UNKNOWN'} ${error.config?.url || 'UNKNOWN'} (${duration}ms)`, {
          status: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });
      }
      
      // 에러 메시지 통일
      let errorMessage = '데이터를 가져오는데 실패했습니다.';
      
      if (error.response) {
        // 서버 응답이 있는 경우
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            errorMessage = data?.error || '잘못된 요청입니다.';
            break;
          case 404:
            errorMessage = '요청한 데이터를 찾을 수 없습니다.';
            break;
          case 429:
            errorMessage = 'API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
            break;
          case 500:
            errorMessage = '서버 내부 오류가 발생했습니다.';
            break;
          default:
            errorMessage = data?.error || `서버 에러 (${status})`;
        }
      } else if (error.request) {
        // 네트워크 에러
        errorMessage = '네트워크 연결을 확인해주세요.';
      }
      
      // 커스텀 에러 객체 생성
      const customError = new Error(errorMessage);
      customError.originalError = error;
      customError.status = error.response?.status;
      customError.isNetworkError = !error.response;
      
      return Promise.reject(customError);
    }
  );
};
