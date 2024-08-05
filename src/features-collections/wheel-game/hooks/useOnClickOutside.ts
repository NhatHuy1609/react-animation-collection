import { RefObject, useEffect } from 'react'

type CallbackType = (...args: any[]) => any

const useOnClickOutside = <T extends HTMLElement = HTMLElement>(ref: RefObject<T>, cb: CallbackType) => {
  useEffect(() => {
    const handelClickOutside = (event: Event) => {
      const el = ref.current
      if (!el || el.contains((event.target as Node))) {
        return
      }

      cb()
    }

    document.addEventListener('mousedown', handelClickOutside)
    document.addEventListener('touchstart', handelClickOutside)

    return () => {
      document.removeEventListener('mousedown', handelClickOutside)
      document.removeEventListener('touchstart', handelClickOutside)
    }
  }, [ref, cb])
}

export default useOnClickOutside