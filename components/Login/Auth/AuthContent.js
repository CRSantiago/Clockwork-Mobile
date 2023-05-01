import { useState } from 'react'
import { Alert, StyleSheet, View, Image, Text } from 'react-native'
import { navigator, useNavigation } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import FlatButton from '../ui/FlatButton'
import AuthForm from './AuthForm'
import { Colors } from '../../../constants/styles'

function AuthContent({ isLogin, onAuthenticate, signUpSuccessMessage }) {
  const navigation = useNavigation()

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmEmail: false,
    confirmPassword: false,
  })

  function switchAuthModeHandler() {
    if (isLogin) {
      //.replace is an option. It disallows going backward in the UI.
      navigation.navigate('Signup')
    } else {
      navigation.navigate('Login')
    }
  }

  const passwordRegex =
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/

  function validatePassword(passwordTest) {
    if (!passwordRegex.test(passwordTest)) {
      const feedback = []
      if (!/(?=.*[a-z])/.test(passwordTest)) {
        feedback.push('at least one lowercase letter')
      }
      if (!/(?=.*[A-Z])/.test(passwordTest)) {
        feedback.push('at least one uppercase letter')
      }
      if (!/(?=.*\d)/.test(passwordTest)) {
        feedback.push('at least one number')
      }
      if (!/(?=.*[!@#$%^&*])/.test(passwordTest)) {
        feedback.push('at least 1 special character')
      }
      if (passwordTest.length < 8) {
        feedback.push('at least 8 characters')
      }
      Alert.alert('Invalid Password', feedback.join('\n'))
      return false
    }
    return true
  }

  function submitHandler(credentials) {
    let { isLogin, username, email, confirmEmail, password, confirmPassword } =
      credentials

    // uses isLogin is passed from loginscreen component. This condition allows use to use login function in utils/auth.js
    if (isLogin) {
      onAuthenticate({ username, password })
    } else {
      email = email.trim()
      password = password.trim()

      const emailIsValid = email.includes('@')
      const passwordIsValid = validatePassword(password)
      const emailsAreEqual = email === confirmEmail
      const passwordsAreEqual = password === confirmPassword

      if (
        !emailIsValid ||
        !passwordIsValid ||
        (!isLogin && (!emailsAreEqual || !passwordsAreEqual))
      ) {
        let returnError = ''
        if (!emailIsValid) {
          returnError +=
            'You entered an invalid email. Please try again.' + '\n'
        } else if (!emailsAreEqual) {
          returnError +=
            'The emails you entered do not match. Please try again.' + '\n'
        } else if (!passwordsAreEqual) {
          returnError +=
            'The passwords you entered do not match. Please try again.' + '\n'
        }
        if (returnError.length > 0) {
          Alert.alert('Invalid input', returnError)
        }
        setCredentialsInvalid({
          email: !emailIsValid,
          confirmEmail: !emailIsValid || !emailsAreEqual,
          password: !passwordIsValid,
          confirmPassword: !passwordIsValid || !passwordsAreEqual,
        })
        return
      }
      onAuthenticate({ username, email, password })
    }
  }

  return (
    <View style={styles.authContent}>
      <KeyboardAwareScrollView>
        <Text style={styles.heading}>Welcome to Clockwork</Text>
        <Image
          style={styles.image}
          source={require('../../../assets/home-image.png')}
        />
        <AuthForm
          isLogin={isLogin}
          onSubmit={submitHandler}
          credentialsInvalid={credentialsInvalid}
          signUpSuccessMessage={signUpSuccessMessage}
        />
        <View style={styles.buttons}>
          <FlatButton onPress={switchAuthModeHandler}>
            {isLogin ? 'Create a new user' : 'Log in instead'}
          </FlatButton>
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}

export default AuthContent

const styles = StyleSheet.create({
  authContent: {
    marginTop: 64,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary800,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  buttons: {
    marginTop: 8,
  },
  image: {
    height: 300,
    width: '100%',
  },
  heading: {
    color: 'white',
    paddingBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
})
