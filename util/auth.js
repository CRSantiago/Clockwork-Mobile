import axios from 'axios'

import { buildPath } from './buildPath'

async function authenticate(mode, username, email, password) {
  const url = buildPath(`api/v1/clockwork/${mode}`)

  let response = ''
  if (mode === 'login') {
    response = await axios.post(url, { username: username, password: password })
  } else {
    response = await axios.post(url, {
      username: username,
      email: email,
      password: password,
    })
  }
  //   if (response !== '') {
  //     console.log(response.data)
  //   }
  return response
}

export function createUser(username, email, password) {
  return authenticate('register', username, email, password) //returns response to component that calls function
}

export function login(username, password) {
  return authenticate('login', username, '', password) //returns response to component that calls function
}
