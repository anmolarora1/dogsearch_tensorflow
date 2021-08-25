import classNames from 'classnames'
import { FC, useEffect, useRef, useState } from 'react'
import { useFetchImages, useInfiniteScroll, useLazyLoading } from '../../hooks'
import { getURL } from '../../modules/dogs/getURL'
import { Loader } from '../Loader'
import { defaultSrc, lazyClass } from './consts'

interface Props {
  maxImages?: number
  categories: string[]
  imgPlaceholderSrc?: string
}

interface Image {
  altText: string
  url: string
}

interface APIResponse {
  message: Image[]
  status: string
}

export const ImageGallery: FC<Props> = ({ categories, maxImages = 5, imgPlaceholderSrc = defaultSrc }) => {
  let bottomBoundaryRef = useRef(null)
  const [images, updateImages] = useState<Image[]>([])
  const [pageLocal, updatePageLocal] = useState(0)

  const { page } = useInfiniteScroll(bottomBoundaryRef.current)

  const { data, fetching, error } = useFetchImages<APIResponse>({
    categories,
    page: pageLocal,
    count: maxImages,
    getURL
  })
  
  useEffect(()=> {
    if(error) alert(error)
  }, [error])

  useEffect(() => {
    if(!fetching && page) {
      updatePageLocal(page)
    }
  },[page, fetching])


  useEffect(() => {
    updateImages((images) => [...images, ...(data?.message || [])])
  }, [data])

  useLazyLoading(lazyClass, images)

  return categories.length > 0 ? (
    <div className='container'>
        {images?.map((image, index) => {
          const { altText, url: imgURL } = image
          return (
            <div key={index+altText}>
              <img
                src={imgPlaceholderSrc}
                data-src={imgURL}
                alt={(altText as string) || ''}
                className={classNames(`w-64 h-64 p-1`, lazyClass)}
              />
            </div>
          )
        })}
      {fetching && (
        <Loader message='Fetching Images'/>
      )}
      <div
        id='page-bottom-boundary'
        className='border-solid border-1 border-light-blue-500'
        ref={bottomBoundaryRef}
      ></div>
    </div>
  ) : null
}
