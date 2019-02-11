import GitHubApi from '../util/Api'
import DB from '../util/DB'
import { GitHubResponse } from '../types/GitHubResponse'
import { NotificationListener } from '../types/Core'

interface UI extends NotificationListener {
  onData: (data: {
    notifications: GitHubResponse.Notification[]
    meta: GitHubResponse.NotificationMeta | null
  }) => void
}

/**
 * Data hub to connect Request, DB, UI
 */
export default class Hub {
  private api: GitHubApi
  private db: DB
  private ui: UI

  readyToken = false

  constructor(ui: UI) {
    this.api = new GitHubApi({ accessToken: '' })
    this.db = new DB()
    this.ui = ui
  }

  async registerAccessToken(token: string) {
    await this.db.saveAccessToken(token)
    this.api.accessToken = token
  }

  async syncFromAPI(options: { all: boolean }) {
    let { meta, notifications } = await this.api.fetchNotifications(options)
    if (!options.all && notifications.length > 0) {
      this.ui.onNewNotifications(notifications)
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
    if (accessToken) {
      this.api.accessToken = accessToken
      this.readyToken = true
    }
    const notifications = await this.db.getNotifications()
    const meta = await this.db.getNotificationMeta()
    this.ui.onData({
      notifications,
      meta,
    })
  }
}
