// API 응답 기본 인터페이스
export interface ApiResponse<T> {
  success: boolean
  statusCode: number
  message: string
  data: T | null
}

// Auth 관련 DTO - 인터페이스로 변경
export interface AuthCreateTokenDTO {
  accessToken: string
  refreshToken: string
}

// 응답 타입 정의
export type CreateTokenResponse = ApiResponse<AuthCreateTokenDTO>
export type VerifyTokenResponse = ApiResponse<boolean>
export type EmailResponse = ApiResponse<string>
export type LogoutResponse = ApiResponse<void>

// 요청 DTO
export interface LoginDto {
  email: string
  password: string
}

// 백엔드 DTO에 맞게 수정
export interface UserRegisterRequestDto {
  email: string
  is_email_subscribed: boolean
  is_email_verified: boolean
}

// 이메일 요청 DTO
export interface UserEmailRequestDto {
  email: string
}
