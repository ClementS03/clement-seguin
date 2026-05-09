const LS_BASE = "https://api.lemonsqueezy.com/v1"

function lsHeaders(): HeadersInit {
  return {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
    Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
  }
}

type LSError = { detail: string }
type LSResponse<T> = { data: T; errors?: LSError[] }

async function lsFetch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${LS_BASE}${path}`, {
    method: "POST",
    headers: lsHeaders(),
    body: JSON.stringify(body),
  })
  const json: LSResponse<T> = await res.json()
  if (!res.ok || json.errors?.length) {
    throw new Error(json.errors?.[0]?.detail ?? `LemonSqueezy API error on ${path}`)
  }
  return json.data
}

export async function lsCreateProduct(name: string, description: string): Promise<string> {
  const data = await lsFetch<{ id: string }>("/products", {
    data: {
      type: "products",
      attributes: { name, description },
      relationships: {
        store: {
          data: {
            type: "stores",
            id: String(process.env.LEMONSQUEEZY_STORE_ID),
          },
        },
      },
    },
  })
  return data.id
}

export async function lsCreateVariant(productId: string, priceEur: number): Promise<string> {
  const data = await lsFetch<{ id: string }>("/variants", {
    data: {
      type: "variants",
      attributes: {
        name: "Default",
        price: Math.round(priceEur * 100),
        is_subscription: false,
        pay_what_you_want: false,
      },
      relationships: {
        product: {
          data: { type: "products", id: productId },
        },
      },
    },
  })
  return data.id
}

export function lsCheckoutUrl(variantId: string): string {
  const slug = process.env.LEMONSQUEEZY_STORE_SLUG
  return `https://${slug}.lemonsqueezy.com/checkout/buy/${variantId}`
}

export async function lsUpdateProduct(id: string, name: string, description: string): Promise<void> {
  const res = await fetch(`${LS_BASE}/products/${id}`, {
    method: "PATCH",
    headers: lsHeaders(),
    body: JSON.stringify({ data: { type: "products", id, attributes: { name, description } } }),
  })
  if (!res.ok) {
    const json = await res.json()
    throw new Error(json.errors?.[0]?.detail ?? "LS update product failed")
  }
}

export async function lsUpdateVariant(id: string, priceEur: number): Promise<void> {
  const res = await fetch(`${LS_BASE}/variants/${id}`, {
    method: "PATCH",
    headers: lsHeaders(),
    body: JSON.stringify({ data: { type: "variants", id, attributes: { price: Math.round(priceEur * 100) } } }),
  })
  if (!res.ok) {
    const json = await res.json()
    throw new Error(json.errors?.[0]?.detail ?? "LS update variant failed")
  }
}

export async function lsDeleteProduct(id: string): Promise<void> {
  const res = await fetch(`${LS_BASE}/products/${id}`, {
    method: "DELETE",
    headers: lsHeaders(),
  })
  if (!res.ok && res.status !== 204) {
    throw new Error(`LS delete product failed: ${res.status}`)
  }
}
