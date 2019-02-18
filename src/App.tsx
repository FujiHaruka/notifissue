import React, { Component } from 'react'
import './App.css'
import { Container, Header } from 'semantic-ui-react'
import LayoutHeader from './components/LayoutHeader'
import NotificationTrigger from './core/NotificationTrigger'
import NotificationNotifier from './core/NotificationNotifier'
import Hub from './core/Hub'
import { GitHubResponse } from './types/GitHubResponse'
import NotificationList from './components/NotificationList'
import { NotificationMeta } from './types/Core'
import Welcome from './components/Welcome'

interface State {
  notifications: GitHubResponse.Notification[]
  meta?: NotificationMeta | null
  ready: boolean
  readyToken: boolean
}

class App extends Component<{}, State> {
  render() {
    const { notifications, ready, readyToken } = this.state
    return (
      <div className='App'>
        <LayoutHeader />

        <Container text style={{ paddingTop: '6em' }}>
          {ready && readyToken && (
            <NotificationList notifications={notifications} />
          )}
          {ready && <Welcome onRegister={this.onRegister} />}
        </Container>
      </div>
    )
  }

  trigger!: NotificationTrigger
  hub!: Hub
  notifier!: NotificationNotifier

  state: State = {
    notifications: [],
    meta: null,
    ready: false,
    readyToken: false,
  }

  // --- Lifecycles

  async componentDidMount() {
    this.notifier = new NotificationNotifier({})
    this.hub = new Hub({
      onData: (data: {
        notifications: GitHubResponse.Notification[]
        meta: NotificationMeta | null
      }) => this.setState(data),
      onNewNotifications: async (coming: GitHubResponse.Notification[]) => {
        await this.notifier.onNewNotifications(coming)
      },
    })
    this.trigger = new NotificationTrigger(async () => {
      try {
        await this.hub.syncFromAPI()
      } catch (e) {
        console.error(e)
      }
      this.trigger.setNextTime(this.state.meta!)
    })

    await this.hub.restoreFromDB()
    // TODO: register token from UI
    // await this.hub.registerAccessToken()

    if (this.hub.readyToken) {
      void this.startPolling()
    }
    this.setState({ ready: true })
  }

  componentWillUnmount() {
    this.stopPolling()
  }

  // --- Polling

  async startPolling() {
    if (!this.state.meta) {
      // metaが更新される
      await this.hub.syncFromAPI({ all: true })
    }
    this.trigger.setNextTime(this.state.meta!)
  }

  stopPolling() {
    this.trigger.stopTimer()
  }

  // --- Callbacks

  onRegister = async (token: string) => {
    await this.hub.registerAccessToken(token)
    this.setState({ readyToken: true })
  }
}

export default App
