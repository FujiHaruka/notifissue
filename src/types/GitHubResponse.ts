namespace GitHubResponse {
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
}
