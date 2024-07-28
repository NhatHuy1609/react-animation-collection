import GamePanel from './GamePanel'
import WheelCircle from './WheelCircle'
import WinnerNotificationModal from './WinnerNotificationModal'

const WheelGame = () => {
  return (
    <>
      <div className='grid w-full grid-cols-[2fr_1fr] place-items-center gap-10 p-8'>
        <WheelCircle />
        <GamePanel />
      </div>
      <WinnerNotificationModal />
    </>
  )
}

export default WheelGame
