import React from 'react'
import { Container, Image, Menu, Header, Dropdown } from 'semantic-ui-react'
import { GitHubResponse } from '../types/GitHubResponse'
import UnregisterModal from './UnregisterModal'

const LayoutHeader = ({
  user,
  onUnregister,
}: {
  user: GitHubResponse.User | null
  onUnregister: () => void
}) => (
  <Menu fixed='top' inverted>
    <Container>
      <Menu.Item header>
        <Header as='h3' inverted>
          <Image size='mini' src='logo.png' style={{ marginRight: '1.5em' }} />
          Notifissue
        </Header>
      </Menu.Item>

      <Menu.Menu position='right'>
        <Menu.Item>
          {user && (
            <Dropdown
              trigger={
                <span style={{ color: 'white' }}>
                  <Image avatar src={user.avatar_url} />
                  {user.name}
                </span>
              }>
              <Dropdown.Menu>
                <Dropdown.Header content='Signed in by GitHub' />
                <UnregisterModal
                  trigger={({ onOpen }) => (
                    <Dropdown.Item
                      text='Unregister token'
                      icon='sign out'
                      onClick={onOpen}
                    />
                  )}
                  onUnregister={onUnregister}
                />
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Menu.Item>
      </Menu.Menu>
    </Container>
  </Menu>
)

export default LayoutHeader
