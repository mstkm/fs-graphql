import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries'
import { addBookToCache } from '../utils/apolloCache'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [createBook] = useMutation(ADD_BOOK, {
    // refetchQueries: [{ query: ALL_BOOKS, variables: { author: '', genre: '' } }, { query: ALL_AUTHORS }],
    update: (cache, response) => {
      const addedBook = response.data?.addBook
      addBookToCache(cache, addedBook)
    }
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    await createBook({ variables: { title, author, published: Number(published), genres }})

    // setTitle('')
    // setPublished('')
    // setAuthor('')
    // setGenres([])
    // setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <h2>add books</h2>
      <form onSubmit={submit}>
        <div>
          <label htmlFor='title'>title</label>
          <input
            id='title'
            name='title'
            type='text'
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <label htmlFor='author'>author</label>
          <input
            id='author'
            name='author'
            type='text'
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <label htmlFor='published'>published</label>
          <input
            id='published'
            name='published'
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <label htmlFor='genre'>genre</label>
          <input
            id='genre'
            name='genre'
            type='text'
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
