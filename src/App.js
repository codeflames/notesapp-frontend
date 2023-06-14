import { useEffect, useState, useRef } from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import Notification from './components/Notification'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import Footer from './components/Footer'
import NoteForm from './components/NoteForm'




const App = () => {
  const [notes, setNotes] = useState([])
  // const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const noteFormRef = useRef()
  // const [loginVisible, setLoginVisible] = useState(false)

  const notesHook = () => {
    console.log('effect')
    noteService.getAll()
      .then(initialNotes => {
        setNotes(initialNotes.concat(
          { id: 10000, content: 'This note is not saved to server', important: true }
        ))
      })
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password
      })
      console.log('user', user)
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      noteService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      console.log(error)
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }
      , 5000)
    }
  }

  useEffect(notesHook, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  console.log('render', notes.length, 'notes')

  const logout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
  }


  const addNote = (noteObject) => {

    noteService.create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
    noteFormRef.current.toggleVisibility()


  }



  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService.update(id, changedNote).then(
      returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      }
    ).catch(
      (error) => {
        console.log(error)
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      }
    )
  }




  const logoutButton = () => {
    return (
      <button onClick={logout}>logout</button>
    )
  }


  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {!user &&
        <Togglable buttonLabel='Log in'>
          <LoginForm
            username={username}
            password={password}
            setPassword={setPassword}
            setUsername={setUsername}
            handleLogin={handleLogin}
          />
        </Togglable>
      }
      {user && <div>
        <p>{user.name} logged-in  </p>

        <Togglable buttonLabel='new note' ref={noteFormRef}>
          <NoteForm
            createNote={addNote}
          />
        </Togglable>


      </div>}

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>

        {notesToShow.map(note =>
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
        )}

      </ul>

      {user && logoutButton()}

      <Footer />
    </div>
  )
}

export default App



