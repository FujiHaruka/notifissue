import React, { Component } from 'react'
import './App.css'
import { Container, Header } from 'semantic-ui-react'
import LayoutHeader from './components/LayoutHeader'
import NotificationPoller from './core/NotificationPoller'
import NotificationNotifier from './core/NotificationNotifier'
import { GitHubResponse } from './types/GitHubResponse'
import DB from './util/DB'

interface State {
  notifications: GitHubResponse.Notification[]
  meta: GitHubResponse.NotificationMeta | null
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

  poller?: NotificationPoller

  state = {
    notifications: [],
    meta: null,
  }

  onData(data: {
    notifications: GitHubResponse.Notification[]
    meta: GitHubResponse.NotificationMeta | null
  }) {
    this.setState(data)
  }

  async componentDidMount() {
    // FIXME: DB を複数箇所で初期化している
    const db = new DB()
    const accessToken =
      (await db.getAccessToken()) || process.env.ACCESS_TOKEN || ''
    this.poller = new NotificationPoller({
      accessToken,
      listener: new NotificationNotifier({}),
      onData: this.onData.bind(this),
    })
    this.poller.start({})
  }

  componentWillUnmount() {
    this.poller && this.poller.stop()
  }
}

export default App
