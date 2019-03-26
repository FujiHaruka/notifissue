import { Observable, Runnable, Subscription } from '../types/General'
import { GitHubResponse } from '../types/GitHubResponse'
import uuid from 'uuid'
import DB from '../util/DB'
import GitHubApi from '../util/Api'
import TaskScheduler, { TaskScheduler as Scheduler } from './TaskScheduler'
import { GitHubObserved } from '../types/Core'

type Subscription_<T> = Subscription<T>
type Observable_<T> = Observable<T>

export declare namespace GitHubServer {
  export type Observable = Observable_<GitHubObserved>

  export interface Subscription extends Subscription_<GitHubObserved> {
    options: any
  }

  export type SubscribeOption = {}
}

/**
 * UI が GitHub notifications などを得るためのローカルサーバープロキシ
 * notifications は API から取得され、 DB に保存される
 * UI から取得するのは Observable interface を通じて。
 */
export default class GitHubServer implements GitHubServer.Observable, Runnable {
  private db = new DB()
  private api = new GitHubApi({ accessToken: '' })
  private subscriptions = new Map<string, GitHubServer.Subscription>()
  private user: GitHubResponse.User | null = null
  private scheduler: TaskScheduler
  private running = false
  private ready = false

  // --- Create

  constructor() {
    this.scheduler = new TaskScheduler(this.notificationsSyncTask)
  }

  async prepare() {
    if (this.ready) return
    const accessToken = await this.db.getAccessToken()
    const user = await this.db.getUser()
    if (!accessToken || !user) {
      this.ready = true
      return
    }
    this.api.accessToken = accessToken
    this.user = user
    this.ready = true
  }

  // --- Observable

  subscribe(
    observe: (received: GitHubObserved) => void,
    options: GitHubServer.SubscribeOption,
  ) {
    if (!this.running) {
      throw new Error(`[GitHubServer] Cannot subscribe when not running`)
    }

    const id = uuid()
    const subscription: GitHubServer.Subscription = {
      id,
      observe,
      options,
    }
    this.subscriptions.set(subscription.id, subscription)

    // subscribe開始したらとりあえずデータを流す
    void this.publishTo(subscription)

    return subscription
  }

  unsubscribe() {
    this.subscriptions.clear()
  }

  private async publishTo(subscription: GitHubServer.Subscription) {
    const user = await this.db.getUser()
    const meta = await this.db.getNotificationMeta()
    const notifications = await this.db.getNotifications()
    if (!user || !meta) return
    subscription.observe({
      user,
      meta,
      notifications,
    })
  }

  private async publishToSubscriptions() {
    for (const subscription of Array.from(this.subscriptions.values())) {
      await this.publishTo(subscription)
    }
  }

  // --- Runnable

  startRunning() {
    if (!this.user) {
      throw new Error(`[GitHubServer] Cannot run without user`)
    }
    if (this.running) {
      throw new Error(`[GitHubServer] Already running`)
    }
    console.log(`[GitHubServer] start running`)
    this.running = true
    void this.scheduler.startRunning()
  }

  stopRunning() {
    console.log(`[GitHubServer] stop running`)
    this.running = false
    void this.scheduler.stopRunning()
  }

  canRun(): boolean {
    return Boolean(this.user) && !this.running
  }

  // --- Task

  private notificationsSyncTask: Scheduler.Task = async () => {
    const { meta, notifications } = await this.api.fetchNotifications({
      // unread 更新のために all true にする
      all: true,
    })
    await this.db.saveNotifications(notifications)
    await this.db.saveNotificationMeta(meta)
    const timeout = Math.max(
      meta.lastFetched.getTime() +
        meta.pollInterval * 1000 -
        new Date().getTime(),
      0,
    )
    await this.publishToSubscriptions()
    return timeout
  }

  // --- Token registration

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

  // --- Request

  async fetchLatestComment(notification: GitHubResponse.Notification) {
    const commentUrl = notification.subject.latest_comment_url
    if (!commentUrl) {
      console.error('[GitHubServer] no latest_comment_url in subject')
      return null
    }
    return this.api.fetchComment(commentUrl)
  }

  async markAsRead(notification: GitHubResponse.Notification) {
    return this.api.markThreadAsRead(notification.url)
  }

  // --- Singleton

  private static instance: GitHubServer | undefined = undefined
  static getInstance(): GitHubServer {
    if (!GitHubServer.instance) {
      GitHubServer.instance = new GitHubServer()
    }
    return GitHubServer.instance
  }
}
