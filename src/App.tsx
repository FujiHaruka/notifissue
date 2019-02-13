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

interface State {
  notifications: GitHubResponse.Notification[]
  meta?: NotificationMeta | null
}

class App extends Component<{}, State> {
  render() {
    const { notifications, meta } = this.state
    return (
      <div className='App'>
        <LayoutHeader />

        <Container text style={{ paddingTop: '6em' }}>
          <NotificationList notifications={notifications} />
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
  }

  async componentDidMount() {
    this.notifier = new NotificationNotifier({})
    this.hub = new Hub({
      onData: (data: {
        notifications: GitHubResponse.Notification[]
        meta: NotificationMeta | null
      }) => this.setState(data),
      onNewNotifications: (coming: GitHubResponse.Notification[]) => {
        this.notifier.onNewNotifications(coming)
      },
    })
    this.trigger = new NotificationTrigger(async () => {
      await this.hub.syncFromAPI()
      this.trigger.setNextTime(this.state.meta!)
    })

    await this.hub.restoreFromDB()
    // TODO: register token from UI
    // await this.hub.registerAccessToken()

    this.startPolling()
  }

  componentWillUnmount() {
    this.stopPolling()
  }

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
}

export default App
