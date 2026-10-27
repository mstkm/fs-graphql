const Author = require('./models/author')
const Book = require('./models/book')
const { GraphQLError } = require('graphql')
const User = require('./models/user')
const jwt = require('jsonwebtoken')

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments(),
    authorCount: async () => Author.countDocuments(),
    allBooks: async (root, args) => {
      const filter = {}

      if (args.author) {
        const author = await Author.findOne({ name: args.author })

        if (!author) {
          return []
        }

        filter.author = author._id
      }

      if (args.genre) {
        filter.genres = { $in: args.genre }
      }

      return Book.find(filter)
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }

      let author = await Author.findOne({ name: args.author })

      if (!author) {
        author = new Author({ name: args.author, born: null })
        try {
          await author.save()
        } catch(error) {
          throw new GraphQLError(`Saving author failed: ${args.author}`, {
            extensions: {
              code: 'BAD_REQUEST_INPUT',
              error
            }
          })
        }
      }

      const book = new Book({
        title: args.title,
        published: args.published,
        author: author._id,
        genres: args.genres,
      })

      try {
        await book.save()
      } catch(error) {
        throw new GraphQLError(`Saving book failed: ${args.title}`, {
          extensions: {
            code: 'BAD_REQUEST_INPUT',
            error
          }
        })
      }

      return book
    },

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }

      const author = await Author.findOne({
        name: args.name,
      })

      if (!author) {
        return null
      }

      author.born = args.setBornTo
      return author.save()
    },

    createUser: async (root, args) => {
      const user = new User({ ...args })

      return user.save()
        .catch(error => {
          throw new GraphQLError(`Creating the user failed: ${error.message}`, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          })
        })
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      console.log(args.username, user)
      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return {
        value: jwt.sign(userForToken, process.env.JWT_SECRET)
      }
    },

    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== 'test') {
        throw new GraphQLError('_resetDatabase is only available in test mode')
      }

      await Author.deleteMany({})
      await Book.deleteMany({})
      await User.deleteMany({})

      return true
    }
  },
  Book: {
    author: async (root) => {
      return Author.findById(root.author)
    }
  },
  Author: {
    bookCount: async (root) => {
      return Book.countDocuments({ author: root._id })
    }
  }
}

module.exports = resolvers