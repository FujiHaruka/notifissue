import React from 'react'
import { List } from 'semantic-ui-react'
import { GitHubResponse } from '../types/GitHubResponse'

const NotificationList = (props: {
  notifications: GitHubResponse.Notification[]
}) => (
  <List celled>
    {props.notifications.map((notification) => (
      <List.Item>
        <List.Content>
          <List.Header>{notification.subject.title}</List.Header>
          {notification.subject.url}
        </List.Content>
      </List.Item>
    ))}
  </List>
)

export default NotificationList
