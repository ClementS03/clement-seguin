import { notFound } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = { robots: { index: false, follow: false } }

export function generateStaticParams() {
  return []
}

export default function ShopProductPage() {
  return notFound()
}
