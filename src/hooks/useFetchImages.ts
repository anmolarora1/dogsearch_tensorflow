import { useCallback, useEffect, useState } from 'react'

interface Config {
  categories: string[]
  page: number
  count: number
  getURL: (category: string, count: number, page?: number) => string
}

const errorMessage = 'Could not fetch images'

export const useFetchImages = <T = Record<string, unknown>>({
  categories,
  page,
  count,
  getURL
}: Config) => {
  const [matchedCategory, updateMatchedCategory] = useState<string>()
  const [fetching, updateFetching] = useState(false)
  const [error, updateError] = useState<string>()
  const [imageData, updateImageData] = useState<T>()

  const fetchImages = useCallback(
    async (category: string) => {
      updateFetching(true)

      try {
        const url = getURL(category, count)
        const response = await fetch(url)
        const data = await response.json()
        updateFetching(false)

        if (data.status !== 'success') {
          return null
        }

        return data
      } catch (error) {
        updateFetching(false)

        return null
      }
    },
    [getURL, count]
  )

  const tryFetchingImages = useCallback(
    async (categories: string[]) => {
      updateError('')

      if(matchedCategory) {
        const response = await fetchImages(matchedCategory)

        if (response) {
          updateImageData(response)

          return
        }
 
          updateError(errorMessage)
        
      }

      for (const category of categories) {
        const response = await fetchImages(category)

        if (response) {
          updateMatchedCategory(category)
          updateImageData(response)

          return
        }
      }

      updateError(errorMessage)
    },
    [fetchImages, matchedCategory]
  )

  
  useEffect(() => {
    tryFetchingImages(categories)
  }, [tryFetchingImages, categories, page])

  return { data: imageData, fetching, error }
}
