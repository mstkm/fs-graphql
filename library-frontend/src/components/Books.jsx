import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'
import { useState } from 'react'

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState('')
  const result = useQuery(ALL_BOOKS, {
    variables: { author: '', genre: selectedGenre }
  })
  const books = result.data?.allBooks || []
  const genres = [...new Set(books.flatMap((book) => book.genres))]


  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>
      <p>in genre <b>{selectedGenre ?? 'all genres'}</b></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map((g) => (
        <button key={g} onClick={() => setSelectedGenre(g)}>{g}</button>
      ))}
      <button onClick={() => setSelectedGenre(null)}>all genres</button>
    </div>
  )
}

export default Books
