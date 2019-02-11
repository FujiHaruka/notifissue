import { GitHubResponse } from '../types/GitHubResponse'

const timeAfterSeconds = (seconds: number) =>
  new Date(new Date().getTime() + seconds * 1000)

class NotificationTrigger {
  private timer = -1
  private interval = 1000
  private nextDate: Date | null = null

  private task: () => any
  private taskDone = true

  constructor(options: { task: () => any }) {
    this.task = options.task
  }

  start() {
    this.startSyncTimer()
  }

  stop() {
    this.stopSyncTimer()
  }

  /**
   * 現在時刻を基準にmetaのpollInterval秒後に設定
   */
  setNextTimeByMeta(meta: GitHubResponse.NotificationMeta) {
    this.setNextTime(timeAfterSeconds(meta.pollInterval))
  }

  setNextTime(date: Date) {
    this.taskDone = false
    this.nextDate = date
  }

  private startSyncTimer() {
    this.stopSyncTimer()
    this.timer = window.setInterval(() => {
      if (this.taskDone || !this.nextDate) return
      const shouldDoTask = this.nextDate.getTime() < new Date().getTime()
      if (shouldDoTask) {
        this.taskDone = true
        this.task()
      }
    }, this.interval)
  }

  private stopSyncTimer() {
    clearInterval(this.timer)
  }
}

export default NotificationTrigger
