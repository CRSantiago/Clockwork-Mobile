import axios from 'axios'
import { buildPath } from '../util/buildPath'

export const getTask = async (id, token) => {
  try {
    const response = await axios.get(
      buildPath('api/v1/clockwork/getTask/' + id),
      { headers: { token: token } }
    )
    return response
  } catch (error) {
    console.log(error)
  }
}
