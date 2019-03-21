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

export type GitHubObserved = {
  notifications: GitHubResponse.Notification[]
  meta: NotificationMeta
  user: GitHubResponse.User
}

export type Filter = 'all' | 'unread'
