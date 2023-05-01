import { buildPath } from '../util/buildPath'
import axios from 'axios'

export const updateTask = async (taskObj, token) => {
  console.log(taskObj)
  try {
    const response = await axios.patch(
      buildPath(
        'api/v1/clockwork/updateTask/' + taskObj.user + '/' + taskObj.task_id
      ),
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
