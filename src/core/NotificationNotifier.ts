import { NotificationListener } from '../types/Core'
import { GitHubResponse } from '../types/GitHubResponse'
import BNotification from '../util/BNotification'
import { sleep } from '../util/Func'

const DEFAULT_REASONS: GitHubResponse.NotificationReason[] = [
  'assign',
  'author',
  'comment',
  'invitation',
  'manual',
  'mention',
  'state_change',
  'subscribed',
  'team_mention',
]

const isBrowserNotificationSupported = () => 'Notification' in window

export default class NotificationNotifier implements NotificationListener {
  /** Notification reasons for filter notifications */
  reasons: GitHubResponse.NotificationReason[]
  /** Browser notification */
  bNotification = new BNotification()

  constructor(options: { reasons?: GitHubResponse.NotificationReason[] }) {
    this.reasons = options.reasons || DEFAULT_REASONS
  }

  async onNewNotifications(coming: GitHubResponse.Notification[]) {
    if (!isBrowserNotificationSupported()) return

    await this.bNotification.requestPermissionIfNeeded()
    if (!this.bNotification.isGranted) return

    const notifications = coming.filter((notification) =>
      this.reasons.includes(notification.reason),
    )
    if (notifications.length > 0) {
      console.log(
        `[NotificationNotifier] ${notifications.length} new notifications`,
      )
    }
    for (const notification of notifications) {
      this.bNotification.spawnNotification({
        title: notification.subject.type,
        body: notification.subject.title,
      })
      await sleep(3000)
    }
  }
}
