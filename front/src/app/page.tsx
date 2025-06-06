"use client"

import { useState, useEffect } from "react"
import { Mail, Clock, Star, CheckCircle, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import api from "@/lib/api"
import type { UserRegisterRequestDto } from "@/types/api.types"

export default function HomePage() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isCodeVerified, setIsCodeVerified] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [timeRemaining, setTimeRemaining] = useState(600) // 10분 = 600초
  const [timerActive, setTimerActive] = useState(false)

  // 타이머 관리
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (timerActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)
    } else if (timeRemaining === 0 && isCodeSent && !isCodeVerified) {
      // 시간이 만료되면 인증 코드 재요청 필요
      setError("인증 코드가 만료되었습니다. 새로운 코드를 요청해주세요.")
      setIsCodeSent(false)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [timerActive, timeRemaining, isCodeSent, isCodeVerified])

  // 타이머 포맷팅 (분:초)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const openSubscribeModal = () => {
    setIsModalOpen(true)
    setEmail("")
    setVerificationCode("")
    setIsCodeSent(false)
    setIsCodeVerified(false)
    setError("")
    setSuccessMessage("")
    setTimerActive(false)
    setTimeRemaining(600)
  }

  const handleSendVerification = async () => {
    if (!email) {
      setError("이메일을 입력해주세요.")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("유효한 이메일 주소를 입력해주세요.")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccessMessage("")

    try {
      console.log("API 요청 시작:", `${process.env.NEXT_PUBLIC_API_URL}/auth/email/code/send`)

      const response = await api.post("/auth/email/code/send", { email })

      console.log("API 응답:", response)
      console.log("응답 데이터:", response.data)
      console.log("응답 상태:", response.status)

      // 응답 상태가 200-299 범위이면 성공으로 처리
      if (response.status >= 200 && response.status < 300) {
        setIsCodeSent(true)
        setSuccessMessage("인증 코드가 전송되었습니다. 이메일을 확인해주세요.")
        // 타이머 시작
        setTimeRemaining(600) // 10분으로 리셋
        setTimerActive(true)
      } else {
        setError("인증 코드 전송에 실패했습니다.")
      }
    } catch (error: any) {
      console.error("이메일 인증 코드 전송 실패:", error)
      console.error("에러 응답:", error.response)
      console.error("에러 상태:", error.response?.status)
      console.error("에러 데이터:", error.response?.data)

      if (error.code === "ERR_NETWORK") {
        setError("백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.")
      } else if (error.response?.status === 0) {
        setError("네트워크 연결을 확인해주세요. CORS 설정이 필요할 수 있습니다.")
      } else if (error.response?.status >= 400 && error.response?.status < 500) {
        // 백엔드에서 발생하는 구체적인 에러 메시지 처리 (이미 가입된 이메일 체크 제거)
        const errorMessage = error.response?.data?.message || error.message

        if (errorMessage.includes("이메일 인증 코드 전송 실패")) {
          setError("이메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.")
        } else if (errorMessage.includes("이메일 인증 코드 전송 중 에러")) {
          setError("서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
        } else {
          setError(errorMessage || "요청 처리 중 오류가 발생했습니다.")
        }
      } else if (error.response?.status >= 500) {
        // 5xx 에러는 서버 에러
        setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
      } else {
        setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setError("인증 코드를 입력해주세요.")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccessMessage("")

    try {
      const response = await api.post("/auth/email/code/verify", {
        email,
        code: verificationCode,
      })

      console.log("인증 확인 응답:", response)

      // 응답 상태가 200-299 범위이면 성공으로 처리
      if (response.status >= 200 && response.status < 300) {
        setIsCodeVerified(true)
        setSuccessMessage("이메일 인증이 완료되었습니다.")
        // 인증 완료 시 타이머 중지
        setTimerActive(false)
      } else {
        setError("인증 코드가 올바르지 않습니다.")
      }
    } catch (error: any) {
      console.error("이메일 인증 코드 확인 실패:", error)

      if (error.code === "ERR_NETWORK") {
        setError("백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.")
      } else if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || error.message
        if (errorMessage.includes("인증 코드") && errorMessage.includes("올바르지 않")) {
          setError("인증 코드가 올바르지 않습니다.")
        } else if (errorMessage.includes("만료")) {
          setError("인증 코드가 만료되었습니다. 새로운 코드를 요청해주세요.")
          setIsCodeSent(false)
          setTimerActive(false)
        } else {
          setError("인증 코드가 올바르지 않거나 만료되었습니다.")
        }
      } else {
        setError(error.response?.data?.message || "네트워크 오류가 발생했습니다. 다시 시도해주세요.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubscribe = async () => {
    setIsLoading(true)
    setError("")
    setSuccessMessage("")

    try {
      // 백엔드 DTO에 맞게 수정: 이메일 인증 완료 + 구독 = 둘 다 true
      const userRegisterRequestDto: UserRegisterRequestDto = {
        email,
        is_email_verified: true, // 이메일 인증 완료
        is_email_subscribed: true, // 구독 신청
      }

      console.log("회원가입 요청 데이터:", userRegisterRequestDto)

      const response = await api.post("/user/signup", userRegisterRequestDto)

      console.log("구독 응답:", response)

      // 응답 상태가 200-299 범위이면 성공으로 처리
      if (response.status >= 200 && response.status < 300) {
        setIsSubscribed(true)
        setSuccessMessage("구독이 완료되었습니다! 내일 아침 6시부터 패턴 영어를 받아보세요.")
        // 모달은 성공 메시지를 보여준 후 자동으로 닫힘
        setTimeout(() => {
          setIsModalOpen(false)
        }, 2000)
      } else {
        setError("구독 처리 중 오류가 발생했습니다.")
      }
    } catch (error: any) {
      console.error("사용자 등록 실패:", error)
      console.error("에러 응답:", error.response)

      if (error.code === "ERR_NETWORK") {
        setError("백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.")
      } else if (error.response?.status === 400) {
        // 400 에러는 이미 가입된 회원으로 처리
        setError("이미 구독중인 이메일입니다.")
      } else {
        const errorMessage = error.response?.data?.message || error.message

        // 백엔드에서 발생하는 구체적인 에러 메시지 처리
        if (errorMessage.includes("이미 존재하는 회원")) {
          setError("이미 구독중인 이메일입니다.")
        } else if (errorMessage.includes("회원가입에 실패했습니다")) {
          setError("이미 구독중인 이메일입니다.")
        } else if (errorMessage.includes("이메일 인증이 필요합니다")) {
          setError("이메일 인증이 만료되었습니다. 인증 코드를 다시 요청해주세요.")
          // 인증 상태 초기화
          setIsCodeVerified(false)
          setIsCodeSent(false)
          setVerificationCode("")
          setTimerActive(false)
        } else if (errorMessage.includes("사용자 정보 저장 실패")) {
          setError("서버에서 정보 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
        } else if (error.response?.status === 409) {
          setError("이미 구독중인 이메일입니다.")
        } else if (error.response?.status >= 500) {
          setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
        } else {
          setError(errorMessage || "네트워크 오류가 발생했습니다. 다시 시도해주세요.")
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-4 sm:py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img src="/logo.png" alt="하삼영 로고" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain" />
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">하삼영</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-[#84CCFF] transition-colors">
              서비스 소개
            </a>
            <a href="#sample-content" className="text-gray-600 hover:text-[#84CCFF] transition-colors">
              샘플 콘텐츠
            </a>
            <Button className="bg-[#84CCFF] hover:bg-[#6BB8FF] text-white" onClick={openSubscribeModal}>
              무료 구독하기
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-gray-600 hover:text-[#84CCFF] transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              <a
                href="#features"
                className="text-gray-600 hover:text-[#84CCFF] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                서비스 소개
              </a>
              <a
                href="#sample-content"
                className="text-gray-600 hover:text-[#84CCFF] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                샘플 콘텐츠
              </a>
              <Button
                className="bg-[#84CCFF] hover:bg-[#6BB8FF] text-white w-full sm:w-auto"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  openSubscribeModal()
                }}
              >
                무료 구독하기
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <img
              src="/logo.png"
              alt="하삼영 마스코트"
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto mb-4 sm:mb-6 object-contain"
            />
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight px-2">
            바쁜 현대 사회
            <br />
            <span className="text-[#84CCFF]">영어 공부할 시간 없는</span>
            <br />
            직장인과 학생들!
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-10 md:mb-12 leading-relaxed px-2">
            출근, 등교하며 하루에 3문장만 공부해보아요!
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            매일 아침 6시, 유용한 패턴 영어를 메일로 받아보세요.
          </p>

          <Card className="max-w-sm sm:max-w-md mx-auto mb-6 sm:mb-8 shadow-xl border border-gray-100">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-center mb-4 sm:mb-6">
                <Mail className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-[#84CCFF]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">매일 아침 6시</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">패턴 영어 3문장을 메일로 보내드립니다</p>

              <Button
                onClick={openSubscribeModal}
                className="w-full bg-[#84CCFF] hover:bg-[#6BB8FF] text-white py-2 sm:py-3 text-base sm:text-lg font-semibold"
              >
                무료로 시작하기
              </Button>
            </CardContent>
          </Card>

          <p className="text-xs sm:text-sm text-gray-500 px-4">✨ 완전 무료 • 언제든 구독 해지 가능 • 스팸 없음</p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-12 md:mb-16 px-2">
            왜 <span className="text-[#84CCFF]">하삼영</span>인가요?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <Card className="text-center border-2 border-gray-100 hover:border-[#84CCFF] transition-all duration-300 shadow-sm hover:shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <Clock className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-[#84CCFF] mx-auto mb-4 sm:mb-6" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">매일 아침 6시</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  출근길, 등교길에 딱 맞는 시간!
                  <br />
                  하루를 영어로 시작해보세요.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-gray-100 hover:border-[#84CCFF] transition-all duration-300 shadow-sm hover:shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <div className="text-4xl sm:text-5xl font-bold text-[#84CCFF] mb-4 sm:mb-6">3</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">딱 3문장</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  부담 없는 분량으로
                  <br />
                  꾸준히 학습할 수 있어요.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-gray-100 hover:border-[#84CCFF] transition-all duration-300 shadow-sm hover:shadow-lg sm:col-span-2 lg:col-span-1">
              <CardContent className="p-6 sm:p-8">
                <Star className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-[#84CCFF] mx-auto mb-4 sm:mb-6" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">실용적 패턴</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  일상에서 바로 쓸 수 있는
                  <br />
                  유용한 영어 패턴들만!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sample Content */}
      <section id="sample-content" className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-[#84CCFF]/10 to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-12 md:mb-16 px-2">
            이런 내용을 받아보세요!
          </h2>

          <div className="max-w-3xl mx-auto">
            <Card className="border-l-4 border-[#84CCFF] shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <h4 className="font-bold text-gray-800 mb-4 sm:mb-6 text-base sm:text-lg">
                  📧 오늘의 패턴 영어 (2025.06.04)
                </h4>
                <div className="space-y-4 sm:space-y-6 text-gray-700">
                  {/* Pattern 1 */}
                  <div className="bg-gray-50 p-4 sm:p-5 rounded-lg">
                    <p className="font-semibold text-lg sm:text-xl mb-2 text-gray-800">1. I'm sorry to hear that</p>
                    <p className="text-sm sm:text-base text-gray-600 mb-3">그 소식을 듣고 유감입니다</p>
                    <div className="space-y-2">
                      <p className="text-sm sm:text-base italic text-blue-700 bg-blue-50 p-2 rounded">
                        예 1: I'm sorry to hear that your dog is sick.
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 ml-2">
                        해석: 당신의 강아지가 아픈 걸 듣고 유감입니다.
                      </p>
                      <p className="text-sm sm:text-base italic text-blue-700 bg-blue-50 p-2 rounded">
                        예 2: I'm sorry to hear that you didn't get the job.
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 ml-2">
                        해석: 네가 그 일자리를 얻지 못한 걸 듣고 유감이야.
                      </p>
                    </div>
                  </div>

                  {/* Pattern 2 */}
                  <div className="bg-gray-50 p-4 sm:p-5 rounded-lg">
                    <p className="font-semibold text-lg sm:text-xl mb-2 text-gray-800">2. Would you mind if I...?</p>
                    <p className="text-sm sm:text-base text-gray-600 mb-3">...해도 될까요?</p>
                    <div className="space-y-2">
                      <p className="text-sm sm:text-base italic text-blue-700 bg-blue-50 p-2 rounded">
                        예 1: Would you mind if I open the window?
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 ml-2">해석: 창문을 열어도 될까요?</p>
                      <p className="text-sm sm:text-base italic text-blue-700 bg-blue-50 p-2 rounded">
                        예 2: Would you mind if I take a break?
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 ml-2">해석: 잠깐 쉬어도 될까요?</p>
                    </div>
                  </div>

                  {/* Pattern 3 */}
                  <div className="bg-gray-50 p-4 sm:p-5 rounded-lg">
                    <p className="font-semibold text-lg sm:text-xl mb-2 text-gray-800">3. How about we...?</p>
                    <p className="text-sm sm:text-base text-gray-600 mb-3">...하는 건 어때요?</p>
                    <div className="space-y-2">
                      <p className="text-sm sm:text-base italic text-blue-700 bg-blue-50 p-2 rounded">
                        예 1: How about we go for a walk?
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 ml-2">해석: 산책을 하는 건 어때요?</p>
                      <p className="text-sm sm:text-base italic text-blue-700 bg-blue-50 p-2 rounded">
                        예 2: How about we order a pizza?
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 ml-2">해석: 피자를 시켜 먹는 건 어때요?</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-[#84CCFF] to-blue-400 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 px-2">지금 시작하면 내일 아침부터!</h2>
          <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-12 opacity-90 px-2">
            하루 3문장으로 시작하는 영어 공부, 지금 바로 시작해보세요.
          </p>

          {!isSubscribed ? (
            <div className="max-w-md mx-auto px-4">
              <Button
                onClick={openSubscribeModal}
                className="bg-white text-[#84CCFF] hover:bg-gray-100 px-8 py-3 font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl"
              >
                구독하기
              </Button>
            </div>
          ) : (
            <div className="text-center px-4">
              <CheckCircle className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 mx-auto mb-4 sm:mb-6" />
              <p className="text-xl sm:text-2xl font-semibold mb-2">환영합니다! 🎉</p>
              <p className="text-base sm:text-lg opacity-90">내일 아침 6시에 첫 번째 메일을 받아보세요!</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <img src="/logo.png" alt="하삼영 로고" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
              <span className="text-lg sm:text-xl font-bold">하삼영</span>
            </div>

            <div className="text-center md:text-right">
              <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">하루 3개의 패턴 영어로 시작하는 영어 공부</p>
              <p className="text-gray-500 text-xs">© 2025 하삼영. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Subscription Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">하삼영 구독하기</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm border border-red-200">{error}</div>
            )}

            {successMessage && (
              <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4 text-sm border border-green-200">
                {successMessage}
              </div>
            )}

            {isSubscribed ? (
              <div className="text-center py-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-xl font-semibold text-gray-800 mb-2">구독 완료!</p>
                <p className="text-gray-600">내일 아침 6시에 첫 번째 메일을 받아보세요.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {!isCodeVerified ? (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        이메일 주소
                      </label>
                      <div className="flex gap-2">
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="example@email.com"
                          disabled={isCodeSent || isLoading}
                          className="flex-1"
                        />
                        {!isCodeSent && (
                          <Button
                            onClick={handleSendVerification}
                            disabled={isLoading}
                            className="bg-[#84CCFF] hover:bg-[#6BB8FF] text-white"
                          >
                            인증 코드 보내기
                          </Button>
                        )}
                      </div>
                    </div>

                    {isCodeSent && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label htmlFor="verificationCode" className="text-sm font-medium text-gray-700">
                            인증 코드
                          </label>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-gray-500 mr-1" />
                            <span
                              className={`text-sm font-medium ${timeRemaining < 60 ? "text-red-500" : "text-gray-500"}`}
                            >
                              {formatTime(timeRemaining)}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            id="verificationCode"
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="인증 코드 입력"
                            disabled={isLoading || timeRemaining === 0}
                            className="flex-1"
                          />
                          <Button
                            onClick={handleVerifyCode}
                            disabled={isLoading || timeRemaining === 0}
                            className="bg-[#84CCFF] hover:bg-[#6BB8FF] text-white"
                          >
                            인증 코드 확인
                          </Button>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">이메일로 전송된 6자리 인증 코드를 입력해주세요.</p>
                          <button
                            onClick={handleSendVerification}
                            disabled={isLoading || (timerActive && timeRemaining > 540)} // 9분 이상 남았을 때는 재전송 비활성화
                            className={`text-xs ${
                              isLoading || (timerActive && timeRemaining > 540)
                                ? "text-gray-400"
                                : "text-[#84CCFF] hover:underline"
                            }`}
                          >
                            코드 재전송
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    <Button
                      onClick={handleSubscribe}
                      disabled={isLoading}
                      className="bg-[#84CCFF] hover:bg-[#6BB8FF] text-white w-full"
                    >
                      구독하기
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
