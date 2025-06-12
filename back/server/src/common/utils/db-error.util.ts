//중복 에러 코드
export function isDuplicateKeyError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;

  const code = (err as any).code;
  // MySQL: ER_DUP_ENTRY = 1062, PostgreSQL: '23505'
  return code === '23505' || code === 'ER_DUP_ENTRY' || code === 1062;
}
