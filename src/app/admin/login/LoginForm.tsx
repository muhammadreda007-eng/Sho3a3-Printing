"use client";

import { LockKeyhole, LoaderCircle, LogIn, Mail, TriangleAlert } from "lucide-react";
import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);
  return (
    <form action={formAction} className="mt-8 grid gap-5">
      <label className="grid gap-2 text-sm font-bold text-brand-deep">
        البريد الإلكتروني
        <span className="relative">
          <Mail className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input name="email" type="email" required autoComplete="email" dir="ltr" className="focus-ring h-12 w-full rounded-xl border border-line bg-brand-pale/50 pr-12 pl-4 text-right font-normal outline-none focus:border-brand" placeholder="admin@example.com" />
        </span>
      </label>
      <label className="grid gap-2 text-sm font-bold text-brand-deep">
        كلمة المرور
        <span className="relative">
          <LockKeyhole className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input name="password" type="password" required autoComplete="current-password" dir="ltr" className="focus-ring h-12 w-full rounded-xl border border-line bg-brand-pale/50 pr-12 pl-4 text-right font-normal outline-none focus:border-brand" />
        </span>
      </label>
      {state.error ? <p className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-700"><TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />{state.error}</p> : null}
      <button disabled={pending} className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 font-bold text-white transition hover:bg-brand-dark disabled:opacity-60">
        {pending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
        {pending ? "جارٍ تسجيل الدخول…" : "دخول لوحة التحكم"}
      </button>
    </form>
  );
}
