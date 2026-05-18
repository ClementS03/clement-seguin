import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { airtableCreateProject } from "@/lib/airtable"

export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value
  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json() as {
    name: string; slug: string; tagline: string; description?: string
    status?: string; type?: string; url?: string; imageUrl?: string
    featured?: boolean; mrr?: number; users?: number; started?: string
    gallery?: string; videoUrl?: string; metrics?: string
  }

  if (!body.name || !body.slug || !body.tagline) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
  }

  try {
    const project = await airtableCreateProject({
      name: body.name,
      slug: body.slug,
      tagline: body.tagline,
      description: body.description ?? "",
      status: body.status ?? "Building",
      type: body.type ?? "",
      url: body.url ?? "",
      imageUrl: body.imageUrl ?? "",
      featured: body.featured ?? false,
      mrr: body.mrr ?? null,
      users: body.users ?? null,
      started: body.started ?? "",
      gallery: body.gallery,
      videoUrl: body.videoUrl,
      metrics: body.metrics,
    })
    revalidatePath("/projects")
    return NextResponse.json({ success: true, project })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue"
    console.error("[admin/projects POST]", err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
