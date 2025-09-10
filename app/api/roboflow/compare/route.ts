import { type NextRequest, NextResponse } from "next/server"
import { roboflowClient } from "@/lib/roboflow"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image1 = formData.get("image1") as File
    const image2 = formData.get("image2") as File

    if (!image1 || !image2) {
      return NextResponse.json({ error: "Two image files are required" }, { status: 400 })
    }

    console.log("[v0] Comparing images with Roboflow")

    const similarity = await roboflowClient.compareImages(image1, image2)

    console.log("[v0] Image comparison result:", similarity)

    return NextResponse.json({
      success: true,
      similarity,
      message: "Images compared successfully",
    })
  } catch (error) {
    console.error("[v0] Error in Roboflow compare API:", error)
    return NextResponse.json({ error: "Failed to compare images" }, { status: 500 })
  }
}
