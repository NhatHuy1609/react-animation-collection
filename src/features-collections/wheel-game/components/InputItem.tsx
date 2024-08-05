import React, { useState, useRef, useEffect, useLayoutEffect, useContext } from 'react'
import { GameDataContext } from '..'
import useOnClickOutside from '../hooks/useOnClickOutside'

interface IInputItemProps {
  item: string
  index: number
  currentItemChangeIndex: number
  onSetCurrentItemChangeIndex: React.Dispatch<React.SetStateAction<number>>
}

const InputItem = ({
  item,
  index,
  currentItemChangeIndex,
  onSetCurrentItemChangeIndex
}: IInputItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { setItems } = useContext(GameDataContext)
  const [value, _] = useState(item)
  const [inputVisibility, setInputVisibility] = useState(false)

  const handleClickOutside = () => {
    setInputVisibility(false)
    // Deleting item when focusing on item which doesn't have value
    if (!value.trim()) {
      setItems((prev) => {
        const newList = [...prev]
        newList.splice(index, 1)
        return newList
      })
    }
  }

  // Attach event for clicking outside of item
  useOnClickOutside(itemRef, handleClickOutside)

  // Focus on the item which is being changed
  useLayoutEffect(() => {
    if (currentItemChangeIndex >= 0 && currentItemChangeIndex === index) {
      setInputVisibility(true)
    }
  }, [currentItemChangeIndex])

  // Auto focus on the input
  useEffect(() => {
    if (inputRef && inputVisibility) {
      inputRef.current?.focus()
    }
  }, [inputVisibility])

  // Attach event for item
  useEffect(() => {
    const handleClick = () => {
      setInputVisibility(true)
      onSetCurrentItemChangeIndex(index)
    }

    const item = itemRef.current
    item?.addEventListener('click', handleClick)

    return () => {
      item?.removeEventListener('click', handleClick)
    }
  }, [itemRef])

  const handleChangeItemsList = (e: React.FormEvent<HTMLInputElement>, index: number) => {
    setItems((prev) => {
      const newList = prev.slice(0)
      newList.splice(index, 1, e.currentTarget.value)
      return newList
    })
  }

  const handleDeleteItem = () => {
    setItems((prev) => {
      const newList = [...prev]
      newList.splice(index, 1)
      return newList
    })
  }

  const handleKeyupInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleClickOutside()
    }
  }

  return (
    <div className='group relative flex h-fit min-h-[20px] w-full items-center hover:bg-slate-100'>
      <div className='size-full' ref={itemRef}>
        <span className='left-0 top-0 h-full w-auto text-sm'>{value}</span>
        {inputVisibility && (
          <input
            ref={inputRef}
            value={value}
            onInput={(e) => handleChangeItemsList(e, index)}
            onKeyUp={(e) => handleKeyupInput(e)}
            className={`absolute left-0 top-0 z-10 size-full px-1 text-sm text-blue-500`}
          />
        )}
      </div>
      <span
        onClick={handleDeleteItem}
        className='z-[100] flex hidden h-[1.6em] cursor-pointer items-center rounded-sm bg-red-500 px-1 text-xs text-white hover:opacity-90 group-hover:block'
      >
        Delete
      </span>
    </div>
  )
}

export default InputItem
