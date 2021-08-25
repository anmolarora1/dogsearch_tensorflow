import { useCallback, useEffect, useRef } from 'react'

export const useLazyLoading = (imgSelectorClass: string, images: unknown[]) => {
  const imgObserver = useCallback((node) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.intersectionRatio > 0) {
          const currentImg = en.target as HTMLImageElement
          const newImgSrc = currentImg.dataset.src

          if (newImgSrc) {
            currentImg.src = newImgSrc
          }
 
          observer.unobserve(node)
        }
      })
    })
    observer.observe(node)
  }, [])

  const imagesRef = useRef<HTMLCollectionOf<Element>>()

  useEffect(() => {
    imagesRef.current = document.getElementsByClassName(imgSelectorClass)

    if (imagesRef.current) {
      Array.prototype.forEach.call(imagesRef.current, (img) => imgObserver(img))
    }
  }, [imgObserver, imagesRef, imgSelectorClass, images.length])
}
