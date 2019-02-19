import React, { useState } from 'react'
import {
  Header,
  Image,
  Segment,
  Input,
  Button,
  Message,
} from 'semantic-ui-react'

const Welcome = (props: {
  onRegister: (token: string) => Promise<void>
  errorToken: boolean
}) => {
  const { onRegister, errorToken } = props
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  return (
    <>
      <Header as='h1' icon textAlign='center'>
        <Image size='massive' src='logo.png' />
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
        <Message
          negative
          className='Welcome-input-error'
          size='mini'
          hidden={!errorToken}>
          <Message.Header>Invalid access token.</Message.Header>
        </Message>
        <Input
          action={
            <Button
              primary
              loading={loading}
              onClick={async (e) => {
                if (!token) return
                setLoading(true)
                await onRegister(token)
                setLoading(false)
              }}>
              Save
            </Button>
          }
          placeholder='GitHub Access Token'
          onChange={(e, { value }) => {
            setToken(value)
          }}
        />
      </Segment>
    </>
  )
}

export default Welcome
