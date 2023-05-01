import axios from 'axios'
import { buildPath } from '../util/buildPath'

export const createTask = async (taskObj, token) => {
  console.log('create task called!')
  try {
    const response = await axios.post(
      buildPath('api/v1/clockwork/createTask'),
      taskObj,
      { headers: { token: token } }
    )
    return response
  } catch (e) {
    console.log(e)
  }
}
