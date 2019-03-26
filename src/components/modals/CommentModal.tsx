import React, { useCallback, useEffect } from 'react'
import { Modal, Dimmer, Loader, Message, Button, Icon } from 'semantic-ui-react'
import { UseAsync } from '../../hooks/common/useAsync'
import { GitHubResponse } from '../../types/GitHubResponse'
import marked from 'marked'
import styles from './CommentModal.module.css'
import { findHtmlUrl, subjectNumber } from '../../util/Func'
import { useModalContext } from '../../hooks/useModalContext'
import { useComment } from '../../hooks/useComment'

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

const CommentModal = () => {
  const {
    commentModal: open,
    commentModalParams,
    setModalState,
  } = useModalContext()
  const { fetchLatestComment, markAsRead } = useComment()

  const shouldOpen = open && commentModalParams.notification

  useEffect(() => {
    if (shouldOpen) {
      void fetchLatestComment.doAsync(commentModalParams.notification, {
        force: true,
      })
    }
  }, [shouldOpen])

  const onClose = useCallback(() => {
    setModalState({ commentModal: false, commentModalParams: {} })
    fetchLatestComment.reset()
    markAsRead.reset()
  }, [])

  const body = fetchLatestComment.result && fetchLatestComment.result.body

  if (!shouldOpen) return null

  const notification = commentModalParams.notification!

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header className={styles.header}>
        <RepositoryLink notification={notification} />
        Latest comment by{' '}
        <span className={styles.user}>
          @{fetchLatestComment.result && fetchLatestComment.result.user.login}
        </span>
      </Modal.Header>
      <Modal.Content>
        <Dimmer active={fetchLatestComment.busy} inverted>
          <Loader inverted />
        </Dimmer>
        {fetchLatestComment.ready && body && (
          <div dangerouslySetInnerHTML={{ __html: marked(body) }} />
        )}
        {fetchLatestComment.ready && !body && (
          <div className={styles.alt}>No comment body</div>
        )}
        {fetchLatestComment.error && (
          <Message
            negative
            header={'Error'}
            content={fetchLatestComment.error.message}
          />
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          icon='checkmark'
          labelPosition='right'
          content='Mark as read'
          loading={markAsRead.busy}
          onClick={() => {
            console.log('onclick', notification)
            void markAsRead.doAsync(notification).then(() => onClose())
          }}
        />
      </Modal.Actions>
    </Modal>
  )
}

export default CommentModal
