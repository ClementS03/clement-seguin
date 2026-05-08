# Lessons — clement-seguin.fr
_Règles apprises des corrections de Clément. Append-only._

---

## RÈGLE : Pages boutique/projets/open hors i18n
**POURQUOI :** Ces pages ciblent des devs/makers anglophones — l'i18n est inutile pour l'instant et complique l'architecture.
**FAIRE :** Créer ces routes directement sous `app/boutique/`, `app/projets/`, `app/open/`, `app/admin/`
**NE PAS FAIRE :** Les mettre sous `app/[lang]/boutique/` — ça casse le routing et crée des doublons inutiles.

---

## RÈGLE : Site en anglais uniquement — pas d'i18n
**POURQUOI :** Decision du 2026-05-07 de retirer le routing [lang]/. Le site s'adresse à une audience mixte (clients FR + makers/devs EN), l'anglais couvre les deux.
**FAIRE :** Toutes les pages directement sous `app/`, un seul fichier de contenu, lang="en" fixe.
**NE PAS FAIRE :** Recréer un routing [lang]/, ajouter un switcher de langue, maintenir des fichiers fr/ et en/ séparés.

---

## RÈGLE : Ne jamais laisser un middleware.ts vide sur Netlify
**POURQUOI :** Netlify (plugin @netlify/plugin-nextjs) essaie de bundler tout `middleware.ts` comme Edge Function. Un fichier avec `matcher: []` ou vide fait planter le build.
**FAIRE :** Supprimer complètement `middleware.ts` quand il ne fait rien. Le recréer seulement quand il a un vrai rôle (ex: protéger `/admin/*` avec next-auth).
**NE PAS FAIRE :** Laisser un `middleware.ts` avec `export const config = { matcher: [] }` — ça compile en local mais crashe sur Netlify.

---

## RÈGLE : Creator OS / FreelanceOS — cards par défaut, mini LP si justifié
**POURQUOI :** Ce sont des produits à part entière avec leurs propres domaines (prévus ou existants). Une LP complète sur clement-seguin.fr est rarement justifiée.
**FAIRE :** Par défaut, cards dans `/projets` avec status + bouton waitlist ou lien produit. Si un produit n'a pas encore son propre domaine ET qu'il a besoin de convertir, une page `/projets/[slug]` peut servir de mini LP (hero, features, waitlist form) — sans aller jusqu'à une LP standalone.
**NE PAS FAIRE :** Créer des pages `/creator-os` ou `/freelanceos` dédiées en dehors de `/projets/[slug]` sans discussion préalable.

---
