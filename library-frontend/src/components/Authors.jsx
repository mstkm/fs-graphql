import { useQuery, useMutation } from '@apollo/client/react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'
import { useState } from 'react'

const Authors = (props) => {
  const { loading, error, data } = useQuery(ALL_AUTHORS)
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const [born, setBorn] = useState('')

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  const submit = async (event) => {
    event.preventDefault()

    if (!selectedAuthor || born === '') {
      return
    }

    try {
      await editAuthor({
        variables: {
          name: selectedAuthor,
          setBornTo: Number(born),
        },
      })

      setBorn('')
      setSelectedAuthor('')
    } catch (error) {
      console.error('Failed to update author:', error)
    }
  }

  if (!props.show) {
    return null
  }

  if (loading) {
    return <div>Loading authors...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const authors = data?.allAuthors || []

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Set birth year</h2>

      <form onSubmit={submit}>
        <div>
          <label htmlFor="author">Author</label>

          <select
            id="author"
            value={selectedAuthor}
            onChange={({ target }) =>
              setSelectedAuthor(target.value)
            }
          >
            <option value="">Select author</option>

            {authors.map((author) => (
              <option key={author.name} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="born">Born</label>

          <input
            id="born"
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>

        <button type="submit">Update author</button>
      </form>
    </div>
  )
}

export default Authors
