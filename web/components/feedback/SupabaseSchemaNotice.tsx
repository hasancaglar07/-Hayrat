import Link from "next/link";
import type { SchemaStatus } from "@/lib/data/schemaStatus";
import clsx from "clsx";

export function SupabaseSchemaNotice({ status, locale }: { status: SchemaStatus; locale: string }) {
  if (status.ok) return null;

  const title =
    status.reason === "missing_schema"
      ? "Supabase veritabanı şeması kurulu değil"
      : status.reason === "missing_env"
        ? "Supabase env eksik"
        : "Supabase bağlantı sorunu";

  const body =
    status.reason === "missing_schema"
      ? "Bu projede `profiles`, `reading_logs` gibi tablolar yok. Okuma kaydı ve puanlar bu yüzden çalışmaz."
      : status.reason === "missing_env"
        ? "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY (ve opsiyonel SERVICE ROLE) ayarlanmalı."
        : "Supabase sorgusu başarısız oldu; sunucu loglarına bakın.";

  return (
    <div className={clsx("panel rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-5")}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-base font-bold text-red-900">{title}</p>
          <p className="text-sm font-medium text-red-800">{body}</p>
          <div className="text-sm font-semibold text-red-900">
            Çözüm: Supabase SQL Editor’da `web/supabase/schema.sql` dosyasını çalıştır.
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <Link
              href={`/${locale}/app`}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-900 hover:bg-red-50"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              Yeniden dene
            </Link>
          </div>
          {"message" in status && status.message ? <div className="font-mono text-xs text-red-800">({status.message})</div> : null}
        </div>
      </div>
    </div>
  );
}

