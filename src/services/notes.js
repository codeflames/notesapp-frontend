import axios from 'axios'

const baseUrl = '/api/notes'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}


const getAll = async () => {

  const request = axios.get(baseUrl)
  const response = await request
  return response.data
}

// const getOne = (id) => {
//   return axios.get(`${baseUrl}/${id}`)
// }

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}


const update = async (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const noteService = {
  getAll: getAll,
  create: create,
  update: update,
  setToken: setToken
}

export default noteService