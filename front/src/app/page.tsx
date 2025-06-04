"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Clock, Users, Star, CheckCircle, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setIsSubscribed(true)
        setEmail("")
      } else {
        alert("구독 중 오류가 발생했습니다. 다시 시도해주세요.")
      }
    } catch (error) {
      alert("구독 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
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
            <a href="#testimonials" className="text-gray-600 hover:text-[#84CCFF] transition-colors">
              후기
            </a>
            <Button className="bg-[#84CCFF] hover:bg-[#6BB8FF] text-white">무료 구독하기</Button>
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
                href="#testimonials"
                className="text-gray-600 hover:text-[#84CCFF] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                후기
              </a>
              <Button className="bg-[#84CCFF] hover:bg-[#6BB8FF] text-white w-full sm:w-auto">무료 구독하기</Button>
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
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">패턴 영어 3문장을 메일로 보내드립니다</p>

              {!isSubscribed ? (
                <form onSubmit={handleSubscribe} className="space-y-3 sm:space-y-4">
                  <Input
                    type="email"
                    placeholder="이메일 주소를 입력하세요"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-center"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#84CCFF] hover:bg-[#6BB8FF] text-white py-2 sm:py-3 text-base sm:text-lg font-semibold"
                  >
                    {isLoading ? "구독 중..." : "무료로 시작하기"}
                  </Button>
                </form>
              ) : (
                <div className="text-center">
                  <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-green-600 font-semibold text-sm sm:text-base">
                    구독 완료! 내일 아침부터 받아보세요 📧
                  </p>
                </div>
              )}
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
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-[#84CCFF]/10 to-blue-50">
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

      {/* Stats Section */}
      <section id="testimonials" className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Users className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 text-[#84CCFF] mx-auto mb-6 sm:mb-8" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 px-2">
              이미 <span className="text-[#84CCFF]">1,247명</span>이 함께하고 있어요!
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 md:mb-12 px-2">
              매일 꾸준히 영어 실력을 늘려가는 사람들의 이야기
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-8 sm:mt-12 md:mt-16">
              <Card className="text-left shadow-lg border border-gray-100">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base md:text-lg leading-relaxed">
                    "출근길에 딱 3문장씩 보니까 부담 없고 좋아요. 한 달 만에 영어 말하기가 늘었어요!"
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">- 직장인 김○○님</p>
                </CardContent>
              </Card>

              <Card className="text-left shadow-lg border border-gray-100">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base md:text-lg leading-relaxed">
                    "매일 아침 6시에 오는 메일이 하루를 시작하는 좋은 루틴이 되었어요. 추천합니다!"
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">- 대학생 이○○님</p>
                </CardContent>
              </Card>
            </div>
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
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Input
                  type="email"
                  placeholder="이메일 주소"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 text-gray-800"
                  required
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-white text-[#84CCFF] hover:bg-gray-100 px-6 sm:px-8 font-semibold"
                >
                  {isLoading ? "구독 중..." : "구독하기"}
                </Button>
              </form>
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
    </div>
  )
}
