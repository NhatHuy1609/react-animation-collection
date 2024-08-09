import Lenis from 'lenis'
import styles from './style.module.scss'
import { useEffect, useRef, useState } from 'react'
import { useScroll, motion, useTransform, MotionValue, useMotionValueEvent } from 'framer-motion'

const Card = ({
  index,
  content,
  scrollYProgress,
  progressRange
}: {
  index: number
  content: string
  progressRange: number[]
  scrollYProgress: MotionValue<number>
}) => {
  const scaleFactor = 1 - (5 - index) * 0.04
  const [start, end] = progressRange
  const scale = useTransform(scrollYProgress, [start, end], [1, scaleFactor])

  return (
    <motion.div className={styles.card_container} style={{ scale }}>
      {content}
    </motion.div>
  )
}

const Page = () => {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })
  const [progressArray, setProgressArray] = useState<number[][]>(Array(5).fill([0, 0]))

  useMotionValueEvent(scrollYProgress, 'change', () => {
    console.log(scrollYProgress.get())
  })

  useEffect(() => {
    const lenis = new Lenis()
    function raf(time: any) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  })

  useEffect(() => {
    if (containerRef && containerRef.current) {
      const containerHeight = containerRef.current.clientHeight
      const maxProgressForCards = (containerHeight - 200) / containerHeight
      const step = maxProgressForCards / 5

      setProgressArray([...Array(5).keys()].map((_, i) => [i * step, 1]))
    }
  }, [containerRef])

  return (
    <>
      <main className={styles.container} ref={containerRef}>
        {[...Array(5).keys()].map((val) => (
          <Card
            index={val}
            content={`Section ${val + 1}`}
            progressRange={progressArray[val]}
            scrollYProgress={scrollYProgress}
          />
        ))}
        <div className='h-[200px] w-full bg-blue-500'></div>
      </main>
      <div className='h-[500px]'></div>
    </>
  )
}

export default Page
