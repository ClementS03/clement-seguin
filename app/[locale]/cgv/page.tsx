// app/[locale]/cgv/page.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "CGV — Clément Seguin",
  description: "Conditions Générales de Vente — clement-seguin.fr",
  robots: { index: false, follow: false },
}

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }]
}

const UPDATED = "Mai 2026"

export default async function CGVPage({
  params: _params,
}: {
  params: Promise<{ locale: string }>
}) {
  return (
    <main className="min-h-screen bg-bg-base pt-24">
      <section className="section-padding">
        <div className="section-container max-w-2xl">
          <header className="mb-12">
            <div className="badge mb-6 inline-block">Légal</div>
            <h1 className="section-headline mb-4">Conditions Générales de Vente</h1>
            <p className="text-xs text-text-tertiary">Dernière mise à jour : {UPDATED}</p>
          </header>

          <div className="flex flex-col gap-10 text-text-secondary text-sm leading-relaxed">

            <section>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4 pb-3 border-b border-bg-border">
                1. Identité du vendeur
              </h2>
              <ul className="flex flex-col gap-2">
                <li><span className="text-text-primary font-medium">Nom :</span> Clément Seguin</li>
                <li><span className="text-text-primary font-medium">Statut :</span> Auto-entrepreneur</li>
                <li><span className="text-text-primary font-medium">SIRET :</span> <span className="text-accent">[NUMÉRO SIRET — à compléter]</span></li>
                <li><span className="text-text-primary font-medium">Adresse :</span> 9 rue Marie-Angèle Cléret, 03130 Montcombroux-les-Mines, France</li>
                <li><span className="text-text-primary font-medium">Email :</span> contact@clement-seguin.fr</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4 pb-3 border-b border-bg-border">
                2. Champ d&apos;application
              </h2>
              <p>
                Les présentes Conditions Générales de Vente (CGV) s&apos;appliquent à toutes les ventes de produits numériques (templates, ressources digitales, outils) réalisées via le site clement-seguin.fr. Elles régissent exclusivement les relations entre Clément Seguin et tout acheteur (ci-après « le Client ») qui procède à un achat sur le site.
              </p>
              <p className="mt-3">
                Toute commande passée sur le site implique l&apos;acceptation pleine et entière des présentes CGV.
              </p>
            </section>

            <section>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4 pb-3 border-b border-bg-border">
                3. Produits
              </h2>
              <p>
                Les produits proposés à la vente sont des produits numériques (fichiers téléchargeables, templates, ressources digitales). Les caractéristiques essentielles de chaque produit sont décrites sur la page produit correspondante.
              </p>
              <p className="mt-3">
                Clément Seguin se réserve le droit de modifier à tout moment le catalogue de produits disponibles. Les produits sont proposés dans la limite des stocks disponibles (pour les produits en accès limité) ou de manière illimitée (téléchargement numérique standard).
              </p>
            </section>

            <section>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4 pb-3 border-b border-bg-border">
                4. Prix
              </h2>
              <p>
                Les prix sont indiqués en euros (€) hors taxes (HT). Conformément à l&apos;article 293 B du Code général des impôts, Clément Seguin bénéficie du régime de franchise en base de TVA : la TVA n&apos;est pas applicable aux ventes réalisées. La mention « TVA non applicable — art. 293 B du CGI » figure sur toutes les factures.
              </p>
              <p className="mt-3">
                Clément Seguin se réserve le droit de modifier ses prix à tout moment. Les produits sont facturés sur la base des tarifs en vigueur au moment de la validation de la commande.
              </p>
            </section>

            <section>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4 pb-3 border-b border-bg-border">
                5. Commande et paiement
              </h2>
              <p>
                Les commandes sont passées directement sur le site. Le paiement s&apos;effectue en ligne via Stripe, prestataire de paiement sécurisé. Les moyens de paiement acceptés sont : carte bancaire (Visa, Mastercard, American Express) et tout moyen proposé par Stripe lors du paiement.
              </p>
              <p className="mt-3">
                La commande n&apos;est définitivement validée qu&apos;après confirmation du paiement par Stripe. Clément Seguin se réserve le droit d&apos;annuler ou de refuser toute commande en cas de litige avec le Client ou de suspicion de fraude.
              </p>
            </section>

            <section>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4 pb-3 border-b border-bg-border">
                6. Livraison — produits numériques
              </h2>
              <p>
                Les produits numériques sont livrés par voie électronique, immédiatement après confirmation du paiement. Un lien de téléchargement est envoyé à l&apos;adresse email fournie lors de la commande. En cas de non-réception, le Client est invité à vérifier ses courriers indésirables ou à contacter contact@clement-seguin.fr.
              </p>
            </section>

            <section>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4 pb-3 border-b border-bg-border">
                7. Droit de rétractation
              </h2>
              <p>
                Conformément à l&apos;article L.221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour les contenus numériques fournis sur un support immatériel dont l&apos;exécution a commencé avant la fin du délai de rétractation et après accord exprès préalable du consommateur.
              </p>
              <p className="mt-3">
                En procédant au paiement et en accédant au téléchargement, le Client reconnaît expressément renoncer à son droit de rétractation.
              </p>
              <p className="mt-3">
                Toutefois, en cas de produit défectueux ou non conforme à la description, le Client peut contacter contact@clement-seguin.fr pour trouver une solution amiable.
              </p>
            </section>

            <section>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4 pb-3 border-b border-bg-border">
                8. Garanties légales
              </h2>
              <p>
                Conformément aux articles L.217-4 et suivants du Code de la consommation et aux articles 1641 et suivants du Code civil, le Client bénéficie des garanties légales de conformité et des vices cachés pour les produits vendus. Dans le cadre de ces garanties, Clément Seguin s&apos;engage à remédier à tout défaut de conformité dans un délai raisonnable après notification du Client.
              </p>
            </section>

            <section>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4 pb-3 border-b border-bg-border">
                9. Responsabilité
              </h2>
              <p>
                Les produits numériques fournis sont destinés à un usage professionnel ou personnel par le Client. Clément Seguin ne saurait être tenu responsable des dommages directs ou indirects résultant de l&apos;utilisation des produits, au-delà de la valeur du produit acheté.
              </p>
              <p className="mt-3">
                Les produits numériques (templates, outils) sont fournis « tels quels ». Il appartient au Client de vérifier leur adéquation à ses besoins avant tout achat.
              </p>
            </section>

            <section>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4 pb-3 border-b border-bg-border">
                10. Propriété intellectuelle et licence d&apos;utilisation
              </h2>
              <p>
                L&apos;achat d&apos;un produit numérique confère au Client une licence d&apos;utilisation personnelle et non exclusive. Sauf mention contraire sur la page produit, le Client n&apos;est pas autorisé à revendre, redistribuer, sous-licencier ou exploiter commercialement les produits achetés.
              </p>
              <p className="mt-3">
                Clément Seguin reste l&apos;unique propriétaire des droits de propriété intellectuelle sur l&apos;ensemble des produits proposés.
              </p>
            </section>

            <section>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4 pb-3 border-b border-bg-border">
                11. Données personnelles
              </h2>
              <p>
                Les données collectées lors de la commande (nom, email) sont utilisées uniquement pour le traitement de la commande et l&apos;envoi du produit. Pour plus d&apos;informations, consulter la{" "}
                <a href="/privacy" className="text-accent hover:underline">Politique de confidentialité</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4 pb-3 border-b border-bg-border">
                12. Résolution des litiges
              </h2>
              <p>
                En cas de litige, le Client est invité à contacter Clément Seguin en premier lieu à l&apos;adresse contact@clement-seguin.fr afin de trouver une solution amiable. À défaut de résolution amiable, le litige sera soumis aux tribunaux compétents selon les règles de droit commun.
              </p>
              <p className="mt-3">
                Conformément à l&apos;article 14 du Règlement (UE) n°524/2013, la Commission Européenne met à disposition une plateforme de règlement en ligne des litiges :{" "}
                <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">ec.europa.eu/consumers/odr</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4 pb-3 border-b border-bg-border">
                13. Droit applicable
              </h2>
              <p>
                Les présentes CGV sont soumises au droit français. Tout litige relatif à leur interprétation ou exécution relève de la compétence exclusive des tribunaux français.
              </p>
            </section>

          </div>
        </div>
      </section>
    </main>
  )
}
