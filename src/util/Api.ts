import qs from 'qs'
import { snake } from 'case'
import { pipe } from 'ramda'
import { mapObjKey } from './Func'

// --- Constants

const GITHUB_BASE_URL = 'https://https://api.github.com'
const ApiUrls = {
  NOTIFICATION_URL: GITHUB_BASE_URL + '/notifications',
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

// --- Modules

export const fetchNotifications = async (options: {
  accessToken: string
  all: boolean
  since: Date
  before: Date
}): Promise<GitHubResponse.Notification[]> => {
  const url = ApiUrls.NOTIFICATION_URL + '?' + asQuery(options)
  const resp = await fetch(url)
  const json = await resp.json()
  if (!resp.ok) {
    throw new Error(json.message)
  }
  return json as GitHubResponse.Notification[]
}
