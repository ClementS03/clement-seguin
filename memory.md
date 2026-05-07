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
**Impact :** Roadmap définie : 5 phases, branche `feat/fusion-boutique` à créer, upgrade Next.js + Tailwind v4 en premier.

---
