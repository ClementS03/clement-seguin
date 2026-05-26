import type { Metadata } from "next";
import { getContent } from "@/lib/i18n";
import { Hero } from "@/components/sections/Hero";
import { CaseStudy } from "@/components/sections/CaseStudy";
import { Problem } from "@/components/sections/Problem";
import { Process } from "@/components/sections/Process";
import { Works } from "@/components/sections/Works";
import { Offers } from "@/components/sections/Offers";
import { Testimonials } from "@/components/sections/Testimonials";
import { About } from "@/components/sections/About";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";

export const metadata: Metadata = {
  alternates: { canonical: "https://clement-seguin.fr" },
  openGraph: { url: "https://clement-seguin.fr" },
};

export default function HomePage() {
  const c = getContent();

  return (
    <>
      <Hero content={c.hero} />
      <CaseStudy content={c.caseStudy} />
      <Problem content={c.problem} />
      <Process content={c.process} />
      <Works content={c.works} />
      <Offers content={c.offers} />
      <Testimonials content={c.testimonials} />
      <About content={c.about} />
      <FAQ content={c.faq} meta={c.meta} />
      <CTA content={c.cta} contactContent={c.contact} meta={c.meta} />
    </>
  );
}
