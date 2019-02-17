import { GitHubResponse } from '../types/GitHubResponse'
import { uniqBy, sort } from 'ramda'
import { NotificationMeta } from '../types/Core'
import { TypedJSON } from './Func'

const uniqById = uniqBy((n: GitHubResponse.Notification) => n.id)
const sortByUpdate = sort(
  (n1: GitHubResponse.Notification, n2: GitHubResponse.Notification) =>
    new Date(n2.updated_at).getTime() - new Date(n1.updated_at).getTime(),
)

class DB {
  storage = window.localStorage

  maxNotifications = 500
  notificationKey = 'notification:items'
  metaKey = 'notification:meta'
  tokenKey = 'github:token'

  // --- Notifications

  async getNotifications(): Promise<GitHubResponse.Notification[]> {
    const value = this.storage.getItem(this.notificationKey)
    if (!value) {
      return []
    }
    return TypedJSON.parse(value) as GitHubResponse.Notification[]
  }

  async saveNotifications(notifications: GitHubResponse.Notification[]) {
    const saved = await this.getNotifications()
    const saving = uniqById([...notifications, ...saved])
    const sorted = sortByUpdate(saving)
    this.storage.setItem(this.notificationKey, TypedJSON.stringify(sorted))
  }

  async cleanUpOldNotifications() {
    const notifications = await this.getNotifications()
    if (notifications.length <= this.maxNotifications) {
      return
    }
    // updated_at 順にソートされている
    const reduced = notifications.slice(0, this.maxNotifications)
    this.storage.setItem(this.notificationKey, TypedJSON.stringify(reduced))
  }

  // --- NotificationMeta

  async getNotificationMeta(): Promise<NotificationMeta | null> {
    const value = this.storage.getItem(this.metaKey)
    if (!value) {
      return null
    }
    return TypedJSON.parse(value) as NotificationMeta
  }

  async saveNotificationMeta(meta: NotificationMeta) {
    this.storage.setItem(this.metaKey, TypedJSON.stringify(meta))
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
