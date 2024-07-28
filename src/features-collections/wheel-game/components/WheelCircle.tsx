import { useRef, useEffect, useContext, useState, useMemo } from 'react'
import { GameDataContext } from '../index'
import { motion, useAnimate } from 'framer-motion'

const WheelCircle = () => {
  const rotation = useRef(0) // Total angle of rotation recorded
  const colorIndex = useRef(0)
  const frameRef = useRef<number>(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { items, setWinner } = useContext(GameDataContext)
  const [wheelAnimateScope, animate] = useAnimate()
  const [isRotating, setRotating] = useState(false)

  const reversedItems = useMemo(() => [...items].reverse(), [items])

  const angle = 360 / items.length
  const radius = 200
  const defaultColor = '#000000'
  const colors: Record<string, string> = {
    red: '#E4003A',
    yellow: '#FFDE4D',
    green: '#399918',
    blue: '#478CCF',
    pink: '#FFB4C2'
  }

  const pickColor = () => {
    const colorKeys = Array.from(Object.keys(colors))
    const pickedColorKey = colorKeys[colorIndex.current]

    if (colorIndex.current >= colorKeys.length - 1) colorIndex.current = 0
    else colorIndex.current += 1
    return colors[pickedColorKey]
  }

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
            ctx.font = '32px Arial'
            ctx.fillText(items[i], radius - 50, 10)
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
  }, [canvasRef])

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
      await animate('canvas', { rotate: totalRotateAngle }, { duration: 4, type: 'tween' })
      rotation.current = totalRotateAngle
      setRotating(false)
      setWinner(reversedItems[winnerIndex])
    }
  }

  return (
    <div className='relative size-[400px]' ref={wheelAnimateScope}>
      <motion.canvas ref={canvasRef} className='relative' />
      <span className='absolute right-[-10px] top-1/2 -translate-y-1/2 border-[24px] border-y-[16px] border-y-transparent border-l-transparent border-r-stone-400'></span>
      <button
        onClick={handleSpinWheel}
        className='absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white'
      ></button>
    </div>
  )
}

export default WheelCircle
