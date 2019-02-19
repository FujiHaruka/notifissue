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
  meta: NotificationMeta | null
  user?: GitHubResponse.User
  ready: boolean
  readyToken: boolean
  errorToken: boolean
}

class App extends Component<{}, State> {
  render() {
    const { notifications, ready, readyToken, errorToken, user } = this.state
    return (
      <div className='App'>
        <LayoutHeader user={user} />

        <Container text style={{ paddingTop: '6em' }}>
          {ready && readyToken && (
            <NotificationList notifications={notifications} />
          )}
          {ready && !readyToken && (
            <Welcome onRegister={this.onRegister} errorToken={errorToken} />
          )}
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
    user: undefined,
    ready: false,
    readyToken: false,
    errorToken: false,
  }

  // --- Lifecycles

  async componentDidMount() {
    this.notifier = new NotificationNotifier({})
    this.hub = new Hub({
      onData: (data: {
        notifications: GitHubResponse.Notification[]
        meta: NotificationMeta | null
        user?: GitHubResponse.User
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

    if (this.hub.readyToken) {
      void this.startPolling()
      this.setState({ readyToken: true })
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
    const user = await this.hub.register(token)
    if (user) {
      this.setState({ readyToken: true, errorToken: false, user })
      void this.startPolling()
    } else {
      this.setState({ errorToken: true })
    }
  }
}

export default App
