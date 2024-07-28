import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import styles from './style.module.scss'
import { useScroll, motion, useTransform } from 'framer-motion'

const Page = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })
  // Calculate to animate for section 1
  const scale1 = useTransform(scrollYProgress, [0, 1], [1, 0.7])
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, -5])
  // Calculate to animate for section 2
  const scale2 = useTransform(scrollYProgress, [0, 1], [0.8, 1])
  const rotate2 = useTransform(scrollYProgress, [0, 1], [5, 0])

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.05
    })

    function raf(time: any) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])

  return (
    <div className={styles.container} ref={containerRef}>
      <motion.div
        className={styles.section_1}
        style={{ scale: scale1, rotate: rotate1 }}
      ></motion.div>
      <motion.div className={styles.section_2} style={{ scale: scale2, rotate: rotate2 }}>
        <span className='m-20 text-[8rem] text-white'>HEELO I'M HUY- 21</span>
      </motion.div>
      <div className='h-[200vh] w-full bg-indigo-300'></div>
    </div>
  )
}

export default Page
