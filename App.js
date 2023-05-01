import { View, TouchableOpacity } from 'react-native'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { StatusBar } from 'expo-status-bar'
import { useContext } from 'react'
import { Ionicons } from '@expo/vector-icons'

import LoginScreen from './screens/LoginScreen'
import SignupScreen from './screens/SignupScreen'
import WelcomeScreen from './screens/WelcomeScreen'
import AddTaskScreen from './screens/AddTaskScreen'
import { Colors } from './constants/styles'
import AuthContextProvider, { AuthContext } from './store/auth-context'
import IconButton from './components/Login/ui/IconButton'

const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator()

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  )
}

function AuthenticatedStack() {
  const authCtx = useContext(AuthContext)
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
        drawerStyle: { backgroundColor: 'white' }, // custom background color
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={WelcomeScreen}
        options={({ navigation }) => ({
          headerStyle: { backgroundColor: Colors.primary500 },
          headerTintColor: 'white',
          headerLeft: () => (
            <View style={{ marginLeft: 10 }}>
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Ionicons name="menu-outline" size={28} color="white" />
              </TouchableOpacity>
            </View>
          ),
          headerRight: () => (
            <IconButton
              icon="exit"
              size={24}
              color="white"
              onPress={authCtx.logout}
            />
          ),
        })}
      />
      <Drawer.Screen
        name="Add Task"
        component={AddTaskScreen}
        options={({ navigation }) => ({
          headerStyle: { backgroundColor: Colors.primary500 },
          headerTintColor: 'white',
          headerLeft: () => (
            <View style={{ marginLeft: 10 }}>
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Ionicons name="menu-outline" size={28} color="white" />
              </TouchableOpacity>
            </View>
          ),
          headerRight: () => (
            <IconButton
              icon="exit"
              size={24}
              color="white"
              onPress={authCtx.logout}
            />
          ),
        })}
      />
    </Drawer.Navigator>
  )
}

function Navigation() {
  const authCtx = useContext(AuthContext)
  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <Navigation />
      </AuthContextProvider>
    </>
  )
}
