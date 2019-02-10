import { GitHubResponse } from '../types/GitHubResponse'
import { uniqBy, sort } from 'ramda'

const uniqById = uniqBy((n: GitHubResponse.Notification) => n.id)
const sortByUpdate = sort(
  (n1: GitHubResponse.Notification, n2: GitHubResponse.Notification) =>
    new Date(n2.updated_at).getTime() - new Date(n1.updated_at).getTime(),
)

class DB {
  storage = window.localStorage

  maxNotifications = 100
  notificationKey = 'notification:items'
  metaKey = 'notification:meta'
  tokenKey = 'github:token'

  // --- Notifications

  async getNotifications(): Promise<GitHubResponse.Notification[]> {
    const value = this.storage.getItem(this.notificationKey)
    if (!value) {
      return []
    }
    return JSON.parse(value) as GitHubResponse.Notification[]
  }

  async saveNotifications(notifications: GitHubResponse.Notification[]) {
    const saved = await this.getNotifications()
    const saving = uniqById([...notifications, ...saved])
    const sorted = sortByUpdate(saving)
    this.storage.setItem(this.notificationKey, JSON.stringify(sorted))
  }

  async cleanUpOldNotifications() {
    const notifications = await this.getNotifications()
    if (notifications.length <= this.maxNotifications) {
      return
    }
    // updated_at 順にソートされている
    const reduced = notifications.slice(0, this.maxNotifications)
    this.storage.setItem(this.notificationKey, JSON.stringify(reduced))
  }

  // --- NotificationMeta

  async getNotificationMeta(): Promise<GitHubResponse.NotificationMeta | null> {
    const value = this.storage.getItem(this.metaKey)
    if (!value) {
      return null
    }
    return JSON.parse(value) as GitHubResponse.NotificationMeta
  }

  async saveNotificationMeta(meta: GitHubResponse.NotificationMeta) {
    this.storage.setItem(this.metaKey, JSON.stringify(meta))
  }

  // --- Access token

  async saveAccessToken(token: string) {
    this.storage.setItem(this.tokenKey, token)
  }

  async getAccessToken() {
    return this.storage.getItem(this.tokenKey)
  }

  async clearAccessToken() {
    this.storage.removeItem(this.tokenKey)
  }
}

export default DB
