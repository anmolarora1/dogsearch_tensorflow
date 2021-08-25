import { useCallback, useState } from 'react'
import { useImageClassification } from './hooks'
import { ImageUploader, ImageGallery, Loader, CategoriesList } from './components'

export const delay = (n: number): Promise<unknown> =>
  new Promise((resolve) => setTimeout(resolve, n))

export default function App() {
  const { prepare, classifyImage } = useImageClassification()
  const [showLoader, updateShowLoader] = useState(false)

  const [matches, updateMatches] = useState<string[]>([])

  const loadImages = useCallback(async (image: HTMLImageElement) => {
    updateShowLoader(true)
    const predictedmatches = await classifyImage(image)
    updateShowLoader(false)
    if (predictedmatches) {
      updateMatches(predictedmatches)
    }
  }, [])

  const resetMatches = useCallback(() => {
    updateMatches([])
  }, [])

  return (
    <div className='container mx-auto px-10'>
      {showLoader && <Loader message='Fetching Images' />}
      <ImageUploader
        onUpload={loadImages}
        reset={resetMatches}
        onUploadStart={prepare}
      />
      <CategoriesList categories={matches} />
      {matches.length ? <ImageGallery categories={matches} /> : null}
    </div>
  )
}
