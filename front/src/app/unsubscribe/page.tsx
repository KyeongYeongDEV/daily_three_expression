"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import axios from "axios" 

export default function UnsubscribePage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const token = searchParams.get("token")
  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;


  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null)

  useEffect(() => {
    if (!email || !token) {
      setMessage("유효하지 않은 구독 해지 링크입니다.")
      setIsSuccess(false)
    }
  }, [email, token])

  const handleUnsubscribe = async () => {
    if (!email || !token) {
      setMessage("이메일 또는 토큰 정보가 누락되었습니다.")
      setIsSuccess(false)
      return
    }

    setIsLoading(true)
    setMessage("")
    setIsSuccess(null)

    try {
      const response = await axios.post(
        `${NEXT_PUBLIC_API_URL}/user/email/unsubscribe`,
        { email, token }
      )

      if (response.data.success) {
        setMessage(response.data.message || "구독이 성공적으로 해지되었습니다.")
        setIsSuccess(true)
      } else {
        setMessage(response.data.error || "구독 해지 중 오류가 발생했습니다.")
        setIsSuccess(false)
      }
    } catch (error: any) {
      console.error("구독 해지 요청 실패:", error)
      setMessage("네트워크 오류가 발생했습니다. 다시 시도해주세요.")
      setIsSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <header className="w-full max-w-md bg-white rounded-t-xl shadow-md p-6 flex items-center justify-center mb-4">
        <img src="/logo.png" alt="하삼영 로고" className="w-8 h-8 object-contain mr-2" />
        <span className="text-2xl font-bold text-gray-800">하삼영</span>
      </header>

      <Card className="w-full max-w-md text-center shadow-lg">
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">하삼영 구독 해지</h1>

          {isSuccess === null && (
            <>
              <p className="text-gray-600 mb-4 leading-relaxed">
                해지하면 기술 질문을 더 이상 받아볼 수 없어요.
                <br />
                매일매일 구독을 해지하시겠습니까?
              </p>
              <Button
                onClick={handleUnsubscribe}
                disabled={isLoading || !email || !token}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-md"
              >
                {isLoading ? "해지 중..." : "구독 해지하기"}
              </Button>
            </>
          )}

          {isSuccess === true && (
            <div className="text-center py-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-800 mb-2">구독 해지 완료!</p>
              <p className="text-gray-600">{message}</p>
            </div>
          )}

          {isSuccess === false && (
            <div className="text-center py-6">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-800 mb-2">구독 해지 실패</p>
              <p className="text-red-600">{message}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <footer className="w-full max-w-md text-center text-gray-500 text-xs mt-4">
        © 2025 하삼영. All rights reserved.
      </footer>
    </div>
  )
}
