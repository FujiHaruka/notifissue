import React from 'react'
import UnregisterModal from './UnregisterModal'
import CommentModal from './CommentModal'

const Modals = ({ onUnregister }: { onUnregister: () => void }) => {
  return (
    <>
      <UnregisterModal onUnregister={onUnregister} />
      <CommentModal />
    </>
  )
}

export default Modals
