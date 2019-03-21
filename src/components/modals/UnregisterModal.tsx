import React, { useState, useCallback, useContext } from 'react'
import { Modal, Button } from 'semantic-ui-react'
import { ModalContext } from '../../contexts/ModalContext'

const UnregisterModal = (props: { onUnregister: () => void }) => {
  const { unregistrationModal: open, setModalState } = useContext(ModalContext)
  const onClose = useCallback(
    () => setModalState({ unregistrationModal: false }),
    [],
  )
  const onOk = useCallback(() => {
    props.onUnregister()
    onClose()
  }, [])
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
