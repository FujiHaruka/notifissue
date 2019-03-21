import React, { useContext, useCallback } from 'react'
import { ModalContext } from '../../contexts/ModalContext'
import { Modal } from 'semantic-ui-react'

const CommentModal = () => {
  const { commentModal: open, setModalState } = useContext(ModalContext)
  const onClose = useCallback(() => setModalState({ commentModal: false }), [])
  return (
    <Modal size='mini' open={open} onClose={onClose}>
      <Modal.Header>Comment</Modal.Header>
      <Modal.Content>body</Modal.Content>
      {/* <Modal.Actions>
        <Button negative content='No' onClick={onClose} />
        <Button
          positive
          icon='checkmark'
          labelPosition='right'
          content='Yes'
          onClick={onOk}
        />
      </Modal.Actions> */}
    </Modal>
  )
}

export default CommentModal
