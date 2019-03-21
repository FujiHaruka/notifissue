import { PlainObject } from '../types/General'
import moment from 'moment'
import { GitHubResponse } from '../types/GitHubResponse'
import PathParser from 'path-parser'

export const mapObjKey = (callbackfn: (key: string) => string) => (
  obj: PlainObject,
): PlainObject =>
  Object.entries(obj)
    .map(([key, value]) => [callbackfn(key), value])
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})

export const mapObjValue = (callbackfn: (value: any) => any) => (
  obj: PlainObject,
): PlainObject =>
  Object.entries(obj)
    .map(([key, value]) => [key, callbackfn(value)])
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})

export const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time))

export const formatDate = (date: Date | string) =>
  moment(date).format('YYYY/MM/DD HH:mm')

const DATE = 'Date'
const replacer = function(key: string, value: any): any {
  const rawValue = this[key]
  if (rawValue instanceof Date) {
    return {
      $type: DATE,
      $value: rawValue.getTime(),
    }
  }
  return value
}
const reviver = function(key: string, value: any) {
  if (value && value.$type === DATE) {
    return new Date(value.$value)
  }
  return value
}
export const TypedJSON = {
  stringify: (value: any) => JSON.stringify(value, replacer),
  parse: (text: string) => JSON.parse(text, reviver),
}

export const hasLatestComment = (notification: GitHubResponse.Notification) =>
  Boolean(notification.subject.latest_comment_url)

const origins = {
  api: 'https://api.github.com',
  html: 'https://github.com',
}
const pathParsers = {
  pullRequestApi: new PathParser('/repos/:owner/:repo/pulls/:number'),
  pullRequestHtml: new PathParser('/:owner/:repo/pull/:number'),
  issueApi: new PathParser('/repos/:owner/:repo/issues/:number'),
  issueHtml: new PathParser('/:owner/:repo/issues/:number'),
}
export const findHtmlUrl = (
  notification: GitHubResponse.Notification,
): string => {
  const { type, url } = notification.subject
  const { pathname } = new URL(url)
  const repositoryUrl = notification.repository.html_url // マッチしないとき用の URL
  switch (type) {
    case 'PullRequest': {
      const matched = pathParsers.pullRequestApi.test(pathname)
      if (!matched) {
        console.error(
          `Something wrong on finding HTML URL. Type is "PullRequest", but given URL is ${url}`,
        )
        return repositoryUrl
      }
      return origins.html + pathParsers.pullRequestHtml.build(matched)
    }
    case 'Issue': {
      const matched = pathParsers.issueApi.test(pathname)
      if (!matched) {
        console.error(
          `Something wrong on finding HTML URL. Type is "Issue", but given URL is ${url}`,
        )
        return repositoryUrl
      }
      return origins.html + pathParsers.issueHtml.build(matched)
    }
    default:
      return repositoryUrl
  }
}
