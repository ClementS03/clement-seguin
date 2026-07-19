// app/[locale]/about/page.tsx
import type { Metadata } from "next"
import Image from "next/image"
import { getContent } from "@/lib/i18n"
import { CTA } from "@/components/sections/CTA"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clement-seguin.fr"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === "en"
  return {
    title: isEn ? "About — Clément Seguin" : "À propos — Clément Seguin",
    description: isEn
      ? "Web builder. Career-changer, nomad, based in Bansko, Bulgaria."
      : "Clément Seguin — webdesigner pour indépendants et TPE. Mon parcours, ma méthode.",
    robots: { index: true, follow: true },
    alternates: {
      canonical: isEn ? `${SITE_URL}/en/about` : `${SITE_URL}/about`,
      languages: {
        fr: `${SITE_URL}/about`,
        en: `${SITE_URL}/en/about`,
        "x-default": `${SITE_URL}/about`,
      },
    },
  }
}

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }]
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // TODO-TASK3: pass locale to getContent once Task 3 updates the signature
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = getContent() as any
  const isEn = locale === "en"

  return (
    <main className="min-h-screen bg-bg-base pt-24 pb-32">
      <div className="max-w-3xl mx-auto px-6">

        {/* ── Hero ── */}
        <section className="mb-24 flex flex-col md:flex-row gap-12 items-start">
          <div className="flex-1">
            <div className="badge-teal mb-6 inline-block">
              {isEn ? "About" : "À propos"}
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-text-primary leading-tight mb-5">
              {isEn ? (
                <>Web builder.<br />Career-changer, nomad,<br />based in Bansko.</>
              ) : (
                <>Webdesigner indépendant.<br />Basé à Bansko, Bulgarie.</>
              )}
            </h1>
            <p className="text-text-secondary text-lg leading-relaxed">
              {isEn
                ? "I build websites for businesses that need to look the part — fast, custom, and without the agency overhead."
                : "Je crée des sites web pour des indépendants et TPE. Pas d'agence, pas d'intermédiaire."}
            </p>
          </div>

          <div className="w-full md:w-64 h-80 flex-shrink-0 relative rounded-2xl overflow-hidden">
            <Image
              src="/about/portrait.webp"
              alt="Clément Seguin with his dog in Bansko"
              fill
              className="object-cover object-top"
              priority
            />
          </div>
        </section>

        {/* ── Story ── */}
        <section className="mb-20">
          <h2 className="font-display text-2xl text-text-primary mb-6">
            {isEn ? "Not the usual background." : "Un parcours atypique."}
          </h2>
          <div className="flex flex-col gap-5 text-text-secondary leading-relaxed">
            {isEn ? (
              <>
                <p>
                  I didn&apos;t study computer science. Until 2019, I was doing manual work — rope access technician, welder, general labour. Physical jobs, no desk, no screen. Then I decided to change everything.
                </p>
                <p>
                  I retrained at O&apos;clock, an online coding bootcamp, and learned HTML, CSS, JavaScript, PHP and React from scratch. Not the straightforward route — but it gave me a different perspective on what actually matters when you build things for real people.
                </p>
                <p>
                  I worked on a long WordPress mission for Cegid, a large French enterprise group, and used that time to travel across Europe by train. After that, I went deeper into design, Webflow, and kept building as a solo freelancer.
                </p>
                <p>
                  Eventually, I packed a bag, grabbed my dog, and hitchhiked from France to Bulgaria. I&apos;ve been based in Bansko ever since.
                </p>
              </>
            ) : (
              <>
                <p>
                  Avant de me lancer dans le webdesign, j&apos;ai travaillé plusieurs années dans le monde de l&apos;entreprise. J&apos;ai vu à quel point de nombreux indépendants talentueux — thérapeutes, artisans, consultants — perdaient des clients simplement parce que leur site ne reflétait pas la qualité de leur travail.
                </p>
                <p>
                  J&apos;ai décidé de changer ça. Aujourd&apos;hui, je crée des sites qui fonctionnent : qui rassurent un prospect avant le premier appel, qui convertissent des visiteurs en clients, dont vous êtes fier de montrer l&apos;adresse.
                </p>
                <p>
                  Ma méthode est simple : je vous montre la maquette avant que vous payiez le moindre euro. Vous validez, on ajuste, puis je livre en 5 jours. Pas de facture surprise, pas d&apos;attente de 3 mois.
                </p>
                <p>
                  {/* TODO-REVIEW: ajouter détails personnels si souhaité */}Je travaille directement avec chaque client — pas de designer junior, pas de sous-traitant. Quand vous m&apos;écrivez, c&apos;est moi qui réponds.
                </p>
              </>
            )}
          </div>
        </section>

        <div className="w-full h-72 mb-24 relative rounded-2xl overflow-hidden">
          <Image
            src="/about/bansko-wide.webp"
            alt="Clément and his dog looking over Bansko, Bulgaria"
            fill
            className="object-cover object-center"
          />
        </div>

        {/* ── How I work ── */}
        <section className="mb-20">
          <h2 className="font-display text-2xl text-text-primary mb-6">
            {isEn ? "How I work." : "Comment je travaille."}
          </h2>
          <div className="flex flex-col gap-5 text-text-secondary leading-relaxed">
            {isEn ? (
              <>
                <p>
                  Solo, direct, and accountable from start to finish. No project manager between us. No junior handling your brief while the senior is on another account. You talk to me — and I design, write, and build everything myself.
                </p>
                <p>
                  I work with businesses that need a professional site fast — not a 3-month agency project. The process is tight: brief, mockup approval, copywriting, development, launch. In 5 days for a standard project.
                </p>
                <p>
                  Mockup approved before development starts. Full copywriting included. You own everything at delivery — code, domain, content. No lock-in, no surprise invoices.
                </p>
              </>
            ) : (
              <>
                <p>
                  Solo, direct, et responsable de A à Z. Pas d&apos;intermédiaire, pas de junior qui gère votre brief pendant que le senior est sur un autre compte. Vous me parlez à moi — et je conçois, rédige et développe tout moi-même.
                </p>
                <p>
                  Je travaille avec des indépendants et des TPE qui ont besoin d&apos;un site professionnel rapidement — pas d&apos;un projet d&apos;agence sur 3 mois. Le process est cadré : brief, validation maquette, rédaction, développement, mise en ligne. En 5 jours pour un projet standard.
                </p>
                <p>
                  Maquette validée avant le développement. Rédaction complète incluse. Vous possédez tout à la livraison — code, domaine, contenu. Pas de dépendance, pas de facture surprise.
                </p>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {(isEn
              ? [
                  { value: "5d",   label: "Fastest delivery" },
                  { value: "100%", label: "You own everything" },
                  { value: "1",    label: "Person on your project" },
                  { value: "0",    label: "Surprise fees" },
                ]
              : [
                  { value: "5j",   label: "Livraison la plus rapide" },
                  { value: "100%", label: "Vous êtes propriétaire" },
                  { value: "1",    label: "Personne sur votre projet" },
                  { value: "0",    label: "Frais cachés" },
                ]
            ).map((stat) => (
              <div key={stat.label} className="card text-center py-6">
                <p className="font-display text-3xl gradient-text-accent mb-1">{stat.value}</p>
                <p className="text-text-tertiary text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Building ── */}
        <section className="mb-20">
          <h2 className="font-display text-2xl text-text-primary mb-6">
            {isEn ? "What I build for myself." : "Ce que je construis pour moi."}
          </h2>
          <div className="flex flex-col gap-5 text-text-secondary leading-relaxed">
            {isEn ? (
              <p>
                Alongside client work, I build my own products — tools I actually use to run my business day to day. It keeps me sharp, forces me to ship real software under real constraints, and means I build for clients the same way I build for myself: for production, not for portfolios.
              </p>
            ) : (
              <p>
                En parallèle du travail client, je construis mes propres produits — des outils que j&apos;utilise réellement pour gérer mon activité au quotidien. Ça me maintient en alerte, m&apos;oblige à livrer un vrai logiciel sous de vraies contraintes, et ça signifie que je construis pour mes clients de la même façon que pour moi-même : pour la production, pas pour un portfolio.
              </p>
            )}
          </div>
        </section>

        {/* ── Personal ── */}
        <section className="mb-24">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="w-full md:w-72 flex-shrink-0 flex flex-col gap-2">
              <div className="relative h-36 rounded-xl overflow-hidden">
                <Image
                  src="/about/bansko-day.webp"
                  alt="Bansko, Bulgaria — mountain panorama"
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div className="relative h-36 rounded-xl overflow-hidden">
                <Image
                  src="/about/bansko-sunset.webp"
                  alt="Bansko at sunset, mountains in the background"
                  fill
                  className="object-cover object-center"
                />
              </div>
            </div>

            <div className="flex flex-col gap-5 text-text-secondary leading-relaxed pt-2">
              {isEn ? (
                <>
                  <p>
                    When I&apos;m not building, I&apos;m somewhere in the mountains with my dog. Bansko has that — trails, silence, space to think. After years of city living and moving around, it&apos;s the right pace.
                  </p>
                  <p>
                    I speak French natively and English well enough to work with international clients. I&apos;m currently learning Russian.
                  </p>
                  <p>
                    Most of my clients are based in France, Belgium, and Switzerland — but I work with anyone, from anywhere, on projects that are worth doing.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Quand je ne travaille pas, je suis quelque part dans les montagnes avec mon chien. Bansko a ça — des sentiers, du silence, de l&apos;espace pour réfléchir. Après des années à vivre en ville et à bouger, c&apos;est le bon rythme.
                  </p>
                  <p>
                    Je parle français comme langue maternelle et anglais couramment pour travailler avec des clients internationaux.
                  </p>
                  <p>
                    La plupart de mes clients sont basés en France, en Belgique et en Suisse — mais je travaille avec tout le monde, de partout, sur des projets qui en valent la peine.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── Skills grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-24">
          {["Next.js / React", "Webflow", "Tailwind CSS", "Figma", "SEO technique", "Copywriting"].map((skill) => (
            <div key={skill} className="card px-4 py-3 text-sm text-text-secondary">{skill}</div>
          ))}
        </div>

      </div>

      {/* ── CTA ── */}
      <div className="mt-8">
        <CTA content={c.cta} contactContent={c.contact} meta={c.meta} />
      </div>
    </main>
  )
}
