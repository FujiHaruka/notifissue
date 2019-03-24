import React, { useContext, useCallback, useEffect } from 'react'
import { ModalContext } from '../../contexts/ModalContext'
import { Modal, Dimmer, Loader, Message, Button, Icon } from 'semantic-ui-react'
import { UseAsync } from '../../hooks/common/useAsync'
import { GitHubResponse } from '../../types/GitHubResponse'
import marked from 'marked'
import styles from './CommentModal.module.css'
import { findHtmlUrl, subjectNumber } from '../../util/Func'

const RepositoryLink = ({
  notification,
}: {
  notification: GitHubResponse.Notification
}) => (
  <a
    className={styles.reposLink}
    href={findHtmlUrl(notification)}
    target='_blank'>
    {notification.repository.full_name}#{subjectNumber(notification.subject)}
  </a>
)

const CommentModal = ({
  commenting,
  markAsRead,
}: {
  commenting: UseAsync.State<GitHubResponse.Comment | null>
  markAsRead: UseAsync.State<boolean>
}) => {
  const { commentModal: open, commentModalParams, setModalState } = useContext(
    ModalContext,
  )

  const shouldOpen = open && commentModalParams.notification

  useEffect(() => {
    if (shouldOpen) {
      void commenting.doAsync(commentModalParams.notification, { force: true })
    }
  }, [shouldOpen])

  const onClose = useCallback(() => {
    setModalState({ commentModal: false, commentModalParams: {} })
    commenting.reset()
  }, [])
  const { error, ready } = commenting
  const body = commenting.result && commenting.result.body

  if (!shouldOpen) return null

  const notification = commentModalParams.notification!

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header className={styles.header}>
        <RepositoryLink notification={notification} />
        Latest comment by{' '}
        <span className={styles.user}>
          @{commenting.result && commenting.result.user.login}
        </span>
      </Modal.Header>
      <Modal.Content>
        <Dimmer active={commenting.busy} inverted>
          <Loader inverted />
        </Dimmer>
        {ready && body && (
          <div dangerouslySetInnerHTML={{ __html: marked(body) }} />
        )}
        {ready && !body && <div className={styles.alt}>No comment body</div>}
        {error && <Message negative header={'Error'} content={error.message} />}
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          icon='checkmark'
          labelPosition='right'
          content='Mark as read'
          loading={markAsRead.busy}
          onClick={() => {
            void markAsRead.doAsync(notification).then(() => onClose())
          }}
        />
      </Modal.Actions>
    </Modal>
  )
}

export default CommentModal
