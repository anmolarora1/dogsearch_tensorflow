import classNames from 'classnames'
import { FC, forwardRef, Ref } from 'react'
import { ImageType } from 'react-images-uploading'

interface Props {
  image: ImageType
  ref: Ref<HTMLImageElement>
  srcKey: string
  updateHandler: () => void
  removeHandler: () => void
  className?: string
}

export const ImagePreview: FC<Props> = forwardRef((props, ref) => {
  const { image, srcKey, updateHandler, removeHandler, className } = props
  return (
    <div className={classNames(`flex flex-col w-64 items-center`, className)}>
      <img
        ref={ref}
        src={image[srcKey]}
        alt={`dog_image_${image?.file?.name}`}
        width='w-full p-1'
      />
      <div className='flex justify-evenly min-w-full'>
        <button className='rounded-sm p-1 bg-blue-300' onClick={updateHandler}>
          Update
        </button>
        <button className='rounded-sm p-1 bg-blue-300' onClick={removeHandler}>
          Remove
        </button>
      </div>
    </div>
  )
})
