export const isIntegerString = (str: string) => {
  if (typeof str !== "string" || str.trim() === "") {
    return false;
  }

  // ^: 문자열의 시작
  // \d+: 하나 이상의 숫자(0-9)
  // $: 문자열의 끝
  const integerRegex = /^\d+$/;
  return integerRegex.test(str);
};
