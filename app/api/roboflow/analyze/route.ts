import { type NextRequest, NextResponse } from "next/server"
import { roboflowClient } from "@/lib/roboflow"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("image") as File

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 })
    }

    console.log("[v0] Analyzing image with Roboflow:", file.name, file.size)

    const features = await roboflowClient.analyzeImage(file)

    console.log("[v0] Roboflow analysis result:", features)

    return NextResponse.json({
      success: true,
      features,
      message: "Image analyzed successfully",
      isMockData: !process.env.ROBOFLOW_API_KEY || process.env.ROBOFLOW_API_KEY === "",
    })
  } catch (error) {
    console.error("[v0] Error in Roboflow analyze API:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      {
        error: "Failed to analyze image",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
