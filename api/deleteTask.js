import { buildPath } from '../util/buildPath'
import axios from 'axios'

export const deleteTask = async (taskObj, token) => {
  console.log(taskObj)
  try {
    const response = await axios.post(
      buildPath('api/v1/clockwork/deleteTask/'),
      taskObj,
      {
        headers: { token: token },
      }
    )
    return response
  } catch (e) {
    console.log(e)
  }
}
