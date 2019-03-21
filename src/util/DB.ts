import { GitHubResponse } from '../types/GitHubResponse'
import { uniqBy, sort } from 'ramda'
import { NotificationMeta, BNotifiedMap } from '../types/Core'
import { TypedJSON } from './Func'

const uniqById = uniqBy((n: GitHubResponse.Notification) => n.id)
const sortByUpdate = sort(
  (n1: GitHubResponse.Notification, n2: GitHubResponse.Notification) =>
    new Date(n2.updated_at).getTime() - new Date(n1.updated_at).getTime(),
)

class DB {
  storage = window.localStorage

  maxNotifications = 500
  notificationKey = 'github:notification:items'
  metaKey = 'github:notification:meta'
  tokenKey = 'github:token'
  userKey = 'github:user'
  bNotifiedKey = 'browser:notified'

  // --- General

  async drop() {
    this.storage.clear()
  }

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

  // --- Browser notification flags

  async getBNotified(): Promise<BNotifiedMap> {
    const value = this.storage.getItem(this.bNotifiedKey)
    if (!value) {
      return {}
    }
    return TypedJSON.parse(value) as BNotifiedMap
  }

  async saveBNotified(bNotified: BNotifiedMap) {
    const saved = await this.getBNotified()
    const merged = {
      ...saved,
      ...bNotified,
    }
    this.storage.setItem(this.bNotifiedKey, TypedJSON.stringify(merged))
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

  // --- User

  async saveUser(user: GitHubResponse.User) {
    this.storage.setItem(this.userKey, TypedJSON.stringify(user))
  }

  async getUser() {
    const value = this.storage.getItem(this.userKey)
    if (!value) {
      return null
    }
    return TypedJSON.parse(value) as GitHubResponse.User
  }

  async clearUser() {
    this.storage.removeItem(this.userKey)
  }
}

export default DB
