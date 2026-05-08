# Memory — clement-seguin.fr
_Historique append-only. Ne jamais supprimer ou modifier les entrées passées._

---

## [2026-05-07] — Renommage projet
**Changements :** Dossier `freelance-lp` → `clement-seguin`, repo GitHub `freelancer-ai` → `clement-seguin`, `package.json` name mis à jour, remote git mis à jour.
**Pourquoi :** Cohérence avec le domaine clement-seguin.fr. Préparation à la fusion indie-store.
**Impact :** Netlify à re-pointer manuellement (GitHub redirige automatiquement).

---

## [2026-05-07] — Décision architecture : fusion indie-store
**Changements :** Aucun code — décision stratégique documentée dans CLAUDE.md + primer.md.
**Pourquoi :** Éviter la fragmentation (2 sites perso, 2 domaines, 2 Supabase, charge cognitive). Un hub personnel sous son nom = meilleure stratégie long terme (pattern Pieter Levels, Adam Wathan, etc.).
**Impact :** Roadmap définie : 5 phases, branche `feat/fusion-boutique`, upgrade Tailwind v4 + suppression i18n en premier.

---

## [2026-05-07] — 337912a — Docs projet (renommage + 4 fichiers mémoire)
**Changements :** CLAUDE.md mis à jour (repo, roadmap fusion, règles mémoire). Création `primer.md`, `memory.md`, `taskforlessons.md`, `context/architecture.md`, `context/decisions.md`.
**Pourquoi :** Mise en place du système de mémoire webdesign-webflow pour la durabilité du contexte entre sessions.
**Impact :** Toutes les futures sessions Claude doivent lire ces fichiers en début de session.

---

## [2026-05-08] — 8b3688c — Phase 1a : suppression i18n
**Changements :** `app/[lang]/` supprimé, `middleware.ts` supprimé, `lib/i18n.ts` simplifié (plus de locale), `lib/notion.ts` locale retirée, `app/layout.tsx` mergé avec [lang]/layout (Navbar+Footer au root), `app/page.tsx` homepage directe, `app/blog/` déplacé à la racine, `data/content.json` + `data/posts.json` version EN unique, `data/fr/` + `data/en/` supprimés, `HtmlLangSetter` supprimé, Navbar sans switcher FR/EN, `Hero` + `StatsStrip` sans prop locale.
**Pourquoi :** Site 100% anglais, architecture simplifiée, préparation fusion indie-store.
**Impact :** URLs `/fr` et `/en` renvoient désormais 404 (attendu). Blog à `/blog/[slug]` au lieu de `/en/blog/[slug]`. Notion : colonne `Language` n'est plus filtrée.

---

## [2026-05-08] — 01a821e — Fix Netlify middleware
**Changements :** Suppression de `middleware.ts` (qui était vide avec `matcher: []`).
**Pourquoi :** Netlify essayait de bundler le middleware vide comme Edge Function → erreur de build.
**Impact :** Plus de middleware du tout. À recréer quand next-auth v5 sera ajouté (Phase 1c) pour protéger `/admin/*`.

---
