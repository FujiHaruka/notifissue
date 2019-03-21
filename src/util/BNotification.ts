const isBrowserNotificationSupported = () => 'Notification' in window

/**
 * Browser Notication
 */
export default class BNotification {
  isGranted = false
  private lifetime = 10000

  spawnNotification(options: { title: string; body: string }) {
    if (!this.isGranted) {
      console.warn(`Cannot spawn notification for not granted`)
      return
    }
    const { title, body } = options
    const notification = new Notification(title, {
      body,
      icon: './logo.png',
    })
    setTimeout(notification.close.bind(notification), this.lifetime)
  }

  async requestPermissionIfNeeded() {
    if (!isBrowserNotificationSupported()) return
    if (Notification.permission === 'granted') {
      this.isGranted = true
      return
    }
    return new Promise((resolve) => {
      void Notification.requestPermission(
        (permittion: NotificationPermission) => {
          this.isGranted = permittion === 'granted'
          resolve()
        },
      )
    })
  }
}
