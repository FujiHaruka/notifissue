import React from 'react'
import { Modal, Button } from 'semantic-ui-react'

const UnregisterModal = (props: {
  open: boolean
  onClose: () => void
  onOk: () => void
}) => {
  const { open, onClose, onOk } = props
  return (
    <Modal size='mini' open={open} onClose={onClose}>
      <Modal.Header>Delete Your Access Token</Modal.Header>
      <Modal.Content>Are you sure?</Modal.Content>
      <Modal.Actions>
        <Button negative content='No' onClick={onClose} />
        <Button
          positive
          icon='checkmark'
          labelPosition='right'
          content='Yes'
          onClick={onOk}
        />
      </Modal.Actions>
    </Modal>
  )
}

export default UnregisterModal
