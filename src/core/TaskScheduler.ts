import { Runnable } from '../types/General'

export declare namespace TaskScheduler {
  /** Task は返り値で次に何ms後に実行すればよいかを教える */
  type Task = () => Promise<number>
}

/**
 * 定期的に実行するタスクを登録して、時間が来たらタスクが実行されるようにする
 */
export default class TaskScheduler implements Runnable {
  private task: TaskScheduler.Task
  private timer = -1
  private minTimeout = 30 * 1000
  private running = false

  constructor(task: TaskScheduler.Task) {
    this.task = task
  }

  // --- Runnable

  async startRunning() {
    if (this.running) return
    this.running = true

    const timeout = await this.doTask()
    this.setNextTimeout(timeout)
  }

  async stopRunning() {
    this.running = false
    clearTimeout(this.timer)
  }

  // --- Others

  private async doTask() {
    console.log(`[TaskScheduler] do task`)
    let timeout = this.minTimeout
    try {
      timeout = await this.task()
    } catch (e) {
      console.error(e)
    }
    return timeout
  }

  private setNextTimeout(timeout: number) {
    clearTimeout(this.timer)
    this.timer = window.setTimeout(async () => {
      if (!this.running) return
      const timeout = await this.doTask()
      this.setNextTimeout(timeout)
    }, timeout)
    console.log(`[TaskScheduler] set next time after ${timeout} ms`)
  }
}
