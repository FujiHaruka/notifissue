import React, {
  useCallback,
  createContext,
  useContext,
  ReactChild,
} from 'react'
import GitHubServer from '../core/GitHubServer'
import useMount from './common/useMount'
import useValues from './common/useValues'
import { GitHubObservedNullable, GitHubObserved } from '../types/Core'
import NotificationNotifier from '../core/NotificationNotifier'

const _useObserver = () => {
  const server = GitHubServer.getInstance()

  const [{ ready, userRegistered }, setServerState] = useValues({
    ready: false,
    userRegistered: false,
  })
  const [{ user, notifications, meta }, setObserved] = useValues<
    GitHubObservedNullable
  >({
    user: null,
    notifications: [],
    meta: null,
  })

  const runServer = useCallback(() => {
    server.startRunning()
    server.subscribe((received: GitHubObserved) => {
      setObserved(received)
      void NotificationNotifier.getInstance().onNotifications(
        received.notifications,
      )
    }, {})
  }, [])
  const stopServer = useCallback(() => {
    server.unsubscribe()
    server.stopRunning()
  }, [])

  // ユーザーを登録と　server running は密結合である
  const registerUser = useCallback(async (token: string) => {
    const userOrNull = await server.register(token)
    setServerState({ userRegistered: Boolean(userOrNull) })
    if (!userOrNull) return null
    runServer()
    return userOrNull
  }, [])
  const unregisterUser = useCallback(async () => {
    stopServer()
    await server.unregister()
    setServerState({ userRegistered: false })
    setObserved({
      user: null,
      notifications: [],
      meta: null,
    })
  }, [])

  useMount({
    onMount: async () => {
      await server.prepare()
      const userRegistered = server.canRun()
      if (userRegistered) {
        runServer()
      }
      setServerState({
        ready: true,
        userRegistered,
      })
    },
    onUnmount: async () => {
      stopServer()
    },
  })

  return {
    ready,
    userRegistered,
    user,
    notifications,
    meta,
    setObserved,
    registerUser,
    unregisterUser,
  }
}

const ObserverContext = createContext<ReturnType<typeof _useObserver>>(
  null as any,
)

export const useObserverContext = () => useContext(ObserverContext)

export const ObserverContextProvider = (props: { children: ReactChild }) => {
  const value = _useObserver()
  return (
    <ObserverContext.Provider value={value}>
      {props.children}
    </ObserverContext.Provider>
  )
}
