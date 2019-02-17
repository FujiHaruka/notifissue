import GitHubApi from '../util/Api'
import DB from '../util/DB'
import { HubUI } from '../types/Core'

/**
 * Data hub to connect Request, DB, UI
 */
export default class Hub {
  private api: GitHubApi
  private db: DB
  private ui: HubUI

  readyToken = false

  constructor(ui: HubUI) {
    this.api = new GitHubApi({ accessToken: '' })
    this.db = new DB()
    this.ui = ui
    // For debug
    Object.assign(window, {
      app: {
        db: this.db,
        api: this.api,
      },
    })
  }

  async registerAccessToken(token: string) {
    await this.db.saveAccessToken(token)
    this.api.accessToken = token
  }

  async syncFromAPI(options?: { all: boolean }) {
    // unread 更新のために all true にする...？
    const { all = true } = options || {}
    let { meta, notifications } = await this.api.fetchNotifications({ all })
    if (!all && notifications.length > 0) {
      // TODO: update が無視される
      const existings = await this.db.getNotifications()
      const existingIds: Set<string> = existings
        .map((n) => n.id)
        .reduce((set, id) => set.add(id), new Set())
      const newNotifications = notifications.filter(
        (n) => !existingIds.has(n.id),
      )
      this.ui.onNewNotifications(newNotifications)
    }
    if (notifications.length > 0) {
      await this.db.saveNotifications(notifications)
    }
    await this.db.saveNotificationMeta(meta)

    // DB から取得し直す
    notifications = await this.db.getNotifications()
    this.ui.onData({
      notifications,
      meta,
    })
  }

  async restoreFromDB() {
    const accessToken = await this.db.getAccessToken()
    if (!accessToken) return
    this.api.accessToken = accessToken
    this.readyToken = true
    const notifications = await this.db.getNotifications()
    const meta = await this.db.getNotificationMeta()
    this.ui.onData({
      notifications,
      meta,
    })
  }
}
