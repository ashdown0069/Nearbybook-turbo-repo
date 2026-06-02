// ============================================================
// ISBN-13 검증 유틸리티
// ============================================================

/** 검증 실패 사유 코드 */
export type ISBN13ErrorCode =
  | "EMPTY_INPUT" // 빈 문자열 또는 null/undefined
  | "INVALID_CHARS" // 숫자(0-9) 외 문자 포함
  | "INVALID_LENGTH" // 정제 후 길이가 13이 아님
  | "INVALID_PREFIX" // 978 또는 979로 시작하지 않음
  | "INVALID_CHECKSUM" // 체크 디짓 불일치

interface ISBN13Success {
  valid: true
  isbn: string
  prefix: string
  checkDigit: number
}

interface ISBN13Failure {
  valid: false
  code: ISBN13ErrorCode
  message: string
}

// Discriminated Union: valid 필드 값에 따라 Success/Failure 타입이 자동 추론됨
export type ISBN13Result = ISBN13Success | ISBN13Failure

const VALID_PREFIXES = ["978", "979"] as const
const ISBN13_LENGTH = 13

/**
 * 앞 12자리로 체크 디짓을 계산합니다.
 * 공식: (10 - (Σ(digit[i] × weight[i]) % 10)) % 10
 */
function calculateCheckDigit(digits: string): number {
  const sum = digits
    .slice(0, 12)
    .split("")
    .reduce(
      (acc, char, i) => acc + parseInt(char, 10) * (i % 2 === 0 ? 1 : 3),
      0
    )

  return (10 - (sum % 10)) % 10
}

function fail(code: ISBN13ErrorCode, message: string): ISBN13Failure {
  return { valid: false, code, message }
}

/**
 * ISBN-13 번호의 유효성을 검증합니다.
 * @param isbn - 검증할 ISBN 문자열 (숫자 13자리만 허용)
 * @returns 성공 시 파싱 정보, 실패 시 에러 코드와 메시지
 */
export function validateISBN13(isbn: string): ISBN13Result {
  if (!isbn || isbn.trim().length === 0) {
    return fail("EMPTY_INPUT", "ISBN을 입력해주세요.")
  }

  if (!/^\d+$/.test(isbn)) {
    return fail("INVALID_CHARS", "ISBN은 숫자만 입력 가능합니다.")
  }

  const cleaned = isbn

  if (cleaned.length !== ISBN13_LENGTH) {
    return fail(
      "INVALID_LENGTH",
      `ISBN-13은 정확히 13자리여야 합니다. (현재: ${cleaned.length}자리)`
    )
  }

  const prefix = cleaned.substring(0, 3)
  if (!VALID_PREFIXES.includes(prefix as (typeof VALID_PREFIXES)[number])) {
    return fail(
      "INVALID_PREFIX",
      `ISBN-13은 978 또는 979로 시작해야 합니다. (현재: ${prefix})`
    )
  }

  const expected = calculateCheckDigit(cleaned)
  const actual = parseInt(cleaned.charAt(12), 10)

  if (expected !== actual) {
    return fail(
      "INVALID_CHECKSUM",
      `유효하지 않은 ISBN입니다. 번호를 다시 확인해주세요.`
    )
  }

  return { valid: true, isbn: cleaned, prefix, checkDigit: actual }
}

/** boolean 반환 래퍼 */
export function isValidISBN13(isbn: string): boolean {
  return validateISBN13(isbn).valid
}
