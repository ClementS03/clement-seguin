import { NextRequest, NextResponse } from "next/server"
import { getStore } from "@netlify/blobs"

type Params = { params: Promise<{ key: string[] }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { key } = await params
  const blobKey = key.join("/")

  try {
    const store = getStore({ name: "media", consistency: "strong" })
    const blob = await store.getWithMetadata(blobKey, { type: "arrayBuffer" })
    if (!blob) return new NextResponse("Not found", { status: 404 })

    const contentType = (blob.metadata?.contentType as string) ?? "application/octet-stream"
    return new NextResponse(blob.data, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch {
    return new NextResponse("Not found", { status: 404 })
  }
}
