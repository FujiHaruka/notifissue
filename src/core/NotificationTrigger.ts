import { NotificationMeta } from '../types/Core'

class NotificationTrigger {
  private timer = -1
  private minInterval = 30 * 1000

  private task: () => any
  private taskWaiting = false

  constructor(task: () => any) {
    this.task = task
  }

  setNextTime(meta?: NotificationMeta) {
    this.stopTimer()
    this.taskWaiting = true

    const time = meta
      ? Math.max(
          meta.lastFetched.getTime() +
            meta.pollInterval * 1000 -
            new Date().getTime(),
          this.minInterval,
        )
      : this.minInterval
    this.timer = window.setTimeout(() => {
      if (!this.taskWaiting) return
      this.taskWaiting = false
      console.log('[NotificationTrigger] task triggered')
      this.task()
    }, time)
    console.log(`[NotificationTrigger] set next time after ${time} ms`)
  }

  startTimer() {
    void this.task()
    this.setNextTime()
  }

  stopTimer() {
    clearInterval(this.timer)
    this.taskWaiting = false
  }
}

export default NotificationTrigger
