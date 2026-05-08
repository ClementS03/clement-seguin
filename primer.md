# Primer — clement-seguin.fr
_Dernière mise à jour : 2026-05-08_

## État actuel

**Phase 1a TERMINÉE** — i18n supprimée, site 100% anglais, build OK, PR #1 ouverte sur GitHub.
Branche active : `feat/fusion-boutique`.
Preview Netlify en cours (middleware fix pushé à 00:38, build devrait passer maintenant).

## Blockers

Aucun blocker actif. Attendre confirmation visuelle du preview Netlify sur PR #1 avant de passer à Phase 1b.

## Next steps (dans l'ordre)

1. ✅ ~~Renommage projet freelance-lp → clement-seguin~~
2. ✅ ~~Branche `feat/fusion-boutique` créée~~
3. ✅ ~~Phase 1a — Suppression i18n, site EN uniquement~~
4. **Phase 1b** — Migration Tailwind v3 → v4 (CSS-first, supprimer `tailwind.config.ts`)
5. **Phase 1c** — Ajout packages : shadcn/ui, Supabase, next-auth v5, LemonSqueezy
6. Phase 2 — Nouvelles pages : /boutique, /projets, /open, /uses
7. Phase 3 — Admin : /admin login + dashboard + CRUD
8. Phase 4 — LemonSqueezy : webhook + sync commandes
9. Refonte LP homepage + navbar (hero repositionné, liens Projets/Boutique)
10. Merge `feat/fusion-boutique` → `main` quand tout est validé

## Décisions actées

- Fusion indie-store dans clement-seguin.fr (pas deux sites séparés)
- Site 100% anglais, routing [lang]/ supprimé, `middleware.ts` supprimé
- Pages boutique/projets/open directement sous `app/`
- Creator OS / FreelanceOS : cards dans /projets, mini LP via /projets/[slug] si besoin
- Pas de co-auteur Anthropic dans les commits
- LP homepage + navbar à revoir en Phase 2 (hero, section "Ce que je construis", liens nav)
