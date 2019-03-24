import GitHubServer from '../core/GitHubServer'
import useMount from './common/useMount'
import useValues from './common/useValues'
import { GitHubObservedNullable, GitHubObserved } from '../types/Core'
import { useCallback } from 'react'
import NotificationNotifier from '../core/NotificationNotifier'
import useAsync from './common/useAsync'
import { GitHubResponse } from '../types/GitHubResponse'

const useGitHubObserver = () => {
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

  const commenting = useAsync(
    (notification: GitHubResponse.Notification) =>
      server.fetchLatestComment(notification),
    null,
  )
  const markAsRead = useAsync(
    async (notification: GitHubResponse.Notification) => {
      const ok = await server.markAsRead(notification)
      // これはAPIを経由しないでデータを更新するので悪い実装
      if (!ok) return false
      const index = notifications.findIndex(({ id }) => notification.id === id)
      if (index < 0) return false
      const nextNotifications = [...notifications]
      nextNotifications[index] = {
        ...notification,
        unread: false,
      }
      setObserved({ notifications: nextNotifications })
      return true
    },
    false,
  )

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
    registerUser,
    unregisterUser,
    commenting,
    markAsRead,
  }
}

export default useGitHubObserver
