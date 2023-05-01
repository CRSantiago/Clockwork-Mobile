import { useContext, useState, useEffect } from 'react'
import { Alert } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'

import LoadingOverLay from '../components/Login/ui/LoadingOverlay'
import { login } from '../util/auth'
import AuthContent from '../components/Login/Auth/AuthContent'
import { AuthContext } from '../store/auth-context'

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [signUpSuccessMessage, setSignUpSuccessMessage] = useState('')

  route = useRoute()
  useEffect(() => {
    if (route.params?.signUpSuccess) {
      setSignUpSuccessMessage('Sign up successful! Please log in.')
    }
  }, [route.params])

  const authCtx = useContext(AuthContext)
  async function loginHandler({ username, password }) {
    setIsAuthenticating(true)
    try {
      const response = await login(username, password)
      //console.log(response.data._id)
      authCtx.authenticate(response.data.token, response.data._id)
      if (response.data.error !== '') {
        Alert.alert(
          'Authentication failed!',
          `Could not log you in. ${response.data.error}`
        )
        setIsAuthenticating(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  if (isAuthenticating) {
    return <LoadingOverLay message="Logging in..." />
  }

  return (
    <AuthContent
      isLogin
      onAuthenticate={loginHandler}
      signUpSuccessMessage={signUpSuccessMessage}
    />
  )
}

export default LoginScreen
