# Primer — clement-seguin.fr
_Dernière mise à jour : 2026-05-07_

## État actuel

Projet renommé (freelance-lp → clement-seguin, repo freelancer-ai → clement-seguin).
Décision prise de fusionner `indie-store` dans ce dépôt plutôt que de déployer deux sites séparés.
Branche `feat/fusion-boutique` à créer — aucun code de fusion écrit pour l'instant.
Package.json renommé, commit en attente (package.json stagé sur main).

## Blockers

- **Netlify** : le repo GitHub a été renommé, Netlify pointe encore probablement sur l'ancien nom.
  Chemin : Netlify dashboard → Site configuration → Build & deploy → Continuous deployment → Manage repository integration.
  Si pas de bouton rename → Unlink puis Re-link sur `ClementS03/clement-seguin`.
  Note : GitHub redirige automatiquement, les builds continuent à fonctionner en attendant.

## Next steps (dans l'ordre)

1. Clément confirme que Netlify est mis à jour
2. Push du commit de renommage sur `main` (juste le package.json)
3. Créer la branche `feat/fusion-boutique` depuis main
4. Phase 1 — Foundation : upgrade Next.js 15→16, migration Tailwind v3→v4, ajout shadcn/ui, Supabase, next-auth v5, LemonSqueezy
5. Phase 2 — Nouvelles pages : /boutique, /projets, /open, /uses
6. Phase 3 — Admin : /admin login + dashboard + CRUD
7. Phase 4 — LemonSqueezy : webhook + sync commandes
8. Merge sur main quand tout est validé en local

## Décisions récentes (2026-05-07)

- Fusionner indie-store dans clement-seguin.fr (pas deux sites séparés)
- **Supprimer i18n** → site 100% anglais, routing [lang]/ retiré, middleware simplifié
- Pages boutique/projets/open hors i18n — directement sous `app/`
- Creator OS et FreelanceOS : cards dans /projets uniquement, pas de LP dédiée sur clement-seguin.fr
- Creator OS : pas de Supabase séparé (30€/mois) jusqu'à traction réelle
- **LP + navbar à revoir** : hero repositionné freelance + créateur, nouveaux liens nav (Projets, Boutique), section "Ce que je construis" sur la homepage
- Pas de co-auteur Anthropic dans les commits
