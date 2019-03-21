export type PlainObject = { [key: string]: any }

export type Observe<T> = (data: T, ...rest: any[]) => void

export interface Subscription<T> {
  id: string
  observe: Observe<T>
}

export interface Observable<T> {
  subscribe: (observr: Observe<T>, ...rest: any[]) => Subscription<T>
  unsubscribe: () => void
}

export interface Runnable {
  startRunning: () => void
  stopRunning: () => void
}
