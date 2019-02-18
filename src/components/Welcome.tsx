import React from 'react'
import { Header, Image, Segment, Input, Button } from 'semantic-ui-react'

const Welcome = (props: { onRegister: (token: string) => void }) => {
  return (
    <>
      <Header as='h1' icon textAlign='center'>
        <Image size='massive' src='/logo.png' />
        <Header.Content>Notissue</Header.Content>
        <Header.Subheader>
          GitHub notification timeline with web notification
        </Header.Subheader>
      </Header>
      <Segment className='Welcome-segment' basic textAlign='center'>
        Nottisue let you know GitHub notifications by web notification. All you
        need to do is to register your GitHub access token. It will be saved in
        local storage. Then, you get GitHub notifications through your browser.
      </Segment>
      <Segment className='Welcome-segment' basic textAlign='center'>
        <Header as='h3'>Get started</Header>
        <Input
          action={
            <Button primary loading={false}>
              Save
            </Button>
          }
          placeholder='GitHub Access Token'
        />
      </Segment>
    </>
  )
}

export default Welcome
