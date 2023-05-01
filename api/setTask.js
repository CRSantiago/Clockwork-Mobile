import axios from 'axios'
import { buildPath } from '../util/buildPath'

export const setTasks = async (userid, token, currMonth) => {
  try {
    const response = axios.get(
      buildPath(
        'api/v1/clockwork/getCalendar/' + userid + '/' + currMonth.toString()
      ),
      {
        headers: {
          token: token,
        },
      }
    )
    return response
  } catch (e) {
    console.log(e)
  }
}
