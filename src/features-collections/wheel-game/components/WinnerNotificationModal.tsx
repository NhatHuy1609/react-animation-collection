import { useContext, useEffect, useState } from 'react'
import { GameDataContext } from '..'
import AppLause from '../assets/applause-180037.mp3'

interface IModalProps {}

const WinnerNotificationModal = ({}: IModalProps) => {
  const { winner, setWinner, setResults, setItems } = useContext(GameDataContext)
  const [showModal, setShowModal] = useState(false)
  const applauseSound = new Audio(AppLause)

  // Notify winner and save it to results list
  useEffect(() => {
    if (winner) {
      setResults((prev) => [...prev, winner.name])
      setTimeout(() => {
        setShowModal(true)
        applauseSound.play()
      }, 500)
    } else {
      setShowModal(false)
    }

    return () => {
      applauseSound.pause()
    }
  }, [winner])

  if (!showModal) {
    return
  }

  const handleResetWinnerResult = () => {
    setWinner(null)
  }

  const handleRemoveWinnerItem = () => {
    if (winner) {
      setItems((prev) => {
        const newList = [...prev]
        newList.splice(newList.length - winner.index - 1, 1)
        return newList
      })
      setWinner(null)
    }
  }

  return (
    <div className='fixed inset-0 grid place-items-center bg-[rgba(0,0,0,0.6)]'>
      <div className='flex min-w-[500px] flex-col overflow-hidden rounded-md bg-white'>
        <span className='h-10 w-full bg-blue-500'></span>
        <div className='h-auto w-full px-10 py-6'>
          <p className='mb-10 text-2xl'>{winner?.name}</p>
          <div className='flex items-center justify-end gap-4'>
            <span
              className='cursor-pointer rounded-md bg-red-500 p-2 text-white'
              onClick={handleResetWinnerResult}
            >
              Close
            </span>
            <span
              onClick={handleRemoveWinnerItem}
              className='cursor-pointer rounded-md bg-blue-500 p-2 text-white'
            >
              Remove
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WinnerNotificationModal
