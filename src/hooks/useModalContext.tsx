import React, { createContext, ReactChild, useContext } from 'react'
import useValues from './common/useValues'
import { GitHubResponse } from '../types/GitHubResponse'

type CommentModalParams = {
  notification?: GitHubResponse.Notification
}

type ModalState = {
  unregistrationModal: boolean
  commentModal: boolean
  commentModalParams: CommentModalParams
}

const useHook = () => {
  const [values, setModalState] = useValues<ModalState>({
    unregistrationModal: false,
    commentModal: false,
    commentModalParams: {},
  })
  return {
    ...values,
    setModalState,
  }
}

const ModalContext = createContext<ReturnType<typeof useHook>>(null as any)

export const useModalContext = () => useContext(ModalContext)

export const ModalContextProvider = (props: { children: ReactChild }) => {
  const state = useHook()
  return (
    <ModalContext.Provider value={state}>
      {props.children}
    </ModalContext.Provider>
  )
}
