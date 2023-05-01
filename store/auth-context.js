import { createContext, useState } from 'react'

export const AuthContext = createContext({
  userid: '',
  token: '',
  isAuthenticated: false,
  authenticate: (token, userID) => {},
  logout: () => {},
})

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState()
  const [userID, setUserID] = useState()

  function authenticate(token, userID) {
    setAuthToken(token)
    setUserID(userID)
  }

  function logout() {
    setAuthToken(null)
    setUserID(null)
  }

  const value = {
    userid: userID,
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContextProvider
