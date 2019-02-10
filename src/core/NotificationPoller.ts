import GitHubApi from '../util/Api'
import DB from '../util/DB'
import { NotificationListener } from '../types/Core'

class NotificationPoller {
  private api: GitHubApi
  private db: DB

  private syncTimer = -1
  private syncInterval = 10000
  private syncNextDate: Date | null = null
  private isSyncing: boolean = false

  private listener?: NotificationListener

  constructor(options: {
    accessToken: string
    listener: NotificationListener
  }) {
    const { accessToken, listener } = options
    this.api = new GitHubApi({ accessToken })
    this.db = new DB()
    this.listener = listener
  }

  start(options: { fetchOnStart: boolean }) {
    const { fetchOnStart = true } = options
    if (fetchOnStart) {
      void this.sync({ all: true })
    }
    this.startSyncTimer()
  }

  stop() {
    this.stopSyncTimer()
  }

  async sync(options: { all: boolean }) {
    this.isSyncing = true

    try {
      const { meta, notifications } = await this.api.fetchNotifications(options)
      if (!options.all && notifications.length > 0 && this.listener) {
        this.listener.onNewNotifications(notifications)
      }
      if (notifications.length > 0) {
        await this.db.saveNotifications(notifications)
      }
      await this.db.saveNotificationMeta(meta)

      this.syncNextDate = new Date(
        // 現在時刻から pollInterval 秒後
        new Date().getTime() + meta.pollInterval * 1000,
      )
    } catch (err) {
      console.error(`Failed to sync`, err)
    } finally {
      this.isSyncing = false
    }
  }

  async syncIfNeeded() {
    if (!this.syncNextDate || this.isSyncing) return
    const shouldDoSync = this.syncNextDate.getTime() < new Date().getTime()
    if (shouldDoSync) {
      void this.sync({ all: false })
    }
  }

  private startSyncTimer() {
    this.stopSyncTimer()
    this.syncTimer = window.setInterval(
      () => this.syncIfNeeded(),
      this.syncInterval,
    )
  }

  private stopSyncTimer() {
    clearInterval(this.syncTimer)
  }
}

export default NotificationPoller
