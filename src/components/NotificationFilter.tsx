import React from 'react'
import { Filter } from '../types/Core'
import { Segment, Tab, Menu, MenuItemProps } from 'semantic-ui-react'

const NotificationFilter = (props: {
  filter: Filter
  onChange: (filter: Filter) => void
}) => {
  const handleItemClick = (e: any, { name }: MenuItemProps) =>
    props.onChange(name as Filter)
  return (
    <Segment basic textAlign='center'>
      <Menu compact color='blue'>
        <Menu.Item
          name='unread'
          active={props.filter === 'unread'}
          onClick={handleItemClick}
          content='UNREAD'
        />
        <Menu.Item
          name='all'
          active={props.filter === 'all'}
          onClick={handleItemClick}
          content='ALL'
        />
      </Menu>
    </Segment>
  )
}

export default NotificationFilter
