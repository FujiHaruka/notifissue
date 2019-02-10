import { GitHubResponse } from './GitHubResponse'

export interface NotificationListener {
  onNewNotifications: (notifications: GitHubResponse.Notification[]) => any
}
