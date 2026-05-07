# CLAUDE.md — Projet clement-seguin.fr

Référence complète du projet pour Claude. À lire en priorité avant toute modification.

---

## Identité

- **Nom :** Clément Seguin
- **Activité :** Webdesigner Webflow freelance + automatisations
- **Cible :** Coachs, consultants, thérapeutes francophones
- **Domaine :** clement-seguin.fr
- **Email :** hello@clement-seguin.fr
- **Hébergement :** Netlify (branche `main` → déploiement auto)
- **Repo GitHub :** ClementS03/clement-seguin

---

## Stack technique

- **Framework :** Next.js 15.5.14 — App Router, TypeScript
- **CSS :** Tailwind CSS v3 + classes custom dans `app/globals.css`
- **Fonts :** Instrument Serif (display) + DM Sans (body) via `next/font/google`
- **Email :** Resend (`app/api/contact/route.ts`)
- **CMS Blog :** Notion (via `lib/notion.ts`) — fallback JSON si token absent
- **i18n :** Routing `[lang]` manuel (fr/en) — middleware + JSON
- **Déploiement :** Netlify, rebuild automatique chaque jour à 8h

---

## Architecture fichiers

```
app/
  layout.tsx              ← Root layout : fonts, metadata globale, JSON-LD
  globals.css             ← Design system complet (variables CSS, composants)
  [lang]/
    layout.tsx            ← Layout par locale : metadata i18n, Navbar, Footer
    page.tsx              ← Homepage : assemble toutes les sections
    blog/
      page.tsx            ← Liste des articles
      [slug]/page.tsx     ← Article dynamique
    api/contact/route.ts  ← API Resend (formulaire de contact)

components/
  layout/
    Navbar.tsx            ← Nav responsive + switcher FR/EN
    Footer.tsx            ← Footer avec groupes de liens
    HtmlLangSetter.tsx    ← Client component : met à jour document.lang
  sections/
    Hero.tsx              ← SERVER COMPONENT — LCP element, 0 animation sur H1
    Problem.tsx
    Process.tsx
    Offers.tsx
    Testimonials.tsx
    About.tsx
    FAQ.tsx
    CTA.tsx               ← Formulaire de contact + lien Cal.com
    SocialProof.tsx       ← Marquee outils + bande de stats

data/
  fr/
    content.json          ← TOUT le texte FR — seul fichier à modifier pour le contenu
    posts.json            ← Articles de blog FR
  en/
    content.json          ← TOUT le texte EN
    posts.json            ← Articles de blog EN

lib/
  i18n.ts                 ← getContent(locale), getPosts(), localePath()
  notion.ts               ← Fetch articles depuis Notion (CMS blog)
  useScrollReveal.ts      ← Hook IntersectionObserver pour animations scroll
  utils.ts                ← cn() helper

public/
  favicon-source.svg      ← Source SVG du favicon (monogramme CS vert)
  icon-16/32/192/512.png  ← Favicons générés
  apple-touch-icon.png
  og-image.png            ← Image OG 1200×630
  manifest.webmanifest    ← PWA manifest

middleware.ts             ← Détection locale navigateur → redirect /fr ou /en
tailwind.config.ts        ← Variables couleurs + fonts (sync avec globals.css)
```

---

## Design system

### Couleurs (modifier dans `tailwind.config.ts` ET `app/globals.css`)

| Variable         | Valeur    | Usage                      |
| ---------------- | --------- | -------------------------- |
| `accent.DEFAULT` | `#2D9E6B` | CTAs, accents principaux   |
| `accent.hover`   | `#35B87C` | Hover state                |
| `teal.DEFAULT`   | `#4ECBA8` | Checkmarks, badges succès  |
| `bg.base`        | `#07080A` | Fond de page               |
| `bg.surface`     | `#0C0F0D` | Cards, panels              |
| `bg.elevated`    | `#141A15` | Inputs, éléments surélevés |
| `text.primary`   | `#EDF2ED` | Texte principal            |
| `text.secondary` | `#8A9A8B` | Texte atténué              |

### Fonts (modifier dans `tailwind.config.ts` + `app/layout.tsx` + `app/globals.css`)

- **Display :** Instrument Serif — headings, titres
- **Body :** DM Sans — UI, texte courant

### Classes CSS custom (dans `globals.css`)

```css
.btn-primary       /* CTA principal vert */
.btn-secondary     /* CTA secondaire transparent */
.badge-accent      /* Badge vert accent */
.badge-teal        /* Badge teal */
.card              /* Card de base */
.card-hover        /* Card avec hover effect */
.reveal            /* Classe de base pour animations scroll */
.text-gradient-hero  /* Gradient vert sur le H1 */
.text-gradient-step  /* Gradient vert sur les numéros de process */
.section-headline   /* H2 de section standard */
.section-subheadline /* Sous-titre de section standard */
.check-list        /* Liste avec flèches teal */
.input             /* Champ de formulaire */
.label             /* Label de formulaire */
```

---

## i18n — Comment ça marche

1. **Middleware** (`middleware.ts`) : détecte la langue du navigateur → redirige vers `/fr` ou `/en`
2. **Routing** : toutes les pages sont sous `app/[lang]/`
3. **Contenu** : tout vient de `data/[lang]/content.json` via `getContent(locale)`
4. **Switcher** : dans `Navbar.tsx`, le bouton FR/EN calcule l'URL alternate via `getAlternateLocale()` + `localePath()`

**Pour modifier le contenu :** uniquement dans `data/fr/content.json` et `data/en/content.json`.
**Ne jamais hardcoder de texte** dans les composants.

---

## Offres (tarifs actuels)

| Offre                   | Prix          | Délai       |
| ----------------------- | ------------- | ----------- |
| Site Express            | 1 500€ HT     | 5 jours     |
| Site + Lead Machine     | 3 500€ HT     | 7 jours     |
| Transformation Digitale | 8 000€ HT     | 10-14 jours |
| Maintenance mensuelle   | 150-300€/mois | —           |

---

## Formulaire de contact

- **Route :** `POST /api/contact`
- **Service :** Resend
- **From :** `onboarding@resend.dev` (temp) → à remplacer par `noreply@clement-seguin.fr` une fois le domaine vérifié dans Resend
- **Variables d'environnement requises :**
  - `RESEND_API_KEY` — clé API Resend
  - `CONTACT_EMAIL_TO` — email de réception (hello@clement-seguin.fr)
  - `NEXT_PUBLIC_SITE_URL` — https://clement-seguin.fr

---

## Blog — Workflow Notion (CMS)

Le blog est géré depuis **Notion**. Plus besoin de toucher aux JSON pour les articles.
Si `NOTION_TOKEN` n'est pas défini, le site utilise les fichiers `data/[lang]/posts.json` en fallback.

### Structure de la base Notion

**Nom des colonnes (à respecter exactement) :**

| Property name  | Type         | Notes                                |
| -------------- | ------------ | ------------------------------------ |
| `Title`        | Title        | Titre de l'article                   |
| `Slug`         | Text         | URL : `mon-article-seo`              |
| `Language`     | Select       | `fr` ou `en`                         |
| `Published`    | Checkbox     | ✅ = visible sur le site             |
| `Publish Date` | Date         | Publication automatique à cette date |
| `Excerpt`      | Text         | Description courte, 150-155 chars    |
| `Category`     | Select       | ex : `Stratégie web`, `Design & UX`  |
| `Read Time`    | Text         | ex : `5 min`                         |
| `Featured`     | Checkbox     | Affiche en grand en haut du blog     |
| `Tags`         | Multi-select | ex : `webflow`, `seo`, `coaching`    |

**Corps de l'article :** rédigé directement dans la page Notion avec des titres H2/H3 et des paragraphes.

**CTA spécial :** pour ajouter un bloc CTA dans l'article, utilise un **Callout** avec ce format exact :

```
> **CTA** Texte de l'appel à l'action | Label du bouton | /fr#contact
```

### Comment publier un article

1. Créer une nouvelle page dans la base Notion
2. Remplir toutes les colonnes (Title, Slug, Language, Excerpt, Category, Read Time, Tags)
3. Écrire le contenu avec des H2 et paragraphes
4. Mettre **Publish Date** à la date souhaitée
5. Cocher **Published** ✅
6. Le site rebuild automatiquement chaque matin à 8h → l'article apparaît le jour J

### Rebuild manuel

Si tu veux publier immédiatement : **Netlify dashboard → Deploys → Trigger deploy**

---

## SEO — Checklist par article

- [ ] `Slug` : kebab-case, contient le mot-clé principal
- [ ] `Title` : 50-60 caractères, mot-clé en début
- [ ] `Excerpt` : 150-155 caractères, inclut le mot-clé
- [ ] Corps : minimum 800 mots, 1 H2 toutes les 300 mots environ
- [ ] `Tags` : 3-5 tags pertinents
- [ ] `Featured` coché pour les articles piliers
- [ ] Bloc CTA en fin d'article obligatoire
- [ ] Article EN créé séparément avec `Language = en` et slug traduit

---

## Workflow blog automatisé (2 articles/semaine)

**Lundi + Jeudi, 15 min par article :**

1. Ouvrir une **nouvelle conversation Claude**
2. Coller le prompt ci-dessous avec le sujet du tableau
3. Claude génère le contenu structuré
4. Créer la page dans Notion, coller le contenu, remplir les champs
5. Cocher Published + mettre la Publish Date → c'est tout

---

### Prompt FR (nouvelle conversation Claude)

```
Tu es un expert SEO et copywriter spécialisé en webdesign pour indépendants.
Tu rédiges pour Clément Seguin, webdesigner Webflow freelance qui crée des sites
premium pour coachs, consultants et thérapeutes en France.

Sujet : [SUJET]
Mot-clé principal : [MOT-CLÉ]
Longueur cible : 900-1100 mots

Rédige l'article directement en Markdown avec cette structure :
- Un paragraphe d'introduction accrocheur (le mot-clé dans la 1ère phrase)
- 4 à 5 sections avec titres ## H2
- Un paragraphe de conclusion
- Un appel à l'action final au format : > **CTA** [texte] | Réserver un appel gratuit | /fr#contact

Donne-moi aussi, AVANT le contenu Markdown, ces métadonnées sur une seule ligne chacune :
SLUG: mon-slug-seo
EXCERPT: (150-155 caractères avec le mot-clé)
CATEGORY: (une parmi : Stratégie web / Design & UX / SEO / Automatisation / Business)
READ_TIME: X min
TAGS: tag1, tag2, tag3

Règles :
- Ton direct, expert, sans condescendance
- Tu parles AU coach/consultant, pas d'eux
- Pas de jargon technique
- Chaque H2 apporte une valeur concrète
- Le CTA final doit être naturel, pas agressif
```

---

### Prompt EN (traduire + adapter)

```
You are an SEO expert and copywriter specialized in web design for freelancers.
You write for Clément Seguin, a Webflow web designer who creates premium websites
for coaches, consultants and therapists.

Topic: [TOPIC]
Main keyword: [KEYWORD]
Target length: 900-1100 words

Write the article in Markdown with this structure:
- An engaging intro paragraph (keyword in the first sentence)
- 4 to 5 sections with ## H2 headings
- A conclusion paragraph
- A final CTA in this format: > **CTA** [text] | Book a free call | /en#contact

Also provide these metadata BEFORE the Markdown content, one per line:
SLUG: my-seo-slug
EXCERPT: (150-155 chars with the keyword)
CATEGORY: (one of: Web Strategy / Design & UX / SEO / Automation / Business)
READ_TIME: X min
TAGS: tag1, tag2, tag3

Rules:
- Direct, expert tone — no jargon
- Speak TO the coach/consultant, not about them
- Each H2 provides concrete value
- Natural CTA, not pushy
```

---

### Prompt : Générer des idées d'articles (mensuel)

À utiliser dans une nouvelle conversation Claude **une fois par mois** pour renouveler le planning éditorial.

```
Tu es un expert en content marketing et SEO pour les indépendants français.

Je suis Clément Seguin, webdesigner Webflow freelance. Je crée des sites premium
pour coachs, consultants et thérapeutes en France. Mon site : clement-seguin.fr

Génère-moi 8 idées d'articles de blog (4 FR + 4 EN) pour le mois prochain.

Contexte :
- Cible : coachs, consultants, thérapeutes indépendants en France
- Objectif : attirer du trafic SEO qualifié et convertir en demande de site web
- Sujets à couvrir : webdesign, SEO, automatisation, business en ligne, présence digitale
- Éviter les sujets trop techniques (lecteur non développeur)
- Tenir compte de la saison / actualité du mois : [MOIS ET ANNÉE]

Articles déjà publiés à ne pas répéter :
[LISTE DES SLUGS DÉJÀ EN LIGNE]

Pour chaque idée, donne-moi :
1. Titre FR (60 chars max)
2. Titre EN traduit
3. Mot-clé principal
4. Angle différenciateur (pourquoi cet article est meilleur que ce qui existe)
5. Type : Evergreen / Saisonnier / Actualité

Format : tableau Markdown, 8 lignes.
```

**Fréquence :** 1 fois par mois, en début de mois.
**Durée :** 5 min — copie le tableau dans Notion comme planning éditorial du mois.

---

### Idées de départ (8 semaines, 2/semaine)

| Semaine | Article FR                                       | Article EN                                   |
| ------- | ------------------------------------------------ | -------------------------------------------- |
| 1       | Pourquoi votre site Wix vous coûte des clients   | Why your Wix site is costing you clients     |
| 2       | Webflow vs WordPress pour un coach en 2025       | Webflow vs WordPress for coaches in 2025     |
| 3       | Le secret des sites de coachs qui convertissent  | The secret of coaching websites that convert |
| 4       | Combien coûte vraiment un site web professionnel | What does a professional website really cost |
| 5       | Comment rédiger une page À propos qui vend       | How to write an About page that sells        |
| 6       | Automatiser sa prise de RDV en 2025              | Automate your booking process in 2025        |
| 7       | Pourquoi le mobile est critique pour votre site  | Why mobile is critical for your website      |
| 8       | Comment transformer les visiteurs en clients     | How to turn website visitors into clients    |

---

## Variables d'environnement (Netlify)

```
NEXT_PUBLIC_SITE_URL=https://clement-seguin.fr
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_EMAIL_TO=hello@clement-seguin.fr
NOTION_TOKEN=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Comment obtenir les valeurs Notion :**

- `NOTION_TOKEN` → [notion.so/my-integrations](https://www.notion.so/my-integrations) → New integration → copier l'Internal Integration Token
- `NOTION_DB_ID` → URL de ta base Notion : `notion.so/**ABC123...**?v=...` → la partie avant le `?`
- Dans Notion : connecter l'intégration à la base via `...` → Connections

---

## Commandes utiles

```bash
npm run dev      # Dev local → localhost:3000
npm run build    # Build de prod (test avant push)
npm run lint     # Lint TypeScript
```

---

## Règles importantes pour Claude

1. **Ne jamais hardcoder de texte** dans les composants — tout passe par les JSON
2. **Ne jamais utiliser d'inline styles** avec des couleurs — utiliser les classes CSS de `globals.css`
3. **Hero.tsx est un Server Component** (pas de `"use client"`) — ne pas changer
4. **Toujours modifier les 2 JSON** (fr + en) quand on change du contenu
5. **Tester le build** (`npm run build`) avant de livrer des fichiers modifiés
6. **Ne donner que les fichiers qui changent** — pas tout le projet
7. **Pages hors i18n** (`/boutique`, `/projets`, `/open`, `/admin`) — NE PAS les mettre sous `[lang]/`
8. **Ne jamais mélanger shadcn/ui et classes custom** dans le même composant

---

## Règles de mémoire (OBLIGATOIRE)

- En début de session : lire `primer.md` → `memory.md` → `taskforlessons.md` AVANT de coder
- En fin de session : mettre à jour `primer.md` avec état actuel, blockers, next steps
- Après chaque commit : append dans `memory.md` (format : date / hash / changements / pourquoi)
- Quand Clément corrige : écrire une règle dans `taskforlessons.md`
- Contexte lourd → créer dans `context/` et référencer depuis `CLAUDE.md`

---

## Roadmap — Fusion indie-store (branche `feat/fusion-boutique`)

Décision du 2026-05-07 : fusionner le projet `indie-store` dans ce dépôt.
clement-seguin.fr devient le hub central : freelance + boutique + projets + métriques.

### Stack ajoutée (en cours)
- **Next.js 15 → 16.x** — upgrade
- **Tailwind v3 → v4** — migration CSS-first
- **shadcn/ui** — pour les nouvelles pages (boutique, admin)
- **Supabase** — produits, projets, commandes, waitlist
- **next-auth v5 beta** — admin seulement
- **LemonSqueezy** — paiement + webhook

### Nouvelles pages (hors i18n)
- `/boutique` + `/boutique/[slug]` — vente de templates
- `/projets` + `/projets/[slug]` — showcase build-in-public (Creator OS, FreelanceOS…)
- `/open` — métriques publiques
- `/uses` — stack/outils
- `/admin` — dashboard interne (auth next-auth)

### Ce qui NE change PAS
- Pages freelance sous `[lang]/` — intactes
- Blog Notion — intact
- Design system vert/sombre — conservé, étendu aux nouvelles pages

### Variables d'env à ajouter (Netlify + .env.local)
```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXTAUTH_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD=
LEMONSQUEEZY_WEBHOOK_SECRET=
LEMONSQUEEZY_API_KEY=
```

Voir `context/architecture.md` pour le schéma Supabase complet.
