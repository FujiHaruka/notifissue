import { GitHubResponse } from '../types/GitHubResponse'
import BNotification from '../util/BNotification'
import { sleep } from '../util/Func'
import DB from '../util/DB'

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

/**
 * 新しい GitHub notification が来たらブラウザの通知を表示するためのクラス
 */
export default class NotificationNotifier {
  private db = new DB()
  /** Notification reasons for filter notifications */
  reasons: GitHubResponse.NotificationReason[]
  /** Browser notification */
  bNotification = new BNotification()

  private constructor(options: {
    reasons?: GitHubResponse.NotificationReason[]
  }) {
    this.reasons = options.reasons || DEFAULT_REASONS
  }

  // --- main methods

  async onNotifications(coming: GitHubResponse.Notification[]) {
    const valid = await this.validate()
    if (!valid) return

    const notifications = await this.filterNewNotifications(coming)
    if (notifications.length > 0) {
      console.log(
        `[NotificationNotifier] ${notifications.length} new notifications`,
      )
    }
    for (const notification of notifications) {
      await this.spawnBrowserNotification(notification)
      await sleep(3000)
    }
  }

  private async validate() {
    if (!isBrowserNotificationSupported()) return false

    await this.bNotification.requestPermissionIfNeeded()
    if (!this.bNotification.isGranted) return false
    return true
  }

  private async filterNewNotifications(
    notifications: GitHubResponse.Notification[],
  ) {
    const notifiedMap = await this.db.getBNotified()
    const newNotifications = notifications
      .filter(({ unread }) => unread)
      .filter(({ reason }) => this.reasons.includes(reason))
      .filter(
        ({ id, updated_at }) =>
          !notifiedMap[id] ||
          notifiedMap[id].getTime() < new Date(updated_at).getTime(),
      )
    return newNotifications
  }

  private async spawnBrowserNotification({
    id,
    subject,
    updated_at,
  }: GitHubResponse.Notification) {
    await this.db.saveBNotified({ [id]: new Date(updated_at) })
    this.bNotification.spawnNotification({
      title: subject.type,
      body: subject.title,
    })
  }

  // --- singleton

  private static instance: NotificationNotifier | null = null
  static getInstance = () => {
    if (!NotificationNotifier.instance) {
      NotificationNotifier.instance = new NotificationNotifier({})
    }
    return NotificationNotifier.instance
  }
}
