import { useState, useEffect, useRef } from 'react'
import { ResolvedValues, motion } from 'framer-motion'
import Puppy1 from './images/puppy1.jpg'
import Puppy2 from './images/puppy2.jpg'
import Puppy3 from './images/puppy3.jpg'

interface CarouselProps<T> {
  items: T[]
  extractKey: (item: T) => string
  renderItem: (item: T) => React.ReactNode
  itemWidth: number
  itemHeight: number
  gap?: number
}

const InfiniteAutoplayCarousel = <T extends unknown>({
  items,
  extractKey,
  renderItem,
  itemWidth,
  itemHeight,
  gap
}: CarouselProps<T>) => {
  const [itemBlocks, setItemBlocks] = useState(items) // Number of items in an container
  const containerRef = useRef<HTMLDivElement>(null)
  const itemWidthWithGap = gap ? itemWidth + gap : itemWidth
  const numberOfContents = items?.length

  useEffect(() => {
    if (
      containerRef.current?.offsetHeight &&
      itemBlocks.length * itemWidthWithGap < containerRef.current.offsetWidth
    ) {
      const fillableNumberOfContents: number = Math.floor(
        (containerRef.current.offsetWidth - itemBlocks.length * itemWidthWithGap) / itemWidthWithGap
      )

      const fillableNumberOfSequences: number = Math.ceil(
        fillableNumberOfContents / numberOfContents
      )

      const newItemBlocks = [...itemBlocks]
      const _ = [...Array(fillableNumberOfSequences + 1)].map((_, i) => {
        newItemBlocks.push(...itemBlocks)
      })

      setItemBlocks(newItemBlocks)
    }
  }, [containerRef.current])

  const handleUpdateCarousel = (latest: ResolvedValues) => {
    const moveBy = Math.ceil(+latest.x)
    if (moveBy === itemWidthWithGap) {
      const newItemBlocks = [...itemBlocks]
      newItemBlocks.unshift(itemBlocks[itemBlocks.length - 1])
      newItemBlocks.pop()
      setItemBlocks(newItemBlocks)
    }
  }

  return (
    <div className='w-full overflow-hidden' ref={containerRef}>
      <motion.div
        onUpdate={handleUpdateCarousel}
        style={{
          display: 'flex',
          gap: `${gap}px`,
          width: '200%',
          marginLeft: `-${itemWidthWithGap}px`
        }}
        animate={{ x: itemWidthWithGap }}
        transition={{ duration: '2', ease: 'linear', repeat: Infinity }}
      >
        {itemBlocks.map((item, index) => (
          <div key={index} style={{ width: `${itemWidth}px`, height: `${itemHeight}px` }}>
            {renderItem(item)}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

const images = [
  { id: '1', image: Puppy1 },
  { id: '2', image: Puppy2 },
  { id: '3', image: Puppy3 }
]

export const RunApp = () => {
  return (
    <InfiniteAutoplayCarousel
      itemWidth={200}
      itemHeight={135}
      items={images}
      gap={20}
      extractKey={({ id }) => id}
      renderItem={({ image }) => <img className='size-full' src={image} />}
    />
  )
}

export default RunApp
