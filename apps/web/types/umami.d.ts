interface UmamiTracker {
  track: {
    (event: string, data?: Record<string, string | number | boolean>): void;
    (customFunction: (props: Record<string, any>) => Record<string, any>): void;
  }
}

declare global {
  interface Window {
    umami?: UmamiTracker
  }
}

export {}
