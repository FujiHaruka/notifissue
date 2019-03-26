import GitHubServer from '../core/GitHubServer'
import useAsync from './common/useAsync'
import { GitHubResponse } from '../types/GitHubResponse'
import { useObserverContext } from './useObserverContext'

export const useComment = () => {
  const server = GitHubServer.getInstance()
  const { notifications, setObserved } = useObserverContext()

  const fetchLatestComment = useAsync(
    (notification: GitHubResponse.Notification) =>
      server.fetchLatestComment(notification),
    null,
  )
  const markAsRead = useAsync(
    async (commenting: GitHubResponse.Notification) => {
      const ok = await server.markAsRead(commenting)
      // これはAPIを経由しないでデータを更新するので悪い実装
      if (!ok) return false
      const index = notifications.findIndex(({ id }) => commenting.id === id)
      if (index < 0) return false
      const nextNotifications = [...notifications]
      nextNotifications[index] = {
        ...commenting,
        unread: false,
      }
      setObserved({ notifications: nextNotifications })
      return true
    },
    false,
  )

  return {
    fetchLatestComment,
    markAsRead,
  }
}
