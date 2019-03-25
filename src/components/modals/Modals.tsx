import React from 'react'
import UnregisterModal from './UnregisterModal'
import CommentModal from './CommentModal'
import { UseAsync } from '../../hooks/common/useAsync'
import { GitHubResponse } from '../../types/GitHubResponse'

const Modals = ({ onUnregister }: { onUnregister: () => void }) => {
  return (
    <>
      <UnregisterModal onUnregister={onUnregister} />
      <CommentModal />
    </>
  )
}

export default Modals
