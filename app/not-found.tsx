import Link from "next/link";
import { getContent } from "@/lib/i18n";

export default function NotFound() {
  const c = getContent();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-bg-base">
      <p className="font-display text-[160px] text-text-primary/5 leading-none select-none">404</p>
      <h1 className="font-display text-3xl text-text-primary -mt-6 mb-3">{c.notFound.title}</h1>
      <p className="text-sm text-text-secondary mb-8 max-w-sm">{c.notFound.desc}</p>
      <Link href="/" className="btn-primary">{c.notFound.cta}</Link>
    </div>
  );
}
