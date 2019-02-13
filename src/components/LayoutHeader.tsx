import React from 'react'
import { Container, Image, Menu } from 'semantic-ui-react'

const LayoutHeader = () => (
  <Menu fixed='top' inverted>
    <Container>
      <Menu.Item header>
        <Image size='mini' src='/logo.png' style={{ marginRight: '1.5em' }} />
        Notissue: GitHub notification timeline
      </Menu.Item>
      {/* <Menu.Item as='a'>Home</Menu.Item>

      <Dropdown item simple text='Dropdown'>
        <Dropdown.Menu>
          <Dropdown.Item>List Item</Dropdown.Item>
          <Dropdown.Item>List Item</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Header>Header Item</Dropdown.Header>
          <Dropdown.Item>
            <i className='dropdown icon' />
            <span className='text'>Submenu</span>
            <Dropdown.Menu>
              <Dropdown.Item>List Item</Dropdown.Item>
              <Dropdown.Item>List Item</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Item>
          <Dropdown.Item>List Item</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown> */}
    </Container>
  </Menu>
)

export default LayoutHeader
