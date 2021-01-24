import * as React from 'react'

/*
 * Based on Dan Abramov's example of useInterval:
 * https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallbackRef = React.useRef(callback)

  React.useEffect(() => {
    savedCallbackRef.current = callback
  })

  React.useEffect(() => {
    function tick() {
      savedCallbackRef.current()
    }

    if (delay !== null) {
      const id = setInterval(() => tick(), delay)

      return () => clearInterval(id)
    }
  }, [delay])
}
