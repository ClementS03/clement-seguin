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

async function fetchAll(table: string): Promise<AirtableRecord[]> {
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
      next: { revalidate: 3600 },
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

export async function getProducts(): Promise<Product[]> {
  const records = await fetchAll("Products");
  return records.map(toProduct).filter((p) => !!p.name && p.status !== "Archived");
}

export async function getProduct(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getProjects(): Promise<Project[]> {
  const records = await fetchAll("Projects");
  return records.map(toProject).filter((p) => !!p.name && p.status !== "Sunset");
}

export async function getProject(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}
