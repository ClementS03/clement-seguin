# Decisions — clement-seguin.fr
_Journal des décisions importantes avec date et raison._

---

## 2026-05-07 — Fusion indie-store dans clement-seguin.fr

**Décision :** Ne pas déployer indie-store comme site séparé. Fusionner tout dans clement-seguin.fr.

**Raison :** Clément est le brand — freelance ET créateur. Deux sites fragmentent l'audience, coûtent plus cher (domaine extra, Supabase extra), et créent de la charge cognitive. Pattern validé chez Pieter Levels, Adam Wathan, Tibo Louis-Lucas.

**Alternative rejetée :** Déployer indie-store.com ou clemstore.fr → domaine extra, Supabase extra, maintenance double.

---

## 2026-05-07 — Pages boutique/projets/open hors i18n

**Décision :** Créer ces pages à la racine de `app/` (pas sous `[lang]/`).

**Raison :** Les acheteurs de templates et les visiteurs de ces pages sont principalement des devs anglophones. L'i18n peut être ajoutée plus tard si le besoin se présente. Ajouter l'i18n maintenant complexifie l'architecture pour zéro valeur immédiate.

---

## 2026-05-07 — Pas de LP Creator OS / FreelanceOS sur clement-seguin.fr

**Décision :** Creator OS et FreelanceOS apparaissent comme cards dans `/projets` par défaut. Une page `/projets/[slug]` peut servir de mini LP (hero, features, waitlist) si le produit n'a pas encore son propre domaine. Pas de page dédiée hors `/projets/[slug]`.

**Raison :** Chaque produit a ou aura son propre domaine. Une LP standalone sur clement-seguin.fr est redondante. La page `/projets/[slug]` est le compromis : assez pour convertir sans créer une route dédiée.

---

## 2026-05-07 — Suppression i18n → site 100% anglais

**Décision :** Retirer le routing `[lang]/` et tout passer en anglais uniquement.

**Raison :** Avec la fusion boutique/projets, le site s'adresse aussi à des makers/devs internationaux. Maintenir deux JSON (fr + en) pour chaque page est une charge sans retour clair. English-only = moins de maintenance, audience plus large, cohérence avec les nouvelles pages déjà en anglais.

**Alternative rejetée :** Tout mettre en i18n (fr + en) pour toutes les pages → trop de charge pour un site solo.

**Impact technique :**
- Supprimer `app/[lang]/` → déplacer les pages sous `app/` directement
- Supprimer le middleware de détection de langue
- Supprimer les fichiers `data/fr/` et `data/en/` → un seul `data/content.json` en anglais
- Supprimer le switcher FR/EN dans la Navbar
- Mettre à jour les métadonnées SEO (lang="en" fixe)
- Blog Notion : supprimer la colonne `Language`, garder uniquement les articles EN

---

## 2026-05-07 — Refonte LP + navbar suite à la fusion

**Décision :** Adapter la homepage et la navigation pour refléter le double positionnement freelance + créateur.

**Raison :** Avec les pages /boutique, /projets, /open qui arrivent, la navbar et la LP actuelles ne racontent plus le bon story — elles ne montrent que le freelance.

**Ce qui change sur la LP :**
- Hero : repositionner pour refléter "freelance Webflow + créateur de produits"
- Section Offers : revoir les services/tarifs si évolution de l'offre
- Ajouter une section ou accroche vers /projets et /boutique (ex: "Ce que je construis")
- Footer : ajouter les nouveaux liens

**Ce qui change sur la navbar :**
- Ajouter liens : Projets, Boutique (et peut-être Open)
- Retirer le switcher FR/EN
- Revoir l'ordre des liens selon la nouvelle arborescence

**Arborescence cible :**
```
/                → Homepage (freelance + créateur)
/boutique        → Templates à vendre
/boutique/[slug] → Fiche produit
/projets         → Showcase build-in-public
/projets/[slug]  → Fiche projet
/open            → Métriques publiques
/uses            → Stack/outils
/blog            → Articles (ex /fr/blog)
/admin           → Interne uniquement
```

---

## 2026-05-07 — Upgrade Tailwind v3 → v4

**Décision :** Migrer Tailwind v3 (config.ts) vers Tailwind v4 (CSS-first) pendant la Phase 1.

**Raison :** indie-store est déjà sur v4. Plutôt que de rétro-porter les composants indie-store vers v3, on upgrade clement-seguin.fr. v4 est le futur, migration à faire tôt ou tard de toute façon.

---
