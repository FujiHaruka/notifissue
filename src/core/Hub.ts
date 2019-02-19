import GitHubApi from '../util/Api'
import DB from '../util/DB'
import { HubUI } from '../types/Core'
import { GitHubResponse } from '../types/GitHubResponse'

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

  async register(token: string): Promise<boolean> {
    // validate and save user
    this.api.accessToken = token
    const user = await this.api.fetchAuthenticatedUser()
    if (!user) {
      this.api.accessToken = ''
      return false
    }
    await this.db.saveUser(user)
    await this.db.saveAccessToken(token)
    return true
  }

  async unregister() {
    await this.db.drop()
  }

  async syncFromAPI(options?: { all: boolean }) {
    // unread 更新のために all true にする...？
    const { all = true } = options || {}
    const { meta, notifications } = await this.api.fetchNotifications({ all })

    const newNotifications = await this.filterNewNotifications(notifications)
    this.ui.onNewNotifications(newNotifications)
    await this.db.saveNotifications(notifications)
    await this.db.saveNotificationMeta(meta)

    this.ui.onData({
      // DB から取得し直す
      notifications: await this.db.getNotifications(),
      meta,
    })
  }

  async restoreFromDB() {
    const accessToken = await this.db.getAccessToken()
    if (!accessToken) return
    this.readyToken = true
    this.api.accessToken = accessToken
    const notifications = await this.db.getNotifications()
    const meta = await this.db.getNotificationMeta()
    this.ui.onData({
      notifications,
      meta,
    })
  }

  private async filterNewNotifications(
    notifications: GitHubResponse.Notification[],
  ) {
    const existings: {
      [id: string]: GitHubResponse.Notification
    } = (await this.db.getNotifications()).reduce(
      (obj, n) => Object.assign(obj, { [n.id]: n }),
      {},
    )
    const newNotifications = notifications.filter(
      ({ id, updated_at, unread }) => {
        if (!unread) return false // 既読は無視
        const exists = existings[id]
        if (!exists) return true // 新規なので
        if (exists.updated_at !== updated_at) return true // 更新されたので
        return false
      },
    )
    return newNotifications
  }
}
