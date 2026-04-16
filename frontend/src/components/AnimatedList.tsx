import { useEffect, useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'

interface AnimatedListProps {
  children: ReactNode
  className?: string
  onReorderStart?: () => void
  onReorderEnd?: () => void
}

function AnimatedList({
  children,
  className,
  onReorderStart,
  onReorderEnd,
}: AnimatedListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousPositionsRef = useRef<Map<string, DOMRect>>(new Map())
  const previousOrderRef = useRef<string[]>([])
  const frameIdRef = useRef<number | null>(null)
  const cleanupIdRef = useRef<number | null>(null)
  const animationTokenRef = useRef(0)

  useEffect(() => {
    return () => {
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current)
      }

      if (cleanupIdRef.current !== null) {
        window.clearTimeout(cleanupIdRef.current)
      }
    }
  }, [])

  useLayoutEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    const items = Array.from(
      container.querySelectorAll<HTMLElement>('[data-id]'),
    )
    const nextOrder = items
      .map((item) => item.dataset.id)
      .filter((id): id is string => Boolean(id))
    const nextPositions = new Map<string, DOMRect>()
    const movedItems: HTMLElement[] = []
    const orderChanged =
      previousOrderRef.current.length > 0 &&
      (
        previousOrderRef.current.length !== nextOrder.length ||
        previousOrderRef.current.some((id, index) => nextOrder[index] !== id)
      )

    for (const item of items) {
      const id = item.dataset.id

      if (!id) {
        continue
      }

      const nextRect = item.getBoundingClientRect()
      nextPositions.set(id, nextRect)

      const previousRect = previousPositionsRef.current.get(id)

      if (!previousRect) {
        continue
      }

      const deltaX = previousRect.left - nextRect.left
      const deltaY = previousRect.top - nextRect.top

      if (!orderChanged || (deltaX === 0 && deltaY === 0)) {
        continue
      }

      item.style.transition = 'none'
      item.style.transform = `translate(${deltaX}px, ${deltaY}px)`
      movedItems.push(item)
    }

    if (movedItems.length > 0) {
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current)
      }

      if (cleanupIdRef.current !== null) {
        window.clearTimeout(cleanupIdRef.current)
      }

      animationTokenRef.current += 1
      const animationToken = animationTokenRef.current
      onReorderStart?.()

      frameIdRef.current = requestAnimationFrame(() => {
        for (const item of movedItems) {
          item.style.transition = 'transform 300ms ease'
          item.style.transform = 'translate(0, 0)'
        }

        cleanupIdRef.current = window.setTimeout(() => {
          if (animationToken !== animationTokenRef.current) {
            return
          }

          for (const item of movedItems) {
            item.style.transition = ''
            item.style.transform = ''
          }

          onReorderEnd?.()
        }, 300)
      })
    }

    previousPositionsRef.current = nextPositions
    previousOrderRef.current = nextOrder
  }, [children, onReorderEnd, onReorderStart])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

export default AnimatedList
