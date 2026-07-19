import { NextRequest, NextResponse } from "next/server"
import { getProjectById, airtableUpdateProject, airtableDeleteProject } from "@/lib/airtable"

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const token = req.cookies.get("admin_token")?.value
  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  const current = await getProjectById(id)
  if (!current) return NextResponse.json({ error: "Project not found" }, { status: 404 })

  try {
    const project = await airtableUpdateProject(id, body)
    return NextResponse.json({ success: true, project })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const token = req.cookies.get("admin_token")?.value
  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  await airtableDeleteProject(id)
  return NextResponse.json({ success: true })
}
