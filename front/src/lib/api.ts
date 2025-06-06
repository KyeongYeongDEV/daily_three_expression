import axios from "axios"

// API 기본 설정
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키 전송을 위해 추가
})

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // 필요시 토큰 추가
    const token = localStorage.getItem("accessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 응답 인터셉터 - 백엔드 응답 형식에 맞게 수정
api.interceptors.response.use(
  (response) => {
    // 백엔드 응답을 프론트엔드 형식에 맞게 변환
    if (response.data && typeof response.data === "object") {
      // 백엔드에서 success 필드가 없는 경우 성공으로 간주
      if (!response.data.hasOwnProperty("success")) {
        response.data = {
          success: true,
          data: response.data,
          message: "요청이 성공적으로 처리되었습니다.",
        }
      }
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // 401 에러 처리 (토큰 만료)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refreshToken")
        if (refreshToken) {
          const response = await api.post("/auth/reissue", {
            email: localStorage.getItem("userEmail"),
            refreshToken,
          })

          if (response.data.success && response.data.data?.accessToken) {
            const { accessToken } = response.data.data
            localStorage.setItem("accessToken", accessToken)

            // 원래 요청 재시도
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
            return api(originalRequest)
          }
        }
      } catch (refreshError) {
        // 리프레시 토큰도 만료된 경우 로그아웃 처리
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("userEmail")
        window.location.href = "/"
      }
    }

    return Promise.reject(error)
  },
)

export default api
