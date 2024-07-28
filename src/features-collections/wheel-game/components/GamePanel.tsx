import React, { ReactNode, SetStateAction, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface ITabProps {
  title: string
  onSetCurrentTab: React.Dispatch<SetStateAction<string>>
}

const Tab = ({ title, onSetCurrentTab }: ITabProps) => {
  const handleActiveTab = () => {
    onSetCurrentTab(title)
  }

  return (
    <div
      onClick={handleActiveTab}
      className='w-1/3 cursor-pointer border-r-2 p-4 text-center hover:bg-slate-100'
    >
      {title}
    </div>
  )
}

const EntriesPanel = () => {
  return (
    <motion.div
      layout
      exit={{ translateX: '-100%' }}
      initial={{ translateX: '-100%' }}
      animate={{ translateX: 0 }}
      transition={{ stiffness: 100, duration: 0.2 }}
      className='h-auto w-1/2 bg-blue-500'
    >
      Entries Panel
    </motion.div>
  )
}

const ResultsPanel = () => {
  return (
    <motion.div
      layout
      exit={{ translateX: '100%' }}
      initial={{ translateX: '100%' }}
      animate={{ translateX: 0 }}
      transition={{ stiffness: 100, duration: 0.2 }}
      className='h-auto w-1/2 bg-red-500'
    >
      Results Panel
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
    <div className='size-full overflow-hidden rounded-md border border-black'>
      {/* Tabs */}
      <div className='flex w-full border-b-2'>
        {Array.from(Object.keys(tabs)).map((tab, index) => (
          <Tab title={tab} key={index} onSetCurrentTab={setCurrentTab} />
        ))}
      </div>
      {/* Panel */}
      <div className='flex w-[200%] items-center'>
        <AnimatePresence mode='popLayout' initial={false}>
          {Object.entries(tabs).map(
            ([key, tab]) =>
              key === currentTab && (
                <div key={key} className='w-full'>
                  {tab.panel}
                </div>
              )
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default GamePanel
