import React from 'react'
import { List, Label } from 'semantic-ui-react'
import { GitHubResponse } from '../types/GitHubResponse'
import { formatDate, findHtmlUrl } from '../util/Func'
import './NotificationList.css'
import { Filter } from '../types/Core'

const ListItemDesc = (props: { children: any }) => (
  <span className='NotificationListItem-desc-item'>{props.children}</span>
)

const ListItem = (props: { notification: GitHubResponse.Notification }) => {
  const { notification } = props
  const { subject, updated_at, unread, repository, reason } = notification
  const { title, type } = subject
  const htmlUrl = findHtmlUrl(notification)
  return (
    <List.Item
      className='NotificationListItem'
      as='a'
      target='_blank'
      href={htmlUrl}>
      <List.Content floated='right'>
        <Label tag>
          {type}
          <Label.Detail>{reason}</Label.Detail>
        </Label>
      </List.Content>
      <List.Icon
        name={unread ? 'circle outline' : 'check circle outline'}
        verticalAlign='top'
      />
      <List.Content>
        <List.Header>{title}</List.Header>
        <List.Description className='NotificationListItem-desc'>
          <ListItemDesc>{repository.full_name}</ListItemDesc>
          <ListItemDesc>At {formatDate(updated_at)}</ListItemDesc>
        </List.Description>
      </List.Content>
    </List.Item>
  )
}

const NotificationList = (props: {
  notifications: GitHubResponse.Notification[]
  filter: Filter
}) => {
  let { notifications, filter } = props
  if (filter === 'unread') {
    notifications = notifications.filter((notification) => notification.unread)
  }
  return (
    <List
      divided
      verticalAlign='middle'
      relaxed='very'
      selection
      className='NotificationList'>
      {notifications.map((notification) => (
        <ListItem key={notification.id} notification={notification} />
      ))}
    </List>
  )
}

export default NotificationList
