import { useState, useMemo, useCallback, Dispatch, SetStateAction } from 'react'
import useValues from './useValues'

export declare namespace UseAsync {
  export type Values<T> = {
    ready: boolean
    busy: boolean
    result: T
    error: Error | null
  }

  export type Actions = {
    reset: () => void
    doAsync: (arg?: any, options?: DoAsyncOptions) => Promise<void>
  }

  export type DoAsyncOptions = {
    force?: boolean
    allowParallel?: boolean
  }

  export type State<T> = Values<T> & Actions
}

const buildDoAsync = <T>(
  fn: (arg?: any) => Promise<T>,
  set: Dispatch<SetStateAction<Partial<UseAsync.Values<T>>>>,
  ready: boolean,
  busy: boolean,
) => async (arg?: any, options?: UseAsync.DoAsyncOptions): Promise<void> => {
  const { force = false, allowParallel = false } = options || {}
  if (ready && !force) return
  if (busy && !allowParallel) return

  set({ busy: true })
  try {
    const result = await fn(arg)
    set({
      result,
      ready: true,
      busy: false,
    })
  } catch (e) {
    console.error(e)
    set({
      error: e,
      busy: false,
    })
  }
}

const useAsync = <T, S>(
  fn: (arg?: any) => Promise<T>,
  emptyResult: S,
): UseAsync.State<T | S> => {
  const [{ ready, busy, result, error }, set] = useValues<
    UseAsync.Values<T | S>
  >({
    ready: false,
    busy: false,
    result: emptyResult,
    error: null,
  })
  const doAsync = useMemo(() => buildDoAsync(fn, set, ready, busy), [
    fn,
    ready,
    busy,
  ])
  const reset = useCallback(
    () =>
      set({
        ready: false,
        busy: false,
        result: emptyResult,
        error: null,
      }),
    [emptyResult],
  )
  return {
    ready,
    busy,
    result,
    error,
    reset,
    doAsync,
  }
}

export default useAsync
