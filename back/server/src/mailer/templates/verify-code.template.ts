export function buildVerificationCodeTemplate(code: string): string {
  return `
      <div style="font-family: Arial, sans-serif; padding: 30px; background-color: #f5f5f5; border-radius: 8px; max-width: 400px; margin: auto;">
        <h2 style="color: #333;">🔐 이메일 인증 코드</h2>
        <p style="font-size: 16px;">아래 코드를 입력해주세요:</p>
        <div style="font-size: 32px; font-weight: bold; color: #007bff; text-align: center; margin: 20px 0;">${code}</div>
        <p style="font-size: 12px; color: gray;">이 코드는 발송 후 10분 동안 유효합니다.</p>
        <hr/>
        <p style="font-size: 10px; text-align: center; color: #999;">하삼영 | 하루 3개의 패턴 영어</p>
      </div>
    `;
}
