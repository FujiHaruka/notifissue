import { useState, Dispatch, SetStateAction, useMemo } from 'react'

export type UseValuesAction<T> = Dispatch<SetStateAction<Partial<T>>>

const valuesSetter = <T>(set: Dispatch<SetStateAction<T>>) => (
  action: SetStateAction<Partial<T>>,
) => {
  if (typeof action === 'function') {
    set((prev) => ({ ...prev, ...action(prev) }))
  } else {
    set((prev) => ({ ...prev, ...action }))
  }
}

export type UseValues = <T>(initialValues: T) => [T, UseValuesAction<T>]
const useValues: UseValues = (initialValues) => {
  const [values, set] = useState(initialValues)
  const setValues = useMemo(() => valuesSetter(set), [set])
  return [values, setValues]
}

export default useValues
