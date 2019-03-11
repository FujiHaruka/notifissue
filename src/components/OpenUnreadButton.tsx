import React, { useState } from 'react'
import { GitHubResponse } from '../types/GitHubResponse'
import { findHtmlUrl, sleep } from '../util/Func'
import { Button } from 'semantic-ui-react'

const OPENING_INTERVAL = 2000

const compareUpdateAt = (
  a: GitHubResponse.Notification,
  b: GitHubResponse.Notification,
) => new Date(a.updated_at).getTime() - new Date(a.updated_at).getTime()

const OpenUnreadButton = (props: {
  notifications: GitHubResponse.Notification[]
}) => {
  const unread = props.notifications
    .filter((notification) => notification.unread)
    .sort(compareUpdateAt)
  const [busy, setBusy] = useState(false)
  const onClick = async () => {
    setBusy(true)
    for (const notification of unread) {
      const htmlUrl = findHtmlUrl(notification)
      // await sleep(OPENING_INTERVAL)
      // TODO: ポップアップがブロックされる
      window.open(htmlUrl)
    }
    setBusy(false)
  }
  return (
    <Button
      basic
      color='black'
      loading={busy}
      disabled={busy}
      onClick={onClick}
      content='OPEN ALL UNREAD'
    />
  )
}

export default OpenUnreadButton
