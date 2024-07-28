import React, { useState, createContext, ReactNode } from 'react'
import WheelGame from './components/WheelGame'

interface IGameDataContext {
  items: string[]
  winner: string
  setItems: React.Dispatch<React.SetStateAction<string[]>>
  setWinner: React.Dispatch<React.SetStateAction<string>>
}

export const GameDataContext = createContext<IGameDataContext>({
  items: [],
  winner: '',
  setItems: () => {},
  setWinner: () => {}
})

const GameDataProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<string[]>([
    'Huy',
    'Tuấn',
    'Nam',
    'Anh',
    'Phong',
    'Quang',
    'Nhật'
  ])
  const [winner, setWinner] = useState<string>('')

  return (
    <GameDataContext.Provider value={{ items, setItems, winner, setWinner }}>
      {children}
    </GameDataContext.Provider>
  )
}

const Page = () => {
  return (
    <GameDataProvider>
      <WheelGame />
    </GameDataProvider>
  )
}

export default Page
