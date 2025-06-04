import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: "유효한 이메일 주소를 입력해주세요." }, { status: 400 })
    }

    // 여기에 실제 이메일 구독 로직 추가
    // 예: 데이터베이스에 저장, 이메일 서비스 연동 등
    console.log("새로운 구독자:", email)

    // 성공 응답
    return NextResponse.json({ message: "구독이 완료되었습니다!" }, { status: 200 })
  } catch (error) {
    console.error("구독 처리 중 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
