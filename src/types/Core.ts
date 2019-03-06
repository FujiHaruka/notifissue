import { GitHubResponse } from './GitHubResponse'

/** Meta data from response header */
export interface NotificationMeta {
  lastModified: Date
  pollInterval: number
  lastFetched: Date
}

export interface NotificationListener {
  onNewNotifications: (notifications: GitHubResponse.Notification[]) => any
}

export interface HubUI extends NotificationListener {
  onData: (data: {
    notifications: GitHubResponse.Notification[]
    meta: NotificationMeta | null
    user?: GitHubResponse.User
  }) => void
}

export type Filter = 'all' | 'unread'
