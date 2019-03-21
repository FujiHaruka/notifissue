import React, { useState, useCallback } from 'react'
import { Modal, Button } from 'semantic-ui-react'

const UnregisterModal = (props: {
  trigger: (props: { onOpen: any }) => any
  onUnregister: () => void
}) => {
  const Trigger = props.trigger
  const [open, toggleOpen] = useState(false)
  const onOpen = useCallback(() => toggleOpen(true), [])
  const onClose = useCallback(() => toggleOpen(false), [])
  const onOk = useCallback(() => {
    props.onUnregister()
    onClose()
  }, [])
  return (
    <Modal
      trigger={<Trigger onOpen={onOpen} />}
      size='mini'
      open={open}
      onClose={onClose}>
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
