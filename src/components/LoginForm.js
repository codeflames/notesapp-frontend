import PropTypes from 'prop-types'

const LoginForm = ({ username, password, handleLogin, setPassword, setUsername }) => {

  LoginForm.propTypes = {
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    handleLogin: PropTypes.func.isRequired,
    setPassword: PropTypes.func.isRequired,
    setUsername: PropTypes.func.isRequired
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input id='username' type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          password
          <input id='password' type="password" value={password}  onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button id='login-button' type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm