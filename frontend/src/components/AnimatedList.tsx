import { useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'

interface AnimatedListProps {
  children: ReactNode
  className?: string
}

function AnimatedList({ children, className }: AnimatedListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousPositionsRef = useRef<Map<string, DOMRect>>(new Map())

  useLayoutEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    const items = Array.from(
      container.querySelectorAll<HTMLElement>('[data-id]'),
    )
    const nextPositions = new Map<string, DOMRect>()
    const movedItems: HTMLElement[] = []

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

      if (deltaX === 0 && deltaY === 0) {
        continue
      }

      item.style.transition = 'none'
      item.style.transform = `translate(${deltaX}px, ${deltaY}px)`
      movedItems.push(item)
    }

    let frameId = 0
    let cleanupId = 0

    if (movedItems.length > 0) {
      frameId = requestAnimationFrame(() => {
        for (const item of movedItems) {
          item.style.transition = 'transform 300ms ease'
          item.style.transform = 'translate(0, 0)'
        }

        cleanupId = window.setTimeout(() => {
          for (const item of movedItems) {
            item.style.transition = ''
            item.style.transform = ''
          }
        }, 300)
      })
    }

    previousPositionsRef.current = nextPositions

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId)
      }

      if (cleanupId) {
        window.clearTimeout(cleanupId)
      }
    }
  }, [children])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

export default AnimatedList
