import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, this would be a real database
const mockPets = [
  {
    id: "1",
    name: "Luna",
    type: "perro",
    breed: "Golden Retriever",
    color: "Dorado",
    size: "grande",
    status: "perdido",
    location: "Parque Central, Madrid",
    date: "2024-01-15",
    description: "Muy cariñosa, lleva collar azul con placa.",
    contact: { name: "María García", phone: "+34 666 123 456" },
    images: ["/golden-retriever.png"],
    distance: "0.5 km",
  },
  {
    id: "4",
    name: "Bella",
    type: "perro",
    breed: "Labrador",
    color: "Chocolate",
    size: "grande",
    status: "encontrado",
    location: "Parque del Retiro, Madrid",
    date: "2024-01-12",
    description: "Perra muy amigable, sin collar.",
    contact: { name: "Luis Fernández", phone: "+34 644 555 777" },
    images: ["/chocolate-labrador.png"],
    distance: "0.8 km",
  },
  // Add more mock pets...
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const petId = searchParams.get("petId")
    const minSimilarity = Number.parseFloat(searchParams.get("minSimilarity") || "70")

    console.log("[v0] Finding matches for pet:", petId, "min similarity:", minSimilarity)

    if (!petId) {
      return NextResponse.json({ error: "Pet ID is required" }, { status: 400 })
    }

    // Find the target pet
    const targetPet = mockPets.find((pet) => pet.id === petId)
    if (!targetPet) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 })
    }

    // Find potential matches (opposite status)
    const oppositeStatus = targetPet.status === "perdido" ? "encontrado" : "perdido"
    const candidates = mockPets.filter((pet) => pet.id !== petId && pet.status === oppositeStatus)

    console.log("[v0] Found", candidates.length, "candidates for matching")

    // Calculate AI similarity for each candidate
    const matches = []
    for (const candidate of candidates) {
      try {
        // In a real implementation, you would compare actual images
        // For now, we'll use mock similarity based on features
        const similarity = await calculateMockSimilarity(targetPet, candidate)

        if (similarity >= minSimilarity) {
          matches.push({
            lostPet: targetPet.status === "perdido" ? targetPet : candidate,
            foundPet: targetPet.status === "encontrado" ? targetPet : candidate,
            similarity: Math.round(similarity),
            matchedFeatures: getMatchedFeatures(targetPet, candidate),
            confidence: similarity >= 85 ? "alta" : similarity >= 70 ? "media" : "baja",
          })
        }
      } catch (error) {
        console.error("[v0] Error calculating similarity for candidate:", candidate.id, error)
      }
    }

    // Sort by similarity (highest first)
    matches.sort((a, b) => b.similarity - a.similarity)

    console.log("[v0] Found", matches.length, "matches above threshold")

    return NextResponse.json({
      success: true,
      matches,
      total: matches.length,
    })
  } catch (error) {
    console.error("[v0] Error in matches API:", error)
    return NextResponse.json({ error: "Failed to find matches" }, { status: 500 })
  }
}

async function calculateMockSimilarity(pet1: any, pet2: any): Promise<number> {
  let similarity = 0
  let factors = 0

  // Type similarity (dog/cat)
  factors++
  if (pet1.type === pet2.type) {
    similarity += 30
  }

  // Breed similarity
  factors++
  if (pet1.breed === pet2.breed) {
    similarity += 25
  } else if (areSimilarBreeds(pet1.breed, pet2.breed)) {
    similarity += 15
  }

  // Size similarity
  factors++
  if (pet1.size === pet2.size) {
    similarity += 20
  }

  // Color similarity
  factors++
  if (pet1.color === pet2.color) {
    similarity += 15
  } else if (areSimilarColors(pet1.color, pet2.color)) {
    similarity += 8
  }

  // Location proximity (mock calculation)
  factors++
  if (pet1.location.includes(pet2.location.split(",")[1]) || pet2.location.includes(pet1.location.split(",")[1])) {
    similarity += 10
  }

  return Math.min(similarity, 100)
}

function areSimilarBreeds(breed1: string, breed2: string): boolean {
  const similarGroups = [
    ["Golden Retriever", "Labrador", "Labrador Retriever"],
    ["Bulldog Francés", "Bulldog Inglés"],
    ["Gato Persa", "Gato Siamés", "Gato doméstico"],
  ]

  return similarGroups.some((group) => group.includes(breed1) && group.includes(breed2))
}

function areSimilarColors(color1: string, color2: string): boolean {
  const similarColors = [
    ["Negro", "Negro y blanco"],
    ["Blanco", "Blanco y gris"],
    ["Dorado", "Amarillo"],
    ["Chocolate", "Marrón"],
  ]

  return similarColors.some((group) => group.includes(color1) && group.includes(color2))
}

function getMatchedFeatures(pet1: any, pet2: any): string[] {
  const features = []

  if (pet1.type === pet2.type) {
    features.push(`Mismo tipo (${pet1.type})`)
  }

  if (pet1.breed === pet2.breed) {
    features.push(`Misma raza (${pet1.breed})`)
  } else if (areSimilarBreeds(pet1.breed, pet2.breed)) {
    features.push(`Razas similares`)
  }

  if (pet1.size === pet2.size) {
    features.push(`Mismo tamaño (${pet1.size})`)
  }

  if (pet1.color === pet2.color) {
    features.push(`Mismo color (${pet1.color})`)
  } else if (areSimilarColors(pet1.color, pet2.color)) {
    features.push(`Colores similares`)
  }

  // Location similarity
  if (pet1.location.includes(pet2.location.split(",")[1]) || pet2.location.includes(pet1.location.split(",")[1])) {
    features.push("Ubicación cercana")
  }

  return features
}
