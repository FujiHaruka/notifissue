import React from 'react'
import { Container, Image, Menu, Header } from 'semantic-ui-react'

const LayoutHeader = () => (
  <Menu fixed='top' inverted>
    <Container>
      <Menu.Item header>
        <Header as='h3' inverted>
          <Image size='mini' src='/logo.png' style={{ marginRight: '1.5em' }} />
          Notissue
        </Header>
      </Menu.Item>
    </Container>
  </Menu>
)

export default LayoutHeader
