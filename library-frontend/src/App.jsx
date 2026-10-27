import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import { useApolloClient } from '@apollo/client/react'
import Recommendations from './components/Recommendations'
import Notify from './components/Notify'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const client = useApolloClient()
  const [errorMessage, setErrorMessage] = useState(null)

  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('recommend')}>recommend</button>}
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token ? (
          <button onClick={onLogout}>logout</button>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      <Notify errorMessage={errorMessage} />
      <Authors show={page === 'authors'} token={token} />
      <Books show={page === 'books'} />
      {token && <Recommendations show={page === 'recommend'} />}
      {token && <NewBook show={page === 'add'} />}
      <LoginForm show={page === 'login'} setToken={setToken} setPage={setPage} setError={notify} />
    </div>
  )
}

export default App
