import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"

const f = createUploadthing()

function checkAdmin(req: Request) {
  const cookie = req.headers.get("cookie") ?? ""
  const token = cookie.match(/admin_token=([^;]+)/)?.[1]
  if (token !== process.env.ADMIN_SECRET) throw new UploadThingError("Unauthorized")
}

export const ourFileRouter = {
  productImage: f({ image: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => { checkAdmin(req); return {} })
    .onUploadComplete(({ file }) => ({ url: file.ufsUrl })),

  projectImage: f({ image: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => { checkAdmin(req); return {} })
    .onUploadComplete(({ file }) => ({ url: file.ufsUrl })),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
