import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(buffer: Buffer, mimeType: string, folder: string): Promise<string> {
  const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`
  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    transformation: [{ width: 1200, crop: "limit", quality: "auto", fetch_format: "auto" }],
  })
  return result.secure_url
}

export async function uploadDeliverable(buffer: Buffer, mimeType: string, filename: string): Promise<string> {
  const base64 = buffer.toString("base64")
  const dataUri = `data:${mimeType};base64,${base64}`
  const safeId = filename.replace(/[^a-zA-Z0-9._-]/g, "_")
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "deliverables",
    resource_type: "raw",
    public_id: safeId,
  })
  return result.secure_url
}

export const uploadProductImage = (buffer: Buffer, mimeType: string) => uploadImage(buffer, mimeType, "products")
export const uploadProjectImage = (buffer: Buffer, mimeType: string) => uploadImage(buffer, mimeType, "projects")
