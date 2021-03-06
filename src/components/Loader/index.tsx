import { FC } from 'react'

interface Props {
  message?: string
}

export const Loader: FC<Props> = ({ message = 'Loading...' }) => (
  <div className='fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center'>
    <div className='border-t border-green w-16 h-16 border-4 border-blue-400 border-solid rounded-full animate-spin'></div>
    <h2 className='text-center text-white text-xl font-semibold'>{message}</h2>
  </div>
)
