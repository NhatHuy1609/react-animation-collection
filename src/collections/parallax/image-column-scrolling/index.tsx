import Lenis from 'lenis'
import { useEffect, useRef } from 'react'
import { useScroll, motion, useTransform } from 'framer-motion'
import styles from './style.module.css'
import ImageMain1 from './images/main-1.jpg'
import ImageMain2 from './images/main-2.jpg'
import Image1 from './images/1.jpg'
import Image2 from './images/2.jpg'
import Image3 from './images/3.jpg'
import Image4 from './images/4.jpg'
import Image5 from './images/5.jpg'
import Image6 from './images/6.jpg'
import Image7 from './images/7.jpg'
import Image8 from './images/8.jpg'
import Image9 from './images/9.jpg'

const imagesSource = [Image1, Image2, Image3, Image4, Image5, Image6, Image7, Image8, Image9]
const MAX_COLUMNS = 3

const Column = ({ index }: { index: number }) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  const amount = 500
  const move = useTransform(scrollYProgress, [0, 1], [0, index % 2 === 0 ? -amount : amount])

  const images = imagesSource.slice(
    index * MAX_COLUMNS,
    index > 0 ? (index + 1) * MAX_COLUMNS : MAX_COLUMNS
  )

  return (
    <motion.div className={styles.column} ref={ref} style={{ translateY: move }}>
      {images.map((imgSrc, i) => {
        return <img src={imgSrc} key={i} />
      })}
    </motion.div>
  )
}

const Page = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 2,
      lerp: 0.05
    })

    function raf(time: any) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])

  return (
    <div className={styles.main}>
      <section className={styles.section_1}>
        <img src={ImageMain1} />
        <img src={ImageMain2} />
      </section>
      <section className={styles.section_2}>
        {Array.from({ length: MAX_COLUMNS }, (_, i) => i).map((index) => (
          <Column key={index} index={index} />
        ))}
      </section>
      <section className={styles.section_3}>
        <h1>My name is Phạm Văn Nhật Huy XD</h1>
      </section>
    </div>
  )
}

export default Page
