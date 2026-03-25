import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRandomIndices(size = 12, count = 3) {
  const indices = new Set<number>()
  while (indices.size < count) {
    const randomIndex = Math.floor(Math.random() * size)
    indices.add(randomIndex)
  }
  return Array.from(indices)
}

export function shuffleArray(array:any[]) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}