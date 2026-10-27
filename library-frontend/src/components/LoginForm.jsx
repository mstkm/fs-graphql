import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { LOGIN } from '../queries'

const LoginForm = ({ show, setToken, setPage, setError }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
      console.log('Token tersimpan:', token)
      setPage('authors')
    },
    onError: (error) => {
      setError('login failed')
    }
  })

  const onLogin = (e) => {
    e.preventDefault()
    login({ variables: { username, password }})
  }

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>login</h2>
      <form onSubmit={onLogin}>
        <div>
          <label htmlFor='username'>username</label>
          <input 
            name='username'
            id='username'
            type='text'
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor='password'>password</label>
          <input 
            name='password'
            id='password'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm