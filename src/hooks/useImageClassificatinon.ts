import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'

import * as mobilenet from '@tensorflow-models/mobilenet'
import { useCallback, useEffect, useState } from 'react'

const errorMessage = 'Could not find any matches for this image. Please try uploading another image.'

export const useImageClassification = () => {
  const [model, updateModel] = useState<mobilenet.MobileNet>()
  const [error, updateError] = useState('')

  const initModel = useCallback(async () => {
    if (!model) {
      const updatedModel = await mobilenet.load()
      updateModel(updatedModel)

      return updatedModel
    }
 
      return model
    
  }, [model])

  useEffect(() => {
    initModel()
  }, [])

  const classifyImage = useCallback(
    async (image: HTMLImageElement) => {
      try {
        const model = await initModel()
        const predictions = await model.classify(image)

        return predictions.map(
          (prediction) => prediction.className?.split(',')[0]
        )
      } catch (error) {
        updateError(errorMessage)
      }
    },
    [initModel]
  )

  return { prepare: initModel, classifyImage, error }
}
