import React, { useState, createContext, ReactNode } from 'react'
import WheelGame from './components/WheelGame'

interface IGameDataContext {
  items: string[]
  winner: {
    name: string
    index: number
  } | null
  results: string[]
  setItems: React.Dispatch<React.SetStateAction<string[]>>
  setResults: React.Dispatch<React.SetStateAction<string[]>>
  setWinner: React.Dispatch<
    React.SetStateAction<{
      name: string
      index: number
    } | null>
  >
}

export const GameDataContext = createContext<IGameDataContext>({
  items: [],
  winner: null,
  results: [],
  setResults: () => {},
  setItems: () => {},
  setWinner: () => {}
})

const GameDataProvider = ({ children }: { children: ReactNode }) => {
  const [winner, setWinner] = useState<{
    name: string
    index: number
  } | null>(null)
  const [results, setResults] = useState<string[]>([])
  const [items, setItems] = useState<string[]>(['Huy', 'Tuấn', 'Anh', 'Phong', 'Quang', 'Nhật'])

  return (
    <GameDataContext.Provider value={{ items, setItems, winner, setWinner, results, setResults }}>
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
