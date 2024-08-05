import clsx from 'clsx'
import React, { ReactNode, SetStateAction, useState, useContext, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GameDataContext } from '..'
import InputItem from './InputItem'
import { nanoid } from 'nanoid'

interface ITabProps {
  title: string
  onSetCurrentTab: React.Dispatch<SetStateAction<string>>
  className?: string
}

const Tab = ({ title, onSetCurrentTab, className }: ITabProps) => {
  const handleActiveTab = () => {
    onSetCurrentTab(title)
  }

  return (
    <div
      onClick={handleActiveTab}
      className={clsx(
        'relative w-1/3 cursor-pointer border-r-2 p-4 text-center hover:bg-slate-100',
        className
      )}
    >
      {title}
    </div>
  )
}

const EntriesPanel = () => {
  const { items, setItems, winner } = useContext(GameDataContext)
  const [currentInputItemChange, setCurrentInputItemChange] = useState(-1)

  // Reset currentInputItemChange to -1 when having winner
  useEffect(() => {
    if (winner) {
      setCurrentInputItemChange(-1)
    }
  }, [winner])

  const handleAddItem = () => {
    setItems((prev) => [...prev, ''])
    setCurrentInputItemChange(items.length)
  }

  // Shuffle items
  const handleShuffleItems = () => {
    const cloneItems = items.slice(0)
    const shuffledItems = []
    for (let i = 0; i < items.length; i++) {
      const randomItem = cloneItems.splice(Math.floor(Math.random() * cloneItems.length), 1)
      shuffledItems.push(randomItem[0])
    }
    setItems(shuffledItems)
  }

  // Sort names in A-Z order
  const handleSortItems = () => {
    const cloneItems = items.slice(0)
    let swapped = false
    for (let i = 0; i < cloneItems.length; i++) {
      for (let j = 0; j < cloneItems.length - i - 1; j++) {
        if (cloneItems[j].toLowerCase() > cloneItems[j + 1].toLowerCase()) {
          let temp = cloneItems[j]
          cloneItems[j] = cloneItems[j + 1]
          cloneItems[j + 1] = temp
          swapped = true
        }
      }

      if (swapped === false) break
    }

    setItems(cloneItems)
  }

  return (
    <motion.div
      exit={{ x: '-100%' }}
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      transition={{ stiffness: 100, duration: 0.25 }}
      className='absolute left-0 top-0 h-3/4 w-full p-4'
    >
      <div className='flex items-center gap-2'>
        <button
          onClick={handleShuffleItems}
          className='rounded-md border border-blue-500 px-2 py-1 text-xs font-semibold hover:bg-blue-300'
        >
          Shuffle
        </button>
        <button
          onClick={handleSortItems}
          className='rounded-md border border-blue-500 px-2 py-1 text-xs font-semibold hover:bg-blue-300'
        >
          Sort
        </button>
      </div>
      <div className='mt-4 flex size-full flex-col overflow-y-scroll rounded-md border border-blue-500 p-2'>
        {items.map((item, index) => {
          return (
            <InputItem
              key={nanoid()}
              item={item}
              index={index}
              onSetCurrentItemChangeIndex={setCurrentInputItemChange}
              currentItemChangeIndex={currentInputItemChange}
            />
          )
        })}
      </div>
      <button
        className='mt-2 rounded-md bg-blue-500 p-2 text-sm text-white hover:opacity-80'
        onClick={handleAddItem}
      >
        + Add item
      </button>
    </motion.div>
  )
}

const ResultsPanel = () => {
  const { results, setResults } = useContext(GameDataContext)

  const handleClearList = () => {
    setResults([])
  }

  return (
    <motion.div
      exit={{ x: '100%' }}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      transition={{ stiffness: 100, duration: 0.25 }}
      className='absolute left-0 top-0 h-auto w-full p-4'
    >
      <button
        onClick={handleClearList}
        className='rounded-md border border-blue-500 px-2 py-1 text-xs font-semibold hover:bg-blue-300'
      >
        Clear list
      </button>
      <div className='mt-4 flex size-full max-h-[250px] min-h-[250px] flex-col overflow-y-scroll rounded-md rounded-sm border border-blue-500 p-2'>
        {results.map((result, index) => (
          <div key={index} className='flex items-center gap-2'>
            <span className='flex size-4 items-center justify-center bg-blue-500 text-xs text-white'>
              {index + 1}
            </span>
            <span className='left-0 top-0 h-full w-auto text-sm'>{result}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

const GamePanel = () => {
  const tabs: Record<string, { title: string; panel: ReactNode }> = {
    Entries: { title: 'Entries', panel: <EntriesPanel /> },
    Results: { title: 'Results', panel: <ResultsPanel /> }
  }
  const [currentTab, setCurrentTab] = useState<keyof typeof tabs | string>('Entries')

  return (
    <div className='flex size-full flex-col overflow-hidden rounded-md border border-black'>
      {/* Tabs */}
      <div className='flex w-full border-b-2'>
        {Array.from(Object.keys(tabs)).map((tab, index) => (
          <Tab
            title={tab}
            key={index}
            onSetCurrentTab={setCurrentTab}
            className={tab === currentTab ? 'text-blue-500' : ''}
          />
        ))}
      </div>
      {/* Panel */}
      <div className='relative flex w-[100%] flex-1 items-center'>
        <AnimatePresence mode='popLayout' initial={false}>
          {Object.entries(tabs).map(
            ([key, tab]) => key === currentTab && <div key={key}>{tab.panel}</div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default GamePanel
