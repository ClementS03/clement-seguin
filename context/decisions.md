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

**Décision :** Creator OS et FreelanceOS apparaissent comme cards dans `/projets`, pas comme landing pages dédiées.

**Raison :** Chaque produit a ou aura son propre domaine. Une LP sur clement-seguin.fr est redondante et confuse. La page `/projets` est le bon endroit pour montrer "ce que je construis".

---

## 2026-05-07 — Upgrade Tailwind v3 → v4

**Décision :** Migrer Tailwind v3 (config.ts) vers Tailwind v4 (CSS-first) pendant la Phase 1.

**Raison :** indie-store est déjà sur v4. Plutôt que de rétro-porter les composants indie-store vers v3, on upgrade clement-seguin.fr. v4 est le futur, migration à faire tôt ou tard de toute façon.

---
