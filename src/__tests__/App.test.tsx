import * as React from 'react'
import App from '../App'
import { screen, render, fireEvent } from '@testing-library/react'
import * as useImageClassificatinonHooks from '../hooks/useImageClassificatinon'
import * as useFetchHooks from '../hooks/useFetchImages'
import * as useLazyLoadingHooks from '../hooks/useLazyLoading'
import * as mobilenet from '@tensorflow-models/mobilenet'
import * as useInfiniteScrollHooks from '../hooks/useInfiniteScroll'

const file = new File(['(⌐□_□)'], 'hound.png', { type: 'image/png' })

const fetchResponse = {
  data: {
    message: [
      {
        altText: 'hound_image_alttext',
        url: 'hound_image_url',
      },
    ],
  },
  fetching: false,
  error: '',
}

test('can select an image and upload will make a request to upload it', async () => {
  jest
    .spyOn(useImageClassificatinonHooks, 'useImageClassification')
    .mockImplementation(() => ({
      prepare: () => Promise.resolve(mobilenet.load()),
      classifyImage: () => Promise.resolve(['B1']),
      error: '',
    }))

  jest
    .spyOn(useLazyLoadingHooks, 'useLazyLoading')
    .mockImplementation(() => {})

  jest
    .spyOn(useInfiniteScrollHooks, 'useInfiniteScroll')
    .mockImplementation(() => ({ page: 1 }))

  jest
    .spyOn(useFetchHooks, 'useFetchImages')
    .mockImplementation(() => fetchResponse)

  render(<App />)

  // caveat - no other selector for hidden elements
  const inputEl = document.querySelectorAll(
    `[type='file']`
  )[0] as HTMLInputElement

  fireEvent.change(inputEl, {
    target: { files: [file] },
  })

  await screen.findByAltText('dog_image_hound.png')

  const resultImg = await screen.findByAltText('hound_image_alttext')
  expect(resultImg.getAttribute('data-src')).toEqual(fetchResponse.data.message[0].url)
})
