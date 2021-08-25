import { useCallback, useEffect, useState } from 'react'

export const useInfiniteScroll = (boundaryElement: HTMLElement | null) => {
  const [page, updatePage] = useState(0)

  const scrollObserver = useCallback((node) => {
    new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.intersectionRatio > 0) {
          updatePage((page) => page + 1)
        }
      })
    }).observe(node)
  }, [])

  useEffect(() => {
    if (boundaryElement) {
      scrollObserver(boundaryElement)
    }
  }, [scrollObserver, boundaryElement])

  return { page }
}
