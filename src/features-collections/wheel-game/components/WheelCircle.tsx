import { useRef, useEffect, useContext, useState, useMemo } from 'react'
import { GameDataContext } from '../index'
import { motion, useAnimate, useMotionValue } from 'framer-motion'
import TickSound from '../assets/tick-sound.mp3'

const WheelCircle = () => {
  const tickSound = new Audio(TickSound)
  const rotation = useRef(0) // Total angle of rotation recorded
  const colorIndex = useRef(0)
  const frameRef = useRef<number>(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRotating, setRotating] = useState(false)
  const { items, setWinner } = useContext(GameDataContext)
  const rotationDeg = useMotionValue(0)
  const [wheelAnimateScope, animate] = useAnimate()

  const reversedItems = useMemo(() => [...items].reverse(), [items])

  // Store the current segment
  const lastSegmentRef = useRef(-1)

  // Wheel's properties
  const radius = 200
  const angle = 360 / items.length
  const maxItemCharLength = 16
  const defaultColor = '#000000'
  const colors: Record<string, string> = {
    red: '#E4003A',
    yellow: '#FFDE4D',
    green: '#399918',
    blue: '#478CCF',
    pink: '#FFB4C2'
  }

  // Calculate font size based on the max length of an item
  const maxLength = Math.max(...items.map((item) => item.length))
  const baseFontSize = 46
  const minFontSize = 16
  const fontSize = Math.max(minFontSize, baseFontSize - maxLength * 2)
  const fontStyle = `${fontSize}px Arial`

  const pickColor = () => {
    const colorKeys = Array.from(Object.keys(colors))
    const pickedColorKey = colorKeys[colorIndex.current]

    if (colorIndex.current >= colorKeys.length - 1) colorIndex.current = 0
    else colorIndex.current += 1
    return colors[pickedColorKey]
  }

  useEffect(() => {
    colorIndex.current = 0
  }, [items])

  useEffect(() => {
    const drawWheel = (ctx: CanvasRenderingContext2D) => {
      if (ctx) {
        if (items.length === 0) {
          ctx.beginPath()
          ctx.fillStyle = defaultColor
          ctx.arc(radius, radius, radius, 0, Math.PI * 2, true)
          ctx.fill()
        } else {
          for (let i = 0; i < items.length; i++) {
            const sectionColor = pickColor()
            const startAngle = (i * angle * Math.PI) / 180
            const endAngle = (angle * (i + 1) * Math.PI) / 180

            ctx.beginPath()
            ctx.lineWidth = 0.5
            ctx.fillStyle = sectionColor
            ctx.moveTo(radius, radius)
            ctx.arc(radius, radius, radius, startAngle, endAngle, false)
            ctx.fill()
            ctx.stroke()
            ctx.save()

            ctx.translate(radius, radius)
            ctx.rotate(((i + 0.5) * angle * Math.PI) / 180)
            ctx.textAlign = 'right'
            ctx.fillStyle = '#fff'
            ctx.font = fontStyle
            let itemText = items[i]
            if (itemText.length > maxItemCharLength) {
              itemText = itemText.substring(0, maxItemCharLength - 3) + '...'
            }
            ctx.fillText(itemText, radius - 20, 10)
            ctx.restore()
          }
        }
      }
    }

    if (canvasRef && canvasRef.current) {
      const context = canvasRef.current?.getContext('2d')
      if (context) {
        frameRef.current = requestAnimationFrame(() => drawWheel(context))
        canvasRef.current.width = radius * 2
        canvasRef.current.height = radius * 2
      }
    }

    return () => cancelAnimationFrame(frameRef.current)
  }, [canvasRef, items])

  const handleSpinWheel = async () => {
    if (!isRotating) {
      const winnerIndex = Math.floor(Math.random() * reversedItems.length)
      const minAngleSection = winnerIndex * angle
      const maxAngleSection = (winnerIndex + 1) * angle
      const rotateAngleBefore = rotation.current % 360

      const totalRotateAngle =
        rotation.current +
        (Math.random() * (maxAngleSection - minAngleSection) + minAngleSection) +
        360 * 6 +
        (360 - rotateAngleBefore)

      setRotating(true)

      await animate(rotationDeg, totalRotateAngle, {
        duration: 4,
        type: 'spring',
        stiffness: 10,
        damping: 10,
        onUpdate: (latest) => {
          const currentSegment = Math.floor((((latest % 360) + 360) % 360) / angle)
          if (currentSegment !== lastSegmentRef.current) {
            tickSound.play()
            lastSegmentRef.current = currentSegment
          }
        }
      })

      rotation.current = totalRotateAngle
      setRotating(false)
      setWinner({ name: reversedItems[winnerIndex], index: winnerIndex })
    }
  }

  return (
    <div className='relative size-[400px]' ref={wheelAnimateScope}>
      <motion.canvas
        ref={canvasRef}
        className='relative'
        animate={{ rotate: 360 }}
        style={{ rotate: rotationDeg }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
      <span className='absolute right-[-10px] top-1/2 -translate-y-1/2 border-[24px] border-y-[16px] border-y-transparent border-l-transparent border-r-stone-400'></span>
      <button
        onClick={handleSpinWheel}
        className='absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white'
      ></button>
    </div>
  )
}

export default WheelCircle
