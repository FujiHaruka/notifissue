import React, { useState, useCallback } from 'react'
import {
  Header,
  Image,
  Segment,
  Input,
  Button,
  Message,
} from 'semantic-ui-react'
import { GitHubResponse } from '../types/GitHubResponse'

const Welcome = (props: {
  onRegister: (token: string) => Promise<GitHubResponse.User | null>
}) => {
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [inputError, setInputError] = useState(false)
  const onRegister = useCallback(async (token: string) => {
    setInputError(false)
    const userOrNull = await props.onRegister(token)
    if (!userOrNull) {
      setInputError(true)
    }
  }, [])
  return (
    <>
      <Header as='h1' icon textAlign='center'>
        <Image size='massive' src='logo.png' />
        <Header.Content>Notifissue</Header.Content>
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
        {inputError && (
          <span className='Welcome-input-error'>Invalid access token.</span>
        )}
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
          error={inputError}
        />
      </Segment>
    </>
  )
}

export default Welcome
