import { motion } from 'framer-motion'
import styles from './style.module.scss'
import useMousePosition from './hooks/useMousePosition'
import { useState } from 'react'

const Home = () => {
  const { x, y } = useMousePosition()
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const size = isHovered ? 400 : 40

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.mask}
        animate={{
          WebkitMaskPosition: `${x - size / 2}px ${y - size / 2}px`,
          WebkitMaskSize: `${size}px`
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.5 }}
      >
        <p onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          A visual designer - with skills that haven't been replaced by A.I (yet) - making good shit only if the
          paycheck is equally good.
        </p>
      </motion.div>

      <div className={styles.paragraph}>
        <p>
          I'm a <span>selectively skilled</span> product designer with strong focus on producing high quality &
          impactful digital experience.
        </p>
      </div>
    </div>
  )
}

const Index = () => {
  return (
    <main className={styles.main}>
      <Home />
    </main>
  )
}

export default Index
