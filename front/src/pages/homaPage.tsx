import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleSendCode = async () => {
    setIsCodeSent(true);
  };

  const handleVerifyCode = async () => {
    setIsVerified(true);
  };

  const handleSubmit = async () => {
    alert("구독이 완료되었습니다!");
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-[#E6F3FF] px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
      <div className="max-w-screen-lg mx-auto flex flex-col items-center">
        {/* Header */}
        <header className="w-full py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-[#1E3A8A] font-bold text-2xl sm:text-3xl">ㅁㅅㅍ</h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <button className="text-gray-600 font-medium px-4 py-2 bg-white rounded shadow-sm">
              깃허브
            </button>
            <Button className="bg-[#84CCFF] text-white px-4 py-2 rounded hover:bg-[#5DB9FF]">
              무료 구독하기
            </Button>
          </div>
        </header>

        {/* Main */}
        <main className="w-full py-12">
          {/* Hero */}
          <section className="text-center mb-24 px-4 sm:px-6 md:px-12 lg:px-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug">
              패텬 영어 3문장을 <br className="block md:hidden" />
              메일로 보내드릴게요!
            </h2>
            <p className="text-gray-500 mt-4 text-sm sm:text-base md:text-lg leading-relaxed">
             출근길 지하철에서 하나씩 읽다보면<br />
              어느 순간 영어 실력이 향상되어 있을 거예요!
            </p>
            <div className="mt-8">
              <Button className="px-6 py-3 bg-[#84CCFF] text-white text-lg rounded-full hover:bg-[#5DB9FF]">
                무료 구독하기
              </Button>
            </div>
          </section>

          {/* Feature 1 */}
          <section className="flex flex-col md:flex-row items-center justify-between gap-10 mb-24 w-full px-4 sm:px-6 md:px-12 lg:px-20">
            <img
              src="/mail-illustration.png"
              alt="Mail Icon"
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32"
            />
            <div className="text-center md:text-left md:w-2/3">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold">
              <span className="text-[#5DB9FF]">매일</span> 아침 6시,
                <span className="text-[#5DB9FF]">3</span> 개의,
                <span className="text-[#5DB9FF]"> 패턴</span>영어를 보내드립니다!
              </h3>
              <p className="text-gray-600 mt-2 text-sm sm:text-base md:text-lg">
                바쁘기만한 현대 사회 영어 공부까지 하시기 힘드시죠?<br />
                하루에 3개의 패턴 표현만 익혀보세요!
              </p>
            </div>
          </section>

          

          {/* Email Form */}
          <section className="mt-20 bg-white rounded-2xl shadow-lg p-6 w-full max-w-md mx-auto space-y-4">
            <input
              type="email"
              placeholder="이메일 주소 입력"
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isCodeSent || isVerified}
            />
            {!isCodeSent && (
              <Button className="w-full bg-[#5DB9FF] text-white" onClick={handleSendCode}>
                인증 코드 받기
              </Button>
            )}
            {isCodeSent && !isVerified && (
              <>
                <input
                  type="text"
                  placeholder="인증 코드 입력"
                  className="w-full border border-gray-300 rounded px-4 py-2"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <Button className="w-full bg-[#5DB9FF] text-white" onClick={handleVerifyCode}>
                  코드 확인
                </Button>
              </>
            )}
            {isVerified && (
              <Button className="w-full bg-[#5DB9FF] text-white" onClick={handleSubmit}>
                발송받기
              </Button>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}