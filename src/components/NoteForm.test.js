import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NoteForm from './NoteForm'


test('<NoteForm/> updates parent state and calls onSubmit', async() => {
  const createNote = jest.fn()
  render(<NoteForm createNote={createNote} />)
  const user = userEvent.setup()

  const input = screen.getByPlaceholderText('Enter new note here')
  const sendButton = screen.getByText('save')

  await user.type(input, 'testing of forms could be easier')
  await user.click(sendButton)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing of forms could be easier')

})