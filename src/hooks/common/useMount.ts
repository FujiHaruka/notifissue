import { useEffect } from 'react'

const useMount = ({
  onMount,
  onUnmount,
}: {
  onMount: () => any
  onUnmount: () => any
}) => {
  useEffect(() => {
    void onMount()
    return () => {
      onUnmount()
    }
  }, [])
}

export default useMount
