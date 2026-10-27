import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS, ME } from '../queries'

const Recommendations = (props) => {
  const getMe = useQuery(ME)
  const me = getMe.data?.me

  const getBooks = useQuery(ALL_BOOKS, {
    variables: { author: '', genre: me?.favoriteGenre ?? '' },
    skip: !me
  })

  const books = getBooks.data?.allBooks || []

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre{' '}<b>{me?.favoriteGenre}</b></p>
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
    </div>
  )
}

export default Recommendations