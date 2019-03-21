import { GitHubResponse } from './GitHubResponse'

/** Meta data from response header */
export interface NotificationMeta {
  lastModified: Date
  pollInterval: number
  lastFetched: Date
}

export type GitHubObserved = {
  notifications: GitHubResponse.Notification[]
  meta: NotificationMeta
  user: GitHubResponse.User
}

export type GitHubObservedNullable = {
  notifications: GitHubResponse.Notification[]
  meta: NotificationMeta | null
  user: GitHubResponse.User | null
}

export type Filter = 'all' | 'unread'

/**
 * Browser notificaation の送信記録。どの notification がいつ更新のぶんを notify したかわかる
 */
export type BNotifiedMap = { [notificationId: string]: Date }
