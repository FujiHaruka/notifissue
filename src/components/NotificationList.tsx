import React from 'react'
import { List, Label } from 'semantic-ui-react'
import { GitHubResponse } from '../types/GitHubResponse'
import qs from 'querystring'
import { formatDate } from '../util/Func'
import './NotificationList.css'

const NotificationListItem = (props: {
  notification: GitHubResponse.Notification
}) => {
  const { subject, updated_at, unread } = props.notification
  const { title, url, type } = subject
  return (
    <List.Item
      className='NotificationListItem'
      as='a'
      target='_blank'
      href={`redirect.html?${qs.stringify({
        url,
      })}`}>
      <List.Content floated='right'>
        <Label tag>{type}</Label>
      </List.Content>
      <List.Icon
        name={unread ? 'circle outline' : 'check circle outline'}
        verticalAlign='top'
      />
      <List.Content>
        <List.Header>{title}</List.Header>
        <List.Description className='NotificationListItem-desc'>
          <span className='NotificationListItem-desc-item'>
            At {formatDate(updated_at)}
          </span>
        </List.Description>
      </List.Content>
    </List.Item>
  )
}

const NotificationList = (props: {
  notifications: GitHubResponse.Notification[]
}) => (
  <List
    divided
    verticalAlign='middle'
    relaxed='very'
    selection
    className='NotificationList'>
    {props.notifications.map((notification) => (
      <NotificationListItem key={notification.id} notification={notification} />
    ))}
  </List>
)

export default NotificationList
