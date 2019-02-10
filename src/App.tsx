import React, { Component } from 'react'
import './App.css'
import { Container, Header } from 'semantic-ui-react'
import LayoutHeader from './components/LayoutHeader'
import NotificationPoller from './core/NotificationPoller'
import NotificationNotifier from './core/NotificationNotifier'
import { GitHubResponse } from './types/GitHubResponse'

interface State {
  notifications: GitHubResponse.Notification[]
}

class App extends Component<{}, State> {
  render() {
    return (
      <div className='App'>
        <LayoutHeader />

        <Container text style={{ marginTop: '6em' }}>
          <Header as='h1'>Semantic UI React Fixed Template</Header>
        </Container>
      </div>
    )
  }

  poller = new NotificationPoller({
    accessToken: process.env.ACCESS_TOKEN || '',
    listener: new NotificationNotifier({}),
  })

  state = {
    notifications: [],
  }

  componentDidMount() {
    this.poller.start({})
  }

  componentWillUnmount() {
    this.poller.stop()
  }
}

export default App
