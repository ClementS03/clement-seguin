# Spec — Repositionnement clement-seguin.fr

**Date :** 2026-07-19  
**Branche cible :** `feature/repositioning-fr-en`  
**Auteur :** Clément Seguin + Claude  
**Statut :** Approuvé — prêt pour implémentation

---

## Contexte

Repositionnement complet du site clement-seguin.fr. Le site passe d'un profil "indie hacker multi-projets" à une vitrine commerciale claire pour une offre unique : **création de sites web pour TPE/PME et indépendants** (praticiens santé/bien-être, artisans, cliniques). Acquisition 100% téléphone + visio — le site sert de preuve et réassurance, pas de canal d'acquisition principal.

**Proposition de valeur centrale :** Maquette gratuite avant paiement. Livraison en 5 jours. À partir de 1 500 €.

---

## Décisions architecturales

| Décision | Choix |
|---|---|
| i18n routing | `app/[locale]/` — `/` = FR (défaut), `/en/` = EN |
| Fichiers de contenu | `data/content.fr.json` + `data/content.en.json` |
| Switcher langue | Composant discret dans la navbar (FR / EN) |
| Pages désactivées | noindex + retrait nav/sitemap (code conservé) |
| Admin | Commenté, documenté dans `docs/admin-restoration.md` |
| Blog | Noindex + retiré de la nav (pas supprimé) |
| Portfolio | Works.tsx existant + enrichi avec projets de /projects |
| /about | Réécrite, rendue indexable |

---

## Structure de fichiers cible

```
app/
  [locale]/                    ← 'fr' (/) ou 'en' (/en/)
    layout.tsx                 ← navbar, footer, hreflang, lang attr, schema.org
    page.tsx                   ← Homepage
    about/page.tsx             ← À propos (réécrite, indexable)
    legal/page.tsx
    privacy/page.tsx
    cgv/page.tsx
    merci/page.tsx

    [NOINDEX — code conservé, routes retournent notFound()]
    blog/page.tsx              ← noindex, retiré sitemap + nav
    blog/[slug]/page.tsx       ← noindex
    shop/page.tsx              ← noindex + commenté
    shop/[slug]/page.tsx       ← noindex + commenté
    projects/page.tsx          ← noindex + commenté
    projects/[slug]/page.tsx   ← noindex + commenté
    open/page.tsx              ← noindex
    uses/page.tsx              ← noindex

    [COMMENTÉ]
    admin/                     ← commenté, doc dans docs/admin-restoration.md

  layout.tsx                   ← Root layout minimal (fonts, robots, manifest)
  robots.ts                    ← Mis à jour
  sitemap.ts                   ← Régénéré (FR + EN uniquement)
  not-found.tsx                ← Inchangé
  api/                         ← Inchangé (hors [locale]) — contact, newsletter, unsubscribe
                                  Les routes /api/admin/* et /api/webhooks/* restent commentées

middleware.ts                  ← RÉÉCRIT : 2 responsabilités
                                  1. Locale : / → rewrite interne vers /fr, /en/* → sert /en
                                  2. Admin : /admin/* → vérifie cookie admin_token (logique existante conservée)
data/
  content.fr.json              ← Tout le texte FR (langue principale)
  content.en.json              ← Tout le texte EN (TODO-REVIEW marqués)
lib/
  i18n.ts                      ← getContent(locale), getPosts(locale)
components/
  layout/
    Navbar.tsx                 ← + LocaleSwitcher intégré
    LocaleSwitcher.tsx         ← Nouveau composant FR / EN
    Footer.tsx                 ← Liens nettoyés (shop, projects, blog retirés)
```

---

## Pages désactivées

### Niveau 1 — Noindex + retrait nav/sitemap (routes actives)
- `/blog`, `/blog/[slug]` — metadata `robots: noindex,nofollow`
- `/open` — idem
- `/uses` — idem

### Niveau 2 — Retourne `notFound()` + noindex (routes inactives)
- `/shop`, `/shop/[slug]`
- `/projects`, `/projects/[slug]`

### Niveau 3 — Code commenté + documenté
- `/admin/*` → voir `docs/admin-restoration.md`

### /about — Changement inverse
- Passe de noindex → **indexable**
- Réécrite pour confiance client

---

## Redirections 301 (next.config.ts)

```
/fr              → /
/fr/:path*       → /:path*
/en/fr/:path*    → /en/:path*
/shop            → /
/shop/:path*     → /
/projects        → /
/projects/:path* → /
/open            → /
/uses            → /
/blog            → /
/blog/:path*     → /
/projets         → /          (existait déjà, conservé)
/projets/:path*  → /          (existait déjà, conservé)
/terms           → /cgv        (existait déjà, conservé)
```

---

## Structure homepage (sections dans l'ordre)

### 1 — Hero
- **Component :** `Hero.tsx` (réécriture copy, structure conservée)
- **Badge :** "Maquette gratuite avant paiement"
- **Titre :** "Un site qui vous ramène des clients."
- **Sous-titre :** "Vous voyez la maquette avant de payer. Livraison en 5 jours. À partir de 1 500 €."
- **CTA principal :** "Voir ma maquette gratuite" → `#contact` / Calendly
- **CTA secondaire :** "Voir les réalisations" → `#works`
- **Stats :** "5 jours" · "1 500 €" · "+20 sites livrés" `TODO-REVIEW`

### 2 — Pour qui
- **Component :** `CaseStudy.tsx` transformé en 3 cartes personas
- **Praticien santé & bien-être :** kinés, sophrologues, naturopathes, ostéos
  - "Vos patients cherchent quelqu'un comme vous sur Google. Votre site doit les convaincre en 10 secondes."
- **Artisan & commerçant local :** menuisiers, peintres, paysagistes, plombiers
  - "Vos concurrents ont un site Wix bancal. C'est votre chance de sortir du lot."
- **Clinique & cabinet médical** `TODO-REVIEW` : cabinets dentaires, centres bien-être, cliniques
  - "Une image premium rassure vos patients avant même le premier rendez-vous."

### 3 — Comment ça marche
- **Component :** `Process.tsx` (réécriture 3 étapes)
- **Étape 1 — Maquette offerte (Jour 1) :** "On se parle 30 minutes. Je conçois une maquette complète. Vous la voyez, vous la validez. Vous ne payez rien à cette étape."
- **Étape 2 — Vous validez, on ajuste (Jour 2-3) :** "Retours illimités jusqu'à ce que ce soit exactement ce que vous vouliez. Seulement après : vous confirmez et réglez."
- **Étape 3 — Livraison en 5 jours (Jour 4-5) :** "Site développé, hébergé, prêt à accueillir vos premiers visiteurs. Vous repartez avec les clés."

### 4 — Réalisations
- **Component :** `Works.tsx` (inchangé visuellement)
- **Titre :** "Des sites qui donnent envie d'appeler."
- **Sous-titre :** "Chaque projet livré en moins d'une semaine."
- **Contenu :** slider existant + projets récupérés depuis Airtable/Playwright

### 5 — Offres & prix
- **Component :** `Offers.tsx` (réécriture totale)
- **Site Vitrine — À partir de 1 500 €** : design sur mesure, 5-7 pages, formulaire contact, SEO de base, hébergement inclus 1 an, livraison 5 jours
- **Site Premium — 2 500 – 3 000 €** `TODO-REVIEW` : cliniques et cabinets, design haut de gamme, prise de RDV en ligne, galerie photos, pages multiples
- **Maintenance mensuelle — 40 €/mois** : hébergement, sauvegardes, modifications mineures, mises à jour sécurité, support réactif

### 6 — Témoignages
- **Component :** `Testimonials.tsx` (conservé tel quel)

### 7 — À propos (version courte)
- **Component :** `About.tsx` (réécriture courte)
- **Titre :** "Clément Seguin, webdesigner indépendant."
- **Texte :** "Je crée des sites pour des indépendants et TPE. Pas d'agence, pas d'intermédiaire — vous travaillez directement avec moi, du premier appel à la livraison." `TODO-REVIEW`
- **CTA :** "En savoir plus sur mon parcours" → `/about`

### 8 — FAQ
- **Component :** `FAQ.tsx` (réécriture)
- Q: Est-ce que je paie avant de voir le résultat ? → Non, maquette gratuite et sans engagement.
- Q: Qu'est-ce qui est inclus dans les 5 jours ? → Design + développement + mise en ligne + domaine + formulaire.
- Q: Je reste propriétaire de mon site ? → Oui, 100%.
- Q: Modifications après livraison ? → Incluses le 1er mois, ensuite 40 €/mois.
- Q: Je ne suis pas technique ? → C'est exactement pour vous que je travaille.

### 9 — CTA final
- **Component :** `CTA.tsx`
- **Titre :** "Votre maquette gratuite vous attend."
- **Sous-titre :** "30 minutes d'appel. Une maquette offerte. Aucun engagement."
- **CTA :** "Réserver un appel" → Calendly
- **Note :** "Ou par email : hello@clement-seguin.fr"

---

## SEO

### Hreflang (dans app/[locale]/layout.tsx)
```html
<link rel="alternate" hreflang="fr" href="https://clement-seguin.fr/"/>
<link rel="alternate" hreflang="en" href="https://clement-seguin.fr/en/"/>
<link rel="alternate" hreflang="x-default" href="https://clement-seguin.fr/"/>
```

### Meta FR
- **Title :** `Création de site web pour indépendants et TPE — maquette gratuite, livré en 5 jours`
- **Description :** `Site web professionnel pour praticiens, artisans et cliniques. Maquette offerte avant paiement. À partir de 1 500 €, livré en 5 jours.` `TODO-REVIEW`

### Meta EN
- **Title :** `Professional website for freelancers & SMBs — free mockup, delivered in 5 days`
- **Description :** `Premium websites for health practitioners, tradespeople and clinics. See your mockup before you pay. From €1,500, delivered in 5 days.` `TODO-REVIEW`

### Schema.org (JSON-LD dans app/[locale]/layout.tsx)
```json
{
  "@type": "ProfessionalService",
  "name": "Clément Seguin — Création de sites web",
  "url": "https://clement-seguin.fr",
  "email": "hello@clement-seguin.fr",
  "areaServed": "FR",
  "priceRange": "€€",
  "knowsLanguage": ["fr", "en"],
  "offers": [
    { "name": "Site Vitrine", "price": "1500", "priceCurrency": "EUR" },
    { "name": "Site Premium", "price": "2500", "priceCurrency": "EUR" },
    { "name": "Maintenance", "price": "40", "priceCurrency": "EUR" }
  ]
}
```

### Open Graph
- FR : `og:locale "fr_FR"`, image `/og-image.png` (à régénérer)
- EN : `og:locale "en_US"`, image `/og-image-en.png` `TODO-REVIEW`

### Sitemap (app/sitemap.ts)
```
/        weekly priority 1.0
/en/     weekly priority 0.9
/about   monthly priority 0.6
/en/about  monthly priority 0.5
```

### Actions manuelles post-merge
1. Soumettre le nouveau sitemap dans Google Search Console
2. Utiliser l'outil de retrait GSC pour : `/shop`, `/projects`, `/open`, `/uses`, `/blog` et leurs sous-routes

---

## Mentions légales — Placeholder EIK

Dans `content.fr.json` et `content.en.json` :
```json
"legal": {
  "company": "TODO-EIK — Clément Seguin (statut juridique à préciser)",
  "siret": "TODO-EIK",
  "address": "TODO-EIK"
}
```
Commentaire dans le code : `// TODO-EIK: remplacer quand structure juridique confirmée`

---

## LocaleSwitcher

- **Composant :** `components/layout/LocaleSwitcher.tsx` (nouveau)
- **Position :** intégré dans `Navbar.tsx`, côté droit, discret
- **Rendu :** `FR / EN` — langue active en `text-primary`, inactive en `text-secondary`
- **Comportement :** préserve le chemin courant en changeant le locale
  - Ex : `/about` → `/en/about`, `/en/about` → `/about`
- **Pas de cookie :** l'URL est la source de vérité

---

## Markers TODO

| Marker | Description |
|---|---|
| `TODO-REVIEW` | Mérite une relecture de Clément avant publication |
| `TODO-EIK` | À remplacer quand la structure juridique est confirmée |
| `TODO-PORTFOLIO` | Images/projets à ajouter dans Works.tsx |

---

## Ce qui NE change PAS

- API routes (`/api/contact`, `/api/newsletter`, `/api/unsubscribe`)
- Design system (couleurs, fonts, globals.css)
- Composant `Testimonials.tsx` (contenu conservé)
- Hébergement Netlify + rebuild automatique 8h
- Intégration Resend (formulaire de contact)
- Protection middleware admin (conservée, routes commentées)
