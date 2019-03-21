import React, { useState } from 'react'
import './App.css'
import { Container, Header, Modal } from 'semantic-ui-react'
import LayoutHeader from './components/LayoutHeader'
import NotificationList from './components/NotificationList'
import { NotificationMeta, Filter } from './types/Core'
import Welcome from './components/Welcome'
import NotificationFilter from './components/NotificationFilter'
import OpenUnreadButton from './components/OpenUnreadButton'
import useGitHubObserver from './hooks/useGitHubObserver'

const App = () => {
  const {
    ready,
    userRegistered,
    user,
    notifications,
    meta,
    registerUser,
    unregisterUser,
  } = useGitHubObserver()
  const [filter, setFilter] = useState<Filter>('unread')

  if (!ready) return null

  return (
    <div className='App'>
      <LayoutHeader user={user} onUnregister={unregisterUser} />

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
    </div>
  )
}

export default App
