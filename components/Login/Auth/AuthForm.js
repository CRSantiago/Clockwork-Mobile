import { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'

import Button from '../ui/Button'
import Input from './Input'

function AuthForm({
  isLogin,
  onSubmit,
  credentialsInvalid,
  signUpSuccessMessage,
}) {
  const [userName, setUserName] = useState('')
  const [enteredEmail, setEnteredEmail] = useState('')
  const [enteredConfirmEmail, setEnteredConfirmEmail] = useState('')
  const [enteredPassword, setEnteredPassword] = useState('')
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('')

  const {
    email: emailIsInvalid,
    confirmEmail: emailsDontMatch,
    password: passwordIsInvalid,
    confirmPassword: passwordsDontMatch,
  } = credentialsInvalid

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case 'userName':
        setUserName(enteredValue)
        break
      case 'email':
        setEnteredEmail(enteredValue)
        break
      case 'confirmEmail':
        setEnteredConfirmEmail(enteredValue)
        break
      case 'password':
        setEnteredPassword(enteredValue)
        break
      case 'confirmPassword':
        setEnteredConfirmPassword(enteredValue)
        break
    }
  }

  function submitHandler() {
    // prop from authcontent
    onSubmit({
      isLogin: isLogin,
      username: userName,
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
      confirmPassword: enteredConfirmPassword,
    })
  }

  return (
    <View style={styles.form}>
      {signUpSuccessMessage && (
        <Text style={styles.signUpText}>{signUpSuccessMessage}</Text>
      )}
      <View>
        <Input
          label="Username"
          onUpdateValue={updateInputValueHandler.bind(this, 'userName')}
          value={userName}
        />
        {!isLogin && (
          <Input
            label="Email Address"
            onUpdateValue={updateInputValueHandler.bind(this, 'email')}
            value={enteredEmail}
            keyboardType="email-address"
            isInvalid={emailIsInvalid}
          />
        )}
        {!isLogin && (
          <Input
            label="Confirm Email Address"
            onUpdateValue={updateInputValueHandler.bind(this, 'confirmEmail')}
            value={enteredConfirmEmail}
            keyboardType="email-address"
            isInvalid={emailsDontMatch}
          />
        )}
        <Input
          label="Password"
          onUpdateValue={updateInputValueHandler.bind(this, 'password')}
          secure
          value={enteredPassword}
          isInvalid={passwordIsInvalid}
        />
        {!isLogin && (
          <Input
            label="Confirm Password"
            onUpdateValue={updateInputValueHandler.bind(
              this,
              'confirmPassword'
            )}
            secure
            value={enteredConfirmPassword}
            isInvalid={passwordsDontMatch}
          />
        )}
        <View style={styles.buttons}>
          <Button onPress={submitHandler}>
            {isLogin ? 'Log In' : 'Sign Up'}
          </Button>
        </View>
      </View>
    </View>
  )
}

export default AuthForm

const styles = StyleSheet.create({
  buttons: {
    marginTop: 12,
  },
  signUpText: {
    color: 'white',
    fontWeight: 'bold',
  },
})
