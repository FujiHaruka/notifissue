export namespace GitHubResponse {
  export type NotificationReason =
    | 'assign'
    | 'author'
    | 'comment'
    | 'invitation'
    | 'manual'
    | 'mention'
    | 'state_change'
    | 'subscribed'
    | 'team_mention'

  export type NotificationSubjectType =
    | 'Issue'
    | 'PullRequest'
    | 'Commit'
    | string

  export interface NotificationSubject {
    title: string
    url: string
    latest_comment_url: string | null
    type: NotificationSubjectType
  }

  export interface Notification {
    id: string
    unread: boolean
    reason: NotificationReason
    updated_at: string
    last_read_at: string | null
    subject: NotificationSubject
    repository: Repository
    /** Thread url */
    url: string
    subscription_url: string
  }

  export interface Repository {
    id: number
    node_id: string
    name: string
    full_name: string
    private: boolean
    owner: RepositoryOwner
    html_url: string
    description: string
    url: string
  }

  export interface RepositoryOwner {
    id: number
    login: string
    node_id: string
    avatar_url: string
    url: string
    html_url: string
    type: string
  }

  export interface NotificationHeader {
    'cache-control': string
    'content-type': string
    /** for example: "Fri, 08 Feb 2019 14:29:55 GMT" */
    'last-modified': string
    'x-accepted-oauth-scopes': string
    'x-github-media-type': string
    'x-oauth-scopes': string
    /** for example: 60 */
    'x-poll-interval': string
    'x-ratelimit-limit': string
    'x-ratelimit-remainin': string
    'x-ratelimit-reset': string
  }

  export interface User {
    id: number
    login: string
    avatar_url: string
    html_url: string
    name: string
  }
}
