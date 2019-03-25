import React, { useState } from 'react'
import './App.css'
import { Container, Header, Modal } from 'semantic-ui-react'
import LayoutHeader from './components/LayoutHeader'
import NotificationList from './components/NotificationList'
import { NotificationMeta, Filter } from './types/Core'
import Welcome from './components/Welcome'
import NotificationFilter from './components/NotificationFilter'
import OpenUnreadButton from './components/OpenUnreadButton'
import Modals from './components/modals/Modals'
import { useObserverContext } from './hooks/useObserverContext'

const App = () => {
  const {
    ready,
    userRegistered,
    user,
    notifications,
    meta,
    registerUser,
    unregisterUser,
  } = useObserverContext()
  const [filter, setFilter] = useState<Filter>('unread')

  if (!ready) return null

  return (
    <div className='App'>
      <LayoutHeader user={user} />

      <Container text style={{ paddingTop: '5em', marginBottom: '2em' }}>
        {userRegistered && (
          <>
            <NotificationFilter filter={filter} onChange={setFilter} />
            <div className='App-OpenUnreadButton'>
              <OpenUnreadButton notifications={notifications} />
            </div>
            <NotificationList notifications={notifications} filter={filter} />
          </>
        )}
        {!userRegistered && <Welcome onRegister={registerUser} />}
      </Container>

      <Modals onUnregister={unregisterUser} />
    </div>
  )
}

export default App
