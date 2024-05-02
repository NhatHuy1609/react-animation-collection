import styles from './style.module.css'
import clsx from 'clsx'
import { useScroll, useTransform, motion, MotionValue } from 'framer-motion'
import { ReactLenis } from 'lenis/react'
import { useRef } from 'react'

const text =
  'Public opinion is the aggregate result of individual opinions—now uniform, now conflicting—of the men and women who make up society or any group of society. In order to understand public opinion, one must go back to the individual who makes up the group.'

const BlurRevealText = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.95', 'end 0.25']
  })

  const words = text.split(' ')

  return (
    <motion.div ref={ref} className={clsx(styles.blur_text, styles.blur_text_1)}>
      {words.map((word, i) => {
        const start = i / words.length
        const end = start + 1 / words.length
        return <Word word={word} progress={scrollYProgress} range={[start, end]} key={i} />
      })}
    </motion.div>
  )
}

const Word = ({
  word,
  range,
  progress
}: {
  word: string
  progress: MotionValue<number>
  range: number[]
}) => {
  const chars = word.split('')
  const amount = range[1] - range[0]
  const step = amount / word.length

  return (
    <div className={styles.word}>
      {chars.map((char, i) => {
        const start = range[0] + i * step
        const end = range[0] + step * (i + 1)
        return (
          <Character key={i} range={[start, end]} progress={progress}>
            {char}
          </Character>
        )
      })}
    </div>
  )
}

const Character = ({
  children,
  progress,
  range
}: {
  children: any
  progress: MotionValue<number>
  range: number[]
}) => {
  const opacity = useTransform(progress, range, [0, 1])

  return <motion.span style={{ opacity }}>{children}</motion.span>
}

const Page = () => {
  return (
    <ReactLenis root options={{ duration: 2, lerp: 0.05 }}>
      <div className={styles.container}>
        <section className={styles.intro}>
          <div className={styles.intro__heading}>
            <nav className={clsx(styles.tags, styles.type_small)}>
              <a>#scroll</a>
              <a>#typography</a>
            </nav>
            <h2>
              On-Scroll <br /> Blur Reveal{' '}
            </h2>
            <p className={styles.type_small}>
              Howdy, cowboy! Before you go scrolling', simmer down and savor the ride. Yeehaw, but
              easy now!
            </p>
          </div>
        </section>
        <section className={styles.content}>
          <span className={clsx(styles.content__number, styles.type_small)}>1</span>
          <BlurRevealText />
          <div style={{ height: '100vh' }}></div>
        </section>
      </div>
    </ReactLenis>
  )
}

export default Page
