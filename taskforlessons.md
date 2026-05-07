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

## RÈGLE : Ne jamais mettre de LP pour Creator OS ou FreelanceOS sur clement-seguin.fr
**POURQUOI :** Ce sont des produits à part entière avec leurs propres domaines (prévus ou existants). Une LP sur clement-seguin ne fait pas sens et dilue le propos du site.
**FAIRE :** Cards dans `/projets` avec status + lien vers le produit ou waitlist.
**NE PAS FAIRE :** Créer des pages `/creator-os` ou `/freelanceos` avec une LP complète ici.

---
