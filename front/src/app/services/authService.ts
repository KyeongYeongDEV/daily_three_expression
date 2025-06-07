import api from "@/lib/api"

export interface SendEmailVerificationRequest {
  email: string
}

export interface VerifyEmailCodeRequest {
  email: string
  code: string
}

export interface RegisterUserRequest {
  email: string
  // 필요한 다른 필드들 추가
}

export interface LoginRequest {
  email: string
  password: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

class AuthService {
  // 이메일 인증 코드 전송
  async sendEmailVerificationCode(email: string): Promise<ApiResponse> {
    try {
      const response = await api.post("/auth/email/code/send", { email })
      return {
        success: true,
        data: response.data,
        message: "인증 코드가 전송되었습니다.",
      }
    } catch (error: any) {
      console.error("이메일 인증 코드 전송 실패:", error)
      return {
        success: false,
        error: error.response?.data?.message || "인증 코드 전송에 실패했습니다.",
      }
    }
  }

  // 이메일 인증 코드 확인
  async verifyEmailCode(email: string, code: string): Promise<ApiResponse> {
    try {
      const response = await api.post("/auth/email/code/verify", { email, code })
      return {
        success: true,
        data: response.data,
        message: "이메일 인증이 완료되었습니다.",
      }
    } catch (error: any) {
      console.error("이메일 인증 코드 확인 실패:", error)
      return {
        success: false,
        error: error.response?.data?.message || "인증 코드가 올바르지 않습니다.",
      }
    }
  }

  // 사용자 등록 (구독)
  async registerUser(userRegisterRequestDto: RegisterUserRequest): Promise<ApiResponse> {
    try {
      const response = await api.post("/user/signup", userRegisterRequestDto)
      return {
        success: true,
        data: response.data,
        message: "구독이 완료되었습니다.",
      }
    } catch (error: any) {
      console.error("사용자 등록 실패:", error)
      return {
        success: false,
        error: error.response?.data?.message || "구독 처리 중 오류가 발생했습니다.",
      }
    }
  }

  // 로그인
  async login(loginDto: LoginRequest): Promise<ApiResponse> {
    try {
      const response = await api.post("/auth/login", loginDto)

      // 토큰 저장
      if (response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken)
      }
      if (response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken)
      }

      return {
        success: true,
        data: response.data,
        message: "로그인이 완료되었습니다.",
      }
    } catch (error: any) {
      console.error("로그인 실패:", error)
      return {
        success: false,
        error: error.response?.data?.message || "로그인에 실패했습니다.",
      }
    }
  }

  // 로그아웃
  async logout(): Promise<ApiResponse> {
    try {
      await api.post("/auth/logout")

      // 로컬 스토리지에서 토큰 제거
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")

      return {
        success: true,
        message: "로그아웃이 완료되었습니다.",
      }
    } catch (error: any) {
      console.error("로그아웃 실패:", error)
      // 로그아웃 실패해도 로컬 토큰은 제거
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")

      return {
        success: false,
        error: error.response?.data?.message || "로그아웃 처리 중 오류가 발생했습니다.",
      }
    }
  }
}

export const authService = new AuthService()
