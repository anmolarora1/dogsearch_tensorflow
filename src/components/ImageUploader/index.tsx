import ImageUploading, {
  ImageListType,
  ImageUploadingPropsType
} from 'react-images-uploading'
import { FC, useEffect, useRef, useState } from 'react'
import { ImagePreview } from '../ImagePreview'
import classnames from 'classnames'

export const delay = (n: number): Promise<unknown> =>
  new Promise((resolve) => setTimeout(resolve, n))

interface Props {
  onUpload: (image: HTMLImageElement) => void
  reset: () => void
  onUploadStart?: () => Promise<unknown>
  maxImages?: number
}

export const ImageUploader: FC<Props> = ({
  onUpload,
  reset,
  onUploadStart,
  maxImages = 1
}) => {
  const imageRef = useRef<HTMLImageElement>(null)

  const [images, setImages] = useState<ImageListType>([])

  const onChange: ImageUploadingPropsType['onChange'] = (imageList) => {
    setImages(imageList)
  }

  useEffect(() => {
    if (images.length === 0) {
      reset()
    }
  }, [reset, images])

  useEffect(() => {
    if (images.length && imageRef.current && imageRef.current?.src) {
      onUpload(imageRef.current!)
    }
  }, [images.length, onUpload])

  return (
    <ImageUploading
      multiple
      value={images}
      onChange={onChange}
      maxNumber={maxImages}
      dataURLKey='data_url'
    >
      {({
        imageList,
        onImageUpload,
        onImageUpdate,
        onImageRemove,
        isDragging,
        dragProps
      }) => {
        return (
          <div className='flex flex-col relative content-center items-center text-center h-64 w-full'>
            <section
              role='button'
              className={classnames(
                `width-md border border-solid border-light-blue-500 text-lg h-24 w-full`,
                imageList.length > 0 && 'invisible',
                isDragging && 'border-red-700'
              )}
              onClick={async () => {
                onImageUpload()
                if (onUploadStart) {
                  await onUploadStart()
                }
              }}
              {...dragProps}
            >
              Click or Drop here
            </section>

            {imageList.map((image, index) => (
              <ImagePreview
                key={index}
                srcKey='data_url'
                ref={imageRef}
                image={image}
                updateHandler={() => onImageUpdate(index)}
                removeHandler={() => onImageRemove(index)}
                className='-mt-24'
              />
            ))}
          </div>
        )
      }}
    </ImageUploading>
  )
}
