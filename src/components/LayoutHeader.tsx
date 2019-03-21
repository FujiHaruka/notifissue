import React, { useContext } from 'react'
import { Container, Image, Menu, Header, Dropdown } from 'semantic-ui-react'
import { GitHubResponse } from '../types/GitHubResponse'
import { ModalContext } from '../contexts/ModalContext'

const LayoutHeader = ({ user }: { user: GitHubResponse.User | null }) => {
  const { setModalState } = useContext(ModalContext)
  return (
    <Menu fixed='top' inverted>
      <Container>
        <Menu.Item header>
          <Header as='h3' inverted>
            <Image
              size='mini'
              src='logo.png'
              style={{ marginRight: '1.5em' }}
            />
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
                  <Dropdown.Item
                    text='Unregister token'
                    icon='sign out'
                    onClick={() => setModalState({ unregistrationModal: true })}
                  />
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Menu.Item>
        </Menu.Menu>
      </Container>
    </Menu>
  )
}

export default LayoutHeader
