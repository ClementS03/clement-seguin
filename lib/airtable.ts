export type Product = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  price: number | null;
  category: string;
  status: string;
  buyUrl: string;
  imageUrl: string | null;
  videoUrl: string | null;
  gallery: string[];
  stack: string[];
  tags: string[];
  featured: boolean;
  stripeProductId: string;
  stripePriceId: string;
  downloadUrl: string;
  buyLinks: Array<{ label: string; url: string }>;
  features: string[];
  draft: boolean;
};

export type Project = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  status: string;
  type: string;
  url: string;
  mrr: number | null;
  users: number | null;
  imageUrl: string | null;
  stack: string[];
  featured: boolean;
  started: string;
};

type AirtableRecord = { id: string; fields: Record<string, unknown> };
type AirtableResponse = { records: AirtableRecord[]; offset?: string };

const API_KEY = process.env.AIRTABLE_API_KEY;
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const PRODUCTS_URL = () => `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent("Products")}`;

async function fetchAll(table: string, noCache = false): Promise<AirtableRecord[]> {
  if (!API_KEY || !BASE_ID) return [];

  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(table)}`);
    url.searchParams.set("sort[0][field]", "Sort");
    url.searchParams.set("sort[0][direction]", "asc");
    if (offset) url.searchParams.set("offset", offset);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${API_KEY}` },
      ...(noCache ? { cache: "no-store" } : { next: { revalidate: 3600 } }),
    });

    if (!res.ok) break;

    const data: AirtableResponse = await res.json();
    records.push(...data.records);
    offset = data.offset;
  } while (offset);

  return records;
}

const str = (v: unknown) => (typeof v === "string" ? v : "");
const num = (v: unknown): number | null => (typeof v === "number" ? v : null);
const bool = (v: unknown) => v === true;

function parseBuyLinks(raw: string): Array<{ label: string; url: string }> {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const pipeIdx = line.indexOf("|");
      if (pipeIdx > 0) {
        return { label: line.slice(0, pipeIdx).trim(), url: line.slice(pipeIdx + 1).trim() };
      }
      // Plain URL — derive label from domain
      try {
        const hostname = new URL(line).hostname.replace("www.", "");
        const label = hostname.split(".")[0];
        return { label: label.charAt(0).toUpperCase() + label.slice(1), url: line };
      } catch {
        return null;
      }
    })
    .filter((link): link is { label: string; url: string } => link !== null && link.url.startsWith("http"));
}
const strArr = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((s): s is string => typeof s === "string") : [];

function toProduct(r: AirtableRecord): Product {
  const f = r.fields;
  return {
    id: r.id,
    name: str(f.Name),
    slug: str(f.Slug),
    tagline: str(f.Tagline),
    description: str(f.Description),
    price: num(f.Price),
    category: str(f.Category),
    status: str(f.Status) || "Active",
    buyUrl: str(f["Buy URL"]),
    imageUrl: str(f["Image URL"]) || null,
    videoUrl: str(f["Video URL"]) || null,
    gallery: str(f["Gallery"]).split("\n").map(s => s.trim()).filter(Boolean),
    stack: strArr(f.Stack),
    tags: strArr(f.Tags),
    featured: bool(f.Featured),
    stripeProductId: str(f["Stripe Product ID"]),
    stripePriceId: str(f["Stripe Price ID"]),
    downloadUrl: str(f["Download URL"]),
    buyLinks: parseBuyLinks(str(f["Buy Links"])),
    features: str(f["Features"]).split("\n").map(s => s.trim()).filter(Boolean),
    draft: bool(f["Draft"]),
  };
}

function toProject(r: AirtableRecord): Project {
  const f = r.fields;
  return {
    id: r.id,
    name: str(f.Name),
    slug: str(f.Slug),
    tagline: str(f.Tagline),
    description: str(f.Description),
    status: str(f.Status) || "Building",
    type: str(f.Type),
    url: str(f.URL),
    mrr: num(f.MRR),
    users: num(f.Users),
    imageUrl: str(f["Image URL"]) || null,
    stack: strArr(f.Stack),
    featured: bool(f.Featured),
    started: str(f.Started),
  };
}

// Public boutique — hides drafts and archived
export async function getProducts(): Promise<Product[]> {
  const records = await fetchAll("Products");
  return records.map(toProduct).filter(
    (p) => !!p.name && !p.draft && p.status !== "Archived"
  );
}

export async function getProduct(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

// Admin — all products, no cache
export async function getProductsAdmin(): Promise<Product[]> {
  const records = await fetchAll("Products", true);
  return records.map(toProduct).filter((p) => !!p.name);
}

export async function getProductById(recordId: string): Promise<Product | null> {
  if (!API_KEY || !BASE_ID) return null;
  const res = await fetch(`${PRODUCTS_URL()}/${recordId}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const record: AirtableRecord = await res.json();
  return toProduct(record);
}

export async function getProjects(): Promise<Project[]> {
  const records = await fetchAll("Projects");
  return records.map(toProject).filter((p) => !!p.name && p.status !== "Sunset");
}

export async function getProject(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}

// ── Write helpers ─────────────────────────────────────────────────────────────

export type NewProduct = {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  featured: boolean;
  draft: boolean;
  stripeProductId: string;
  stripePriceId: string;
  buyUrl: string;
  downloadUrl: string;
  buyLinks: string;
  features: string;
};

export async function airtableCreateProduct(p: NewProduct): Promise<Product> {
  if (!API_KEY || !BASE_ID) throw new Error("Airtable credentials missing");

  const res = await fetch(PRODUCTS_URL(), {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        Name: p.name,
        Slug: p.slug,
        Tagline: p.tagline,
        Description: p.description,
        Price: p.price,
        Category: p.category || undefined,
        Draft: p.draft,
        "Buy URL": p.buyUrl || undefined,
        ...(p.imageUrl && { "Image URL": p.imageUrl }),
        Featured: p.featured,
        "Stripe Product ID": p.stripeProductId || undefined,
        "Stripe Price ID": p.stripePriceId || undefined,
        "Download URL": p.downloadUrl || undefined,
        "Buy Links": p.buyLinks || undefined,
        "Features": p.features || undefined,
      },
    }),
  });

  if (!res.ok) throw new Error(`Airtable create failed: ${await res.text()}`);
  return toProduct(await res.json() as AirtableRecord);
}

export type UpdateProductFields = {
  name?: string;
  slug?: string;
  tagline?: string;
  description?: string;
  price?: number;
  category?: string;
  imageUrl?: string;
  featured?: boolean;
  draft?: boolean;
  buyUrl?: string;
  stripeProductId?: string;
  stripePriceId?: string;
  downloadUrl?: string;
  buyLinks?: string;
  features?: string;
};

export async function airtableUpdateProduct(
  recordId: string,
  p: UpdateProductFields
): Promise<Product> {
  if (!API_KEY || !BASE_ID) throw new Error("Airtable credentials missing");

  const fields: Record<string, unknown> = {};
  if (p.name !== undefined) fields.Name = p.name;
  if (p.slug !== undefined) fields.Slug = p.slug;
  if (p.tagline !== undefined) fields.Tagline = p.tagline;
  if (p.description !== undefined) fields.Description = p.description;
  if (p.price !== undefined) fields.Price = p.price;
  if (p.category !== undefined) fields.Category = p.category;
  if (p.imageUrl !== undefined) fields["Image URL"] = p.imageUrl;
  if (p.featured !== undefined) fields.Featured = p.featured;
  if (p.draft !== undefined) fields.Draft = p.draft;
  if (p.buyUrl !== undefined) fields["Buy URL"] = p.buyUrl;
  if (p.stripeProductId !== undefined) fields["Stripe Product ID"] = p.stripeProductId;
  if (p.stripePriceId !== undefined) fields["Stripe Price ID"] = p.stripePriceId;
  if (p.downloadUrl !== undefined) fields["Download URL"] = p.downloadUrl;
  if (p.buyLinks !== undefined) fields["Buy Links"] = p.buyLinks;
  if (p.features !== undefined) fields["Features"] = p.features;

  const res = await fetch(`${PRODUCTS_URL()}/${recordId}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });

  if (!res.ok) throw new Error(`Airtable update failed: ${await res.text()}`);
  return toProduct(await res.json() as AirtableRecord);
}

export async function airtableDeleteProduct(recordId: string): Promise<void> {
  if (!API_KEY || !BASE_ID) throw new Error("Airtable credentials missing");

  const res = await fetch(`${PRODUCTS_URL()}/${recordId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (!res.ok) throw new Error(`Airtable delete failed: ${await res.text()}`);
}

// ── Projects ──────────────────────────────────────────────────────────────────

const PROJECTS_URL = () => `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent("Projects")}`;

export async function getProductByStripePriceId(stripePriceId: string): Promise<Product | null> {
  const records = await fetchAll("Products", true);
  const products = records.map(toProduct);
  return products.find((p) => p.stripePriceId === stripePriceId) ?? null;
}

export async function getProjectsAdmin(): Promise<Project[]> {
  const records = await fetchAll("Projects", true);
  return records.map(toProject).filter((p) => !!p.name);
}

export async function getProjectById(recordId: string): Promise<Project | null> {
  if (!API_KEY || !BASE_ID) return null;
  const res = await fetch(`${PROJECTS_URL()}/${recordId}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const record: AirtableRecord = await res.json();
  return toProject(record);
}

export type NewProject = {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  status: string;
  type: string;
  url: string;
  imageUrl: string;
  featured: boolean;
  mrr: number | null;
  users: number | null;
  started: string;
};

export async function airtableCreateProject(p: NewProject): Promise<Project> {
  if (!API_KEY || !BASE_ID) throw new Error("Airtable credentials missing");

  const res = await fetch(PROJECTS_URL(), {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        Name: p.name,
        Slug: p.slug,
        Tagline: p.tagline,
        Description: p.description,
        Status: p.status || "Building",
        Type: p.type || undefined,
        URL: p.url || undefined,
        ...(p.imageUrl && { "Image URL": p.imageUrl }),
        Featured: p.featured,
        ...(p.mrr !== null && { MRR: p.mrr }),
        ...(p.users !== null && { Users: p.users }),
        ...(p.started && { Started: p.started }),
      },
    }),
  });

  if (!res.ok) throw new Error(`Airtable create project failed: ${await res.text()}`);
  return toProject(await res.json() as AirtableRecord);
}

export type UpdateProjectFields = Partial<NewProject>;

export async function airtableUpdateProject(recordId: string, p: UpdateProjectFields): Promise<Project> {
  if (!API_KEY || !BASE_ID) throw new Error("Airtable credentials missing");

  const fields: Record<string, unknown> = {};
  if (p.name !== undefined) fields.Name = p.name;
  if (p.slug !== undefined) fields.Slug = p.slug;
  if (p.tagline !== undefined) fields.Tagline = p.tagline;
  if (p.description !== undefined) fields.Description = p.description;
  if (p.status !== undefined) fields.Status = p.status;
  if (p.type !== undefined) fields.Type = p.type;
  if (p.url !== undefined) fields.URL = p.url;
  if (p.imageUrl !== undefined) fields["Image URL"] = p.imageUrl;
  if (p.featured !== undefined) fields.Featured = p.featured;
  if (p.mrr !== undefined) fields.MRR = p.mrr;
  if (p.users !== undefined) fields.Users = p.users;
  if (p.started !== undefined) fields.Started = p.started;

  const res = await fetch(`${PROJECTS_URL()}/${recordId}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });

  if (!res.ok) throw new Error(`Airtable update project failed: ${await res.text()}`);
  return toProject(await res.json() as AirtableRecord);
}

export async function airtableDeleteProject(recordId: string): Promise<void> {
  if (!API_KEY || !BASE_ID) throw new Error("Airtable credentials missing");

  const res = await fetch(`${PROJECTS_URL()}/${recordId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (!res.ok) throw new Error(`Airtable delete project failed: ${await res.text()}`);
}
