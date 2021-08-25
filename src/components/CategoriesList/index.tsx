import { FC } from 'react'

interface Props {
  categories: string[]
}

export const CategoriesList: FC<Props> = ({ categories }) => {
  return categories.length > 0 ? (
    <section className='flex flex-col content-center text-center w-full'>
      Matching categories -
      {categories.map(category => (
        <span key={category}>{category}</span>
      ))}
    </section>
  ) : null
}
