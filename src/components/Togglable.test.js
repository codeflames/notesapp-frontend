import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Togglable from './Togglable'



describe('<Togglable />', () => {
  let container

  beforeEach(() => {
    container = render(
      <Togglable buttonLabel="show...">
        <div className="testDiv" >
          togglable content
        </div>

      </Togglable>
    ).container
    screen.debug(container)
  })

  test('renders its children', async() => {
    await screen.findAllByText('togglable content')
  })

  test('at start the children are not displayed', async() => {
    const div = screen.getByText('togglable content')
    expect(div.parentNode).toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', async() => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const div = screen.getByText('togglable content')
    screen.debug(container)
    expect(div.parentNode).not.toHaveStyle('display: none')
  })

  test('toggled content can be closed', async() => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const closeButton = screen.getByText('cancel')
    await user.click(closeButton)

    const div = screen.getByText('togglable content')
    expect(div.parentNode).toHaveStyle('display: none')
  })

})