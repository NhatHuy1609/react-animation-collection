import Pic1 from './assets/pic1.jpg'
import Pic2 from './assets/pic2.jpg'
import Pic3 from './assets/pic3.jpg'
import styles from './style.module.scss'
import Lenis from 'lenis'
import { useEffect, useRef } from 'react'
import { useScroll, motion, useTransform, MotionValue } from 'framer-motion'

const Text = ({
  data,
  index,
  scrollYProgress
}: {
  data: {
    text: string
    image: string
  }
  index: number
  scrollYProgress: MotionValue<number>
}) => {
  const moveX = useTransform(scrollYProgress, [0, 1], [0, index % 2 === 0 ? -500 : 500])

  const renderItem = () => {
    return [...Array(3).keys()].map((value) => (
      <div className={styles.text_item_container} key={value}>
        <p className={styles.text_phrase_container}>{data.text}</p>
        <span className={styles.text_image_container}>
          <img src={data.image} />
        </span>
      </div>
    ))
  }

  return (
    <motion.div className={styles.text_container} style={{ translateX: moveX }}>
      {renderItem()}
    </motion.div>
  )
}

const Page = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })

  const data = [
    {
      text: 'Front End Developer',
      image: Pic1
    },
    {
      text: 'Back End Developer',
      image: Pic2
    },
    {
      text: 'Creative Developer',
      image: Pic3
    }
  ]

  useEffect(() => {
    const lenis = new Lenis({})

    function raf(time: any) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])

  return (
    <div className={styles.container}>
      <section className={styles.section_1}>
        <p>Scroll for a text parallax demo</p>
      </section>
      <section className={styles.section_2} ref={sectionRef}>
        {data.map((data, index) => (
          <Text key={index} data={data} scrollYProgress={scrollYProgress} index={index} />
        ))}
      </section>
      <section className='h-[1000px]'></section>
    </div>
  )
}

export default Page
