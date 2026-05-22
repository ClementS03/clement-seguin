import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales — Clément Seguin",
  description: "Mentions légales du site clement-seguin.fr",
  robots: { index: false, follow: false },
};

const UPDATED = "Mai 2026";

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-bg-base pt-24">
      <section className="section-padding">
        <div className="section-container max-w-2xl">
          <header className="mb-12">
            <div className="badge mb-6 inline-block">Légal</div>
            <h1 className="section-headline mb-4">Mentions légales</h1>
            <p className="text-xs text-text-tertiary">Dernière mise à jour : {UPDATED}</p>
          </header>

          <div className="flex flex-col gap-10 text-text-secondary text-sm leading-relaxed">

            <section>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4 pb-3 border-b border-bg-border">
                1. Éditeur du site
              </h2>
              <ul className="flex flex-col gap-2">
                <li><span className="text-text-primary font-medium">Nom :</span> Clément Seguin</li>
                <li><span className="text-text-primary font-medium">Statut juridique :</span> <span className="text-accent">[AUTO-ENTREPRENEUR / SASU / EURL / — à compléter]</span></li>
                <li><span className="text-text-primary font-medium">SIRET :</span> <span className="text-accent">[NUMÉRO SIRET — à compléter]</span></li>
                <li><span className="text-text-primary font-medium">Adresse :</span> <span className="text-accent">[ADRESSE COMPLÈTE — à compléter]</span></li>
                <li><span className="text-text-primary font-medium">Email :</span> contact@clement-seguin.fr</li>
                <li><span className="text-text-primary font-medium">Téléphone :</span> <span className="text-accent">[NUMÉRO DE TÉLÉPHONE — à compléter]</span></li>
                <li><span className="text-text-primary font-medium">Directeur de la publication :</span> Clément Seguin</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4 pb-3 border-b border-bg-border">
                2. Hébergeur
              </h2>
              <ul className="flex flex-col gap-2">
                <li><span className="text-text-primary font-medium">Société :</span> Netlify, Inc.</li>
                <li><span className="text-text-primary font-medium">Adresse :</span> 44 Montgomery Street, Suite 300, San Francisco, California 94104, États-Unis</li>
                <li><span className="text-text-primary font-medium">Site :</span> <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">netlify.com</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4 pb-3 border-b border-bg-border">
                3. Propriété intellectuelle
              </h2>
              <p>
                L&apos;ensemble du contenu de ce site (textes, images, graphismes, code source, structure) est la propriété exclusive de Clément Seguin, sauf mentions contraires. Toute reproduction, représentation, modification ou exploitation, totale ou partielle, de ce contenu, par quelque procédé que ce soit, sans autorisation écrite préalable est interdite et constituerait une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
              </p>
            </section>

            <section>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4 pb-3 border-b border-bg-border">
                4. Liens hypertextes
              </h2>
              <p>
                Le site clement-seguin.fr peut contenir des liens vers des sites tiers. Ces liens sont proposés à titre informatif. Clément Seguin n&apos;exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu, leurs pratiques en matière de données personnelles ou leur disponibilité.
              </p>
            </section>

            <section>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4 pb-3 border-b border-bg-border">
                5. Limitation de responsabilité
              </h2>
              <p>
                Les informations présentes sur ce site sont fournies à titre indicatif. Clément Seguin s&apos;efforce de maintenir ces informations à jour mais ne peut garantir leur exactitude, exhaustivité ou actualité. L&apos;utilisation de ces informations se fait sous la seule responsabilité de l&apos;utilisateur.
              </p>
            </section>

            <section>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4 pb-3 border-b border-bg-border">
                6. Données personnelles
              </h2>
              <p>
                Pour toute information sur le traitement de vos données personnelles, veuillez consulter notre{" "}
                <a href="/privacy" className="text-accent hover:underline">Politique de confidentialité</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4 pb-3 border-b border-bg-border">
                7. Droit applicable
              </h2>
              <p>
                Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.
              </p>
            </section>

          </div>
        </div>
      </section>
    </main>
  );
}
