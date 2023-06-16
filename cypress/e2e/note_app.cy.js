describe('Note app', function() {

  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Yereka Ueh-Kabari',
      username: 'Codeflames',
      password: 'sekret'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  describe('wrong credentials', function() {
    it('login fails with wrong password', function() {
      cy.contains('Log in').click()
      cy.get('#username').type('Codeflames')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error').should('contain', 'Wrong credentials')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('html').should('not.contain', 'Yereka Ueh-Kabari logged-in')
    })
  })


  it('front page can be opened', function() {
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2023')
  })

  it('if login form can be opened', function() {
    cy.login({ username: 'Codeflames', password: 'sekret' })

    cy.contains('logout')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'Codeflames', password: 'sekret' })
      cy.createNote({
        content: 'a note created by cypress',
        important: true
      })
    })

    describe('and a note exists', function () {
      it('new note can be created', function() {
        cy.contains('a note created by cypress')
      })

      it('note can be made not important', function() {
        cy.contains('a note created by cypress').parent().find('button').as('theButton')
        cy.get('@theButton').click()
        cy.get('@theButton').should('contain', 'make not important')
      })
    })

    describe('and several notes exist', function () {
      beforeEach(function () {
        cy.createNote({ content: 'first note', important: false })
        cy.createNote({ content: 'second note', important: false })
        cy.createNote({ content: 'third note', important: false })
      })

      it('one of those can be made important', function () {
        cy.contains('second note')
          .parent().find('button')
          .click()
        cy.contains('second note').parent().find('button').should('contain', 'make not important')
        // cy.contains('second note')
        //   .contains('make not important')
      })
      // it('one of those can be made important', function () {
      //   cy.contains('second note').parent().find('button').as('theButton')
      //   cy.get('@theButton').click()
      //   cy.get('@theButton').should('contain', 'make not important')
      // })
      it('one of those can be made important', function () {
        cy.contains('second note').parent().find('button').click()
        cy.contains('second note').parent().find('button')
          .should('contain', 'make not important')
      })
    })


  })
})
