import React from 'react'
import { Container, Image, Menu, Header, Dropdown } from 'semantic-ui-react'
import { GitHubResponse } from '../types/GitHubResponse'

const LayoutHeader = (props: { user?: GitHubResponse.User }) => (
  <Menu fixed='top' inverted>
    <Container>
      <Menu.Item header>
        <Header as='h3' inverted>
          <Image size='mini' src='/logo.png' style={{ marginRight: '1.5em' }} />
          Notissue
        </Header>
      </Menu.Item>

      <Menu.Menu position='right'>
        <Menu.Item>
          {props.user && (
            <Dropdown
              trigger={
                <span style={{ color: 'white' }}>
                  <Image avatar src={props.user.avatar_url} />
                  {props.user.login}
                </span>
              }
              options={[
                {
                  key: 'unregister',
                  text: 'Unregister token',
                  icon: 'sign out',
                },
              ]}
            />
          )}
        </Menu.Item>
      </Menu.Menu>
    </Container>
  </Menu>
)

export default LayoutHeader
