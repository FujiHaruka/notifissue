import React, { createContext, ReactChild } from 'react'
import useValues from '../hooks/common/useValues'

const useHook = () => {
  const [values, setModalState] = useValues({
    unregistrationModal: false,
    commentModal: false,
  })
  return {
    ...values,
    setModalState,
  }
}

export const ModalContext = createContext<ReturnType<typeof useHook>>(
  null as any,
)

export const ModalContextProvider = (props: { children: ReactChild }) => {
  const state = useHook()
  return (
    <ModalContext.Provider value={state}>
      {props.children}
    </ModalContext.Provider>
  )
}
