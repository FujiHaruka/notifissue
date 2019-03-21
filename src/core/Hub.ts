import GitHubApi from '../util/Api'
import DB from '../util/DB'
import { NotificationMeta, HubOnData } from '../types/Core'
import { GitHubResponse } from '../types/GitHubResponse'
import NotificationTrigger from './NotificationTrigger'
import NotificationNotifier from './NotificationNotifier'

/**
 * Data hub to connect Request, DB, UI
 */
export default class Hub {
  private api: GitHubApi
  private db: DB
  private notifier: NotificationNotifier
  trigger: NotificationTrigger
  onData?: HubOnData
  user: GitHubResponse.User | null = null

  constructor() {
    this.api = new GitHubApi({ accessToken: '' })
    this.db = new DB()
    this.notifier = new NotificationNotifier({})
    this.trigger = new NotificationTrigger(async () => {
      let meta
      try {
        meta = await this.syncFromAPI()
      } catch (e) {
        console.error(e)
      }
      this.trigger.setNextTime(meta)
    })
    // For debug
    Object.assign(window, {
      app: {
        db: this.db,
        api: this.api,
      },
    })
  }

  async register(token: string): Promise<GitHubResponse.User | null> {
    // validate and save user
    this.api.accessToken = token
    const user = await this.api.fetchAuthenticatedUser()
    if (!user) {
      this.api.accessToken = ''
      return null
    }
    await this.db.saveUser(user)
    await this.db.saveAccessToken(token)
    this.user = user
    return user
  }

  async unregister() {
    await this.db.drop()
  }

  async syncFromAPI(options?: { all: boolean }) {
    // unread 更新のために all true にする...？
    const { all = true } = options || {}
    const { meta, notifications } = await this.api.fetchNotifications({ all })

    const newNotifications = await this.filterNewNotifications(notifications)
    void this.notifier.onNewNotifications(newNotifications)
    await this.db.saveNotifications(notifications)
    await this.db.saveNotificationMeta(meta)

    if (this.onData) {
      this.onData({
        // DB から取得し直す
        notifications: await this.db.getNotifications(),
        meta,
      })
    }
    return meta
  }

  async restoreFromDB() {
    const accessToken = await this.db.getAccessToken()
    if (!accessToken) return
    this.api.accessToken = accessToken
    const notifications = await this.db.getNotifications()
    const meta = await this.db.getNotificationMeta()
    const user = await this.db.getUser()
    this.user = user

    if (this.onData) {
      this.onData({
        notifications,
        meta,
        user: user || undefined,
      })
    }
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
