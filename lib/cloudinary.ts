import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadProductImage(buffer: Buffer, mimeType: string): Promise<string> {
  const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "products",
    transformation: [{ width: 1200, crop: "limit", quality: "auto", fetch_format: "auto" }],
  })
  return result.secure_url
}
