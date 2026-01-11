// hooks/useDebounce.ts
import { useRef, useCallback } from "react";

/**
 * 콜백 함수를 디바운스 처리하는 커스텀 훅
 * @param callback 실행할 함수
 * @param delay 지연 시간 (ms)
 */
export function useDebounce(callback: (...args: any[]) => void, delay: number) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: any[]) => {
      // 이전에 예약된 타이머가 있다면 취소 (드래그 중에는 계속 취소됨)
      if (timer.current) {
        clearTimeout(timer.current);
      }

      // 새로운 타이머 설정
      timer.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );
}
