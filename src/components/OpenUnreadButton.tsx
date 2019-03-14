import React, { useState } from 'react'
import { GitHubResponse } from '../types/GitHubResponse'
import { findHtmlUrl, sleep } from '../util/Func'
import { Button, Modal } from 'semantic-ui-react'
import styles from './OpenUnreadButton.module.css'

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
      // TODO: タブをフォーカスさせない
      window.open(htmlUrl)
      await sleep(OPENING_INTERVAL)
    }
    setBusy(false)
  }
  return (
    <span className={styles.self}>
      <Button
        basic
        color='black'
        loading={busy}
        disabled={busy}
        onClick={onClick}
        content='OPEN ALL UNREAD'
      />

      <Modal
        trigger={
          <Button circular size='tiny' className={styles.help} icon='help' />
        }>
        <Modal.Header>OPEN ALL UNREAD button</Modal.Header>
        <Modal.Content>
          <p>
            Allow browser pop-up feature to use the "OPEN ALL UNREAD" button.
          </p>
        </Modal.Content>
      </Modal>
    </span>
  )
}

export default OpenUnreadButton
