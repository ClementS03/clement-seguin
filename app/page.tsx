import { getContent } from "@/lib/i18n";
import { Hero } from "@/components/sections/Hero";
import { TechLogos, StatsStrip } from "@/components/sections/SocialProof";
import { Problem } from "@/components/sections/Problem";
import { Process } from "@/components/sections/Process";
import { Works } from "@/components/sections/Works";
import { Offers } from "@/components/sections/Offers";
import { Testimonials } from "@/components/sections/Testimonials";
import { About } from "@/components/sections/About";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";

export default function HomePage() {
  const c = getContent();

  return (
    <>
      <Hero content={c.hero} />
      <TechLogos label={c.logosBar.label} />
      <Problem content={c.problem} />
      <StatsStrip />
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
