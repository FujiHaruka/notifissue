import qs from 'qs'
import { snake } from 'case'
import { pipe } from 'ramda'
import { mapObjKey } from './Func'
import { PlainObject } from '../types/General'
import { GitHubResponse } from '../types/GitHubResponse'
import { NotificationMeta } from '../types/Core'

// --- Constants

const GITHUB_BASE_URL = 'https://api.github.com'
const ApiUrls = {
  NOTIFICATION_URL: GITHUB_BASE_URL + '/notifications',
  AUTHENTICATED_USER: GITHUB_BASE_URL + '/user',
}

// --- Helpers

const stringifyQuery = (obj: PlainObject): string =>
  qs.stringify(obj, { format: 'RFC1738' })
const keysAsSnake = mapObjKey(snake)
const convertQueryValue = mapObjKey((value: any) => {
  if (value instanceof Date) {
    return value.toISOString()
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }
  return value
})

const asQuery = pipe(
  keysAsSnake,
  convertQueryValue,
  stringifyQuery,
)

// --- Module

export default class GitHubApi {
  accessToken: string

  constructor(options: { accessToken: string }) {
    this.accessToken = options.accessToken
  }

  async fetchNotifications(options: {
    all?: boolean
    since?: Date
    before?: Date
  }) {
    const url =
      ApiUrls.NOTIFICATION_URL +
      '?' +
      asQuery({
        accessToken: this.accessToken,
        ...options,
      })
    const resp = await fetch(url)
    const json = await resp.json()

    const headersObj: any = {}
    for await (const [key, value] of resp.headers.entries()) {
      headersObj[key.toLowerCase()] = value
    }
    const headers = headersObj as GitHubResponse.NotificationHeader

    const meta: NotificationMeta = {
      lastModified: new Date(headers['last-modified']),
      lastFetched: new Date(),
      pollInterval: Number(headers['x-poll-interval']),
    }

    if (!resp.ok) {
      if (resp.status === 304) {
        // 304 Not Modified
        return {
          meta,
          notifications: [] as GitHubResponse.Notification[],
        }
      }
      throw new Error(json.message)
    }

    return {
      meta,
      notifications: json as GitHubResponse.Notification[],
    }
  }

  async fetchAuthenticatedUser() {
    const url =
      ApiUrls.AUTHENTICATED_USER +
      '?' +
      asQuery({
        accessToken: this.accessToken,
      })
    const resp = await fetch(url)
    if (!resp.ok) {
      console.error(`Failed to fetch user: ${resp.status} ${resp.statusText}`)
      return null
    }
    const user = await resp.json()
    return user
  }

  /**
   * PullRequest や Issue のコメントを取得
   */
  async fetchComment(commentUrl: string) {
    const url =
      commentUrl +
      '?' +
      asQuery({
        accessToken: this.accessToken,
      })
    const resp = await fetch(url)
    if (!resp.ok) {
      console.error(`Failed to fetch comment ${resp.status} ${resp.statusText}`)
      return null
    }
    const comment = await resp.json()
    return comment as GitHubResponse.Comment
  }
}
