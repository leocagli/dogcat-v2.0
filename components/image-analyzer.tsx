"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Brain, Loader2 } from "lucide-react"
import Image from "next/image"

interface ImageAnalyzerProps {
  onAnalysisComplete?: (features: any) => void
  className?: string
}

export function ImageAnalyzer({ onAnalysisComplete, className }: ImageAnalyzerProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setAnalysisResult(null)
    }
  }

  const analyzeImage = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    console.log("[v0] Starting image analysis with Roboflow")

    try {
      const formData = new FormData()
      formData.append("image", selectedImage)

      const response = await fetch("/api/roboflow/analyze", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Analysis complete:", data.features)
        setAnalysisResult(data.features)
        onAnalysisComplete?.(data.features)
      } else {
        console.error("[v0] Analysis failed:", response.statusText)
      }
    } catch (error) {
      console.error("[v0] Error during analysis:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <Brain className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold">Análisis IA de Imagen</h3>
            <p className="text-sm text-muted-foreground">Sube una foto para detectar características de la mascota</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Haz clic para subir una imagen</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
              </label>
            </div>

            {previewUrl && (
              <div className="space-y-3">
                <Image
                  src={previewUrl || "/placeholder.svg"}
                  alt="Preview"
                  width={200}
                  height={150}
                  className="w-full h-32 object-cover rounded-lg"
                />

                <Button onClick={analyzeImage} disabled={isAnalyzing} className="w-full">
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analizando...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Analizar con IA
                    </>
                  )}
                </Button>
              </div>
            )}

            {analysisResult && (
              <div className="space-y-2 p-3 bg-muted rounded-lg">
                <h4 className="font-medium text-sm">Características detectadas:</h4>
                <div className="space-y-1 text-sm">
                  {analysisResult.breed && (
                    <p>
                      <span className="font-medium">Raza:</span> {analysisResult.breed}
                    </p>
                  )}
                  {analysisResult.color && (
                    <p>
                      <span className="font-medium">Color:</span> {analysisResult.color}
                    </p>
                  )}
                  {analysisResult.size && (
                    <p>
                      <span className="font-medium">Tamaño:</span> {analysisResult.size}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Confianza:</span> {Math.round(analysisResult.confidence * 100)}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
