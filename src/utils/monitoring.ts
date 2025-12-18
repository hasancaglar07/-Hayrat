import * as Sentry from "@sentry/react-native";

let initialized = false;

export const initMonitoring = (dsn?: string) => {
  if (initialized || !dsn) return;
  Sentry.init({
    dsn,
    debug: __DEV__,
    tracesSampleRate: __DEV__ ? 0.0 : 0.1,
  });
  initialized = true;
};

export const captureError = (error: unknown, context?: Record<string, unknown>) => {
  if (!initialized) return;
  if (context) {
    Sentry.withScope((scope) => {
      scope.setContext("context", context as Record<string, any>);
      Sentry.captureException(error);
    });
    return;
  }
  Sentry.captureException(error);
};
