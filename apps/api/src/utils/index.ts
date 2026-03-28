/**
 * Date 객체를 'YYYY-MM-DD' 형식의 문자열로 변환
 */
export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDateRange() {
  const now = new Date();

  // 1. 이전 달의 1일 구하기 (startDate)
  const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // 2. 이전 달의 마지막 날 구하기 (endDate)
  // 날짜를 '0일'로 설정하면 자동으로 이전 달의 마지막 날
  const endDate = new Date(now.getFullYear(), now.getMonth(), 0);

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
}

export function is13DigitNumber(input) {
  const regex = /^\d{13}$/;
  return regex.test(String(input));
}

// --- 테스트 예시 ---
//  console.log(is13DigitNumber("1234567890123"));true (문자열)
// console.log(is13DigitNumber(1234567890123));   true (숫자)
