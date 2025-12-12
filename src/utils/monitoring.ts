import * as Sentry from "sentry-expo";

let initialized = false;

export const initMonitoring = (dsn?: string) => {
  if (initialized || !dsn) return;
  Sentry.init({
    dsn,
    enableInExpoDevelopment: true,
    debug: __DEV__,
    tracesSampleRate: __DEV__ ? 0.0 : 0.1,
  });
  initialized = true;
};

export const captureError = (error: unknown, context?: Record<string, unknown>) => {
  if (!initialized) return;
  Sentry.Native.captureException(error, context);
};
