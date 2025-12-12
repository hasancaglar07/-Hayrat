'use client';

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getMessages, type Locale } from "@/i18n/config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AuthWidget({ locale, redirectTo }: { locale: Locale; redirectTo?: string }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const t = getMessages(locale);
  const inputId = useId();
  const helpId = useId();
  const statusId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error" | "loading">("idle");
  const [session, setSession] = useState<Session | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const hasRedirected = useRef(false);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  const resendLabel = locale === "tr" ? "Tekrar gönder" : locale === "ar" ? "أرسل مرة أخرى" : "Resend";
  const sendLinkLabel = locale === "tr" ? "Giriş linki gönder" : locale === "ar" ? "أرسل رابط الدخول" : "Send sign-in link";
  const googleLabel = locale === "tr" ? "Google ile devam et" : locale === "ar" ? "تابع باستخدام Google" : "Continue with Google";
  const orLabel = locale === "tr" ? "veya e-posta ile" : locale === "ar" ? "أو باستخدام البريد الإلكتروني" : "or use email";
  const emailLabel = locale === "tr" ? "E-posta adresi" : locale === "ar" ? "البريد الإلكتروني" : "Email address";
  const emailHelp =
    locale === "tr"
      ? "Şifre yok. E-postana tek kullanımlık giriş bağlantısı gönderiyoruz."
      : locale === "ar"
        ? "لا توجد كلمة مرور. سنرسل رابط تسجيل دخول لمرة واحدة إلى بريدك الإلكتروني."
        : "No password. We’ll email you a one-time sign-in link.";
  const sentHelp =
    locale === "tr"
      ? "Mailini açıp giriş bağlantısına tıkla. Bağlantıyı mümkünse aynı cihaz ve tarayıcıda aç."
      : locale === "ar"
        ? "أرسلنا رابط تسجيل الدخول إلى بريدك الإلكتروني. عند الضغط عليه سيتم تسجيل الدخول تلقائيًا."
        : "We sent you a sign-in link. Clicking it will sign you in automatically.";
  const sentHint =
    locale === "tr"
      ? "1–2 dakika bekle. Gelmediyse spam/junk klasörünü kontrol et veya tekrar gönder."
      : locale === "ar"
        ? "إذا لم يصلك، تحقق من البريد غير الهام أو أعد الإرسال."
        : "If you don’t see it, check spam or resend.";
  const changeEmailLabel =
    locale === "tr" ? "E-postayı değiştir" : locale === "ar" ? "غيّر البريد الإلكتروني" : "Change email";
  const genericError =
    locale === "tr"
      ? "Bir sorun oldu. Lütfen tekrar dene."
      : locale === "ar"
        ? "حدث خطأ. يرجى المحاولة مرة أخرى."
        : "Something went wrong. Please try again.";

  const isEmailValid = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const getFriendlyError = (message: string) => {
    const normalized = message.toLowerCase();
    if (normalized.includes("provider") && (normalized.includes("enabled") || normalized.includes("not enabled"))) {
      return locale === "tr"
        ? "Google ile giriş şu an hazır değil. Lütfen daha sonra dene."
        : locale === "ar"
          ? "تسجيل الدخول عبر Google غير متاح حاليًا. حاول لاحقًا."
          : "Google sign-in isn’t available right now. Please try again later.";
    }
    if (normalized.includes("rate") && normalized.includes("limit")) {
      return locale === "tr"
        ? "Çok sık denedin. Lütfen birkaç dakika sonra tekrar dene."
        : locale === "ar"
          ? "طلبات كثيرة جدًا. حاول مرة أخرى بعد بضع دقائق."
          : "Too many requests. Please try again in a few minutes.";
    }
    if (normalized.includes("network") || normalized.includes("fetch")) {
      return locale === "tr"
        ? "Bağlantı sorunu var. İnternetini kontrol edip tekrar dene."
        : locale === "ar"
          ? "مشكلة في الاتصال. تحقق من الإنترنت وحاول مرة أخرى."
          : "Network error. Check your connection and try again.";
    }
    return message || genericError;
  };

  useEffect(() => {
    let mounted = true;
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
    });
    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (session && redirectTo && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace(redirectTo);
    }
  }, [session, redirectTo, router]);

  useEffect(() => {
    if (status === "error") {
      emailInputRef.current?.focus();
      emailInputRef.current?.select();
    }
  }, [status]);

  const resolveNextPath = () => {
    return redirectTo?.startsWith("/") ? redirectTo : `/${locale}/app`;
  };

  const buildCallbackRedirectUrl = () => {
    const next = resolveNextPath();
    return `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
  };

  const signInWithGoogle = async () => {
    if (!supabase) return;
    setStatus("loading");
    setErrorMessage(null);
    const redirectToUrl = buildCallbackRedirectUrl();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectToUrl, skipBrowserRedirect: true },
    });
    if (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage(getFriendlyError(error.message));
      return;
    }
    if (data?.url) window.location.assign(data.url);
  };

  const signIn = async () => {
    if (!supabase) return;
    const cleanedEmail = email.trim();
    if (!isEmailValid(cleanedEmail)) {
      setStatus("error");
      setErrorMessage(locale === "tr" ? "Geçerli bir e-posta adresi yaz." : locale === "ar" ? "أدخل بريدًا إلكترونيًا صحيحًا." : "Enter a valid email.");
      return;
    }
    setStatus("loading");
    setErrorMessage(null);
    const emailRedirectTo = buildCallbackRedirectUrl();
    const { error } = await supabase.auth.signInWithOtp({
      email: cleanedEmail,
      options: { shouldCreateUser: true, emailRedirectTo },
    });
    if (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage(getFriendlyError(error.message));
    } else {
      setStatus("sent");
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setStatus("idle");
    setEmail("");
    router.replace(`/${locale}`);
    router.refresh();
  };

  if (session) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-background/85 px-4 py-3 shadow-sm backdrop-blur">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text-dark">{locale === "tr" ? "Giriş yapıldı" : locale === "ar" ? "تم تسجيل الدخول" : "Signed in"}</p>
          <p className="mt-0.5 truncate text-sm text-text-medium">{session.user?.email ?? t.nav.signIn}</p>
        </div>
        <button onClick={signOut} className="text-sm font-semibold text-primary hover:text-primary-dark">
          {t.nav.signOut}
        </button>
      </div>
    );
  }

  const primaryButtonLabel =
    status === "loading" ? t.auth.sending : status === "sent" ? resendLabel : sendLinkLabel;
  const inputPlaceholder =
    locale === "tr" ? "ornek@site.com" : locale === "ar" ? "name@example.com" : "you@example.com";
  const isBusy = status === "loading";
  const canSubmit = status === "sent" ? true : email.trim().length > 0;
  const describedBy = status === "idle" ? helpId : `${helpId} ${statusId}`;
  const showProviders = status !== "sent";

  return (
    <form
      className="space-y-4"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        signIn();
      }}
    >
      {showProviders ? (
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-12 w-full justify-center gap-3"
            disabled={isBusy}
            onClick={signInWithGoogle}
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.655 32.659 29.217 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.047 6.053 29.226 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
              <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 16.108 19.002 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.047 6.053 29.226 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
              <path fill="#4CAF50" d="M24 44c5.122 0 9.846-1.966 13.391-5.162l-6.191-5.238C29.207 35.091 26.715 36 24 36c-5.195 0-9.618-3.317-11.283-7.946l-6.522 5.026C9.505 39.556 16.227 44 24 44z"/>
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.793 2.227-2.231 4.118-4.103 5.6l.003-.002 6.191 5.238C36.958 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
            </svg>
            {googleLabel}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-sm font-semibold text-text-light">{orLabel}</span>
            </div>
          </div>
        </div>
      ) : null}

      <div>
        <label htmlFor={inputId} className="text-sm font-semibold text-text-dark">
          {emailLabel}
        </label>
        <p id={helpId} className="mt-1 text-sm text-text-medium">
          {emailHelp}
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <Input
            ref={emailInputRef}
            id={inputId}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoFocus
            placeholder={inputPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12"
            disabled={isBusy || status === "sent"}
            aria-invalid={status === "error"}
            aria-describedby={describedBy}
          />
          <Button type="submit" size="lg" className="h-12 w-full sm:w-auto" disabled={isBusy || !canSubmit}>
            {primaryButtonLabel}
          </Button>
        </div>
      </div>

      {status === "sent" ? (
        <div
          id={statusId}
          role="status"
          aria-live="polite"
          className="rounded-2xl border border-primary/15 bg-primary/5 px-5 py-4"
        >
          <p className="text-base font-semibold text-primary">{t.auth.sent}</p>
          <p className="mt-2 text-sm text-text-medium">{sentHelp}</p>
          <p className="mt-2 text-sm text-text-light">{sentHint}</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-text-dark truncate">{email}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setStatus("idle");
                setErrorMessage(null);
                queueMicrotask(() => emailInputRef.current?.focus());
              }}
              className="sm:shrink-0"
            >
              {changeEmailLabel}
            </Button>
          </div>
        </div>
      ) : null}

      {status === "error" ? (
        <div id={statusId} role="alert" aria-live="polite" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
          <p className="text-base font-semibold text-red-700">{t.auth.error}</p>
          <p className="mt-2 text-sm text-red-700">{errorMessage ?? genericError}</p>
        </div>
      ) : null}
    </form>
  );
}
