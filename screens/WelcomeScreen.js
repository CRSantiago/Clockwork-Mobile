import { StyleSheet, Text, View } from 'react-native'
import { Colors } from '../constants/styles.js'

import CalendarContent from '../components/Dashboard/CalendarContent.js'

function WelcomeScreen() {
  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Welcome!</Text>
      <CalendarContent />
    </View>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: Colors.primary100,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
})
