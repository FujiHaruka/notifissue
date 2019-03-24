import React from 'react'
import UnregisterModal from './UnregisterModal'
import CommentModal from './CommentModal'
import { UseAsync } from '../../hooks/common/useAsync'
import { GitHubResponse } from '../../types/GitHubResponse'

const Modals = ({
  onUnregister,
  commenting,
  markAsRead,
}: {
  onUnregister: () => void
  commenting: UseAsync.State<GitHubResponse.Comment | null>
  markAsRead: UseAsync.State<boolean>
}) => {
  return (
    <>
      <UnregisterModal onUnregister={onUnregister} />
      <CommentModal commenting={commenting} markAsRead={markAsRead} />
    </>
  )
}

export default Modals
