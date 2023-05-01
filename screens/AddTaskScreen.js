import { useContext, useCallback } from 'react'
import {
  LogBox,
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Picker } from '@react-native-picker/picker'
import DatePicker from 'react-native-datepicker'
import { useState } from 'react'

import { AuthContext } from '../store/auth-context'
import { createTask } from '../api/createTask'

function AddTaskScreen() {
  LogBox.ignoreLogs(['Animated: `useNativeDriver`'])
  const authCtx = useContext(AuthContext)
  const [formData, setFormData] = useState({
    title: '',
    user: authCtx.userid,
    datestart: '',
    dateend: '',
    description: '',
    interval: {
      unit: 'none',
      value: 0,
    },
    notes: '',
    notifyintensity: 'none',
  })

  const [selectedInterval, setSelectedInterval] = useState('none')
  const [selectedNotify, setSelectedNotify] = useState('none')
  const [successfulAdd, setSuccessfulAdd] = useState(false)

  const handleChange = useCallback(
    (value, name) => {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }))
      setSuccessfulAdd(false)
    },
    [setFormData]
  )

  const handleNotifyChange = useCallback((value, name) => {
    setSelectedNotify(value)
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
    setSuccessfulAdd(false)
  }, [])

  const handleDateChange = (value, name) => {
    const parsedDate = new Date(Date.parse(value))
    setFormData((prevState) => ({
      ...prevState,
      [name]: parsedDate,
    }))
    setSuccessfulAdd(false)
  }

  const handleIntervalChange = (value, name) => {
    setSelectedInterval(value)
    setFormData((prevState) => ({
      ...prevState,
      interval: {
        ...prevState.interval,
        [name]: value,
      },
    }))
    setSuccessfulAdd(false)
  }

  function handleSubmit() {
    console.log('handle submit')
    console.log(formData)
    createTask(formData, authCtx.token)
      .then((response) => {
        if (response.status === 200) {
          setSuccessfulAdd(true)
          setFormData({
            title: '',
            user: authCtx.userid,
            datestart: '',
            dateend: '',
            description: '',
            interval: {
              unit: 'none',
              value: 0,
            },
            notes: '',
            notifyintensity: 'none',
          })
        }
      })
      .catch((error) => console.error(error))
  }

  function handleCancel() {
    setFormData({
      title: '',
      user: authCtx.userid,
      datestart: '',
      dateend: '',
      description: '',
      interval: {
        unit: 'none',
        value: 0,
      },
      notes: '',
      notifyintensity: 'none',
    })
  }
  //console.log('rendered')

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: '#1b4965' }}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View style={styles.taskDetailContainer}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View>
            <View style={styles.textContainer}>
              <Text style={styles.textTitle}>Title:</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(value) => handleChange(value, 'title')}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.textTitle}>Description:</Text>
              <TextInput
                style={styles.input}
                value={formData.description}
                onChangeText={(value) => handleChange(value, 'description')}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.textTitle}>Date Start:</Text>
              <View>
                <DatePicker
                  style={{
                    width: 200,
                    backgroundColor: 'white',
                  }}
                  date={
                    formData.datestart === ''
                      ? new Date().toISOString()
                      : new Date(formData.datestart).toISOString()
                  }
                  mode="date"
                  placeholder="Select date"
                  format="YYYY-MM-DD"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    datePicker: { backgroundColor: 'black' },
                  }}
                  onDateChange={(date) => handleDateChange(date, 'datestart')}
                />
              </View>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.textTitle}>Date End:</Text>
              <View>
                <DatePicker
                  style={{
                    width: 200,
                    backgroundColor: 'white',
                  }}
                  date={
                    formData.dateend === ''
                      ? new Date().toISOString()
                      : new Date(formData.dateend).toISOString()
                  }
                  mode="date"
                  placeholder="Select date"
                  format="YYYY-MM-DD"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    datePicker: { backgroundColor: 'black' },
                  }}
                  onDateChange={(date) => handleDateChange(date, 'dateend')}
                />
              </View>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.textTitle}>Interval:</Text>
              <Picker
                style={{
                  backgroundColor: '#fff',
                  color: '#000',
                  borderWidth: 1,
                  borderColor: '#ccc',
                  width: '100%',
                }}
                itemStyle={{ height: 30, paddingVertical: 20 }}
                selectedValue={selectedInterval}
                onValueChange={(value) => handleIntervalChange(value, 'unit')}
              >
                <Picker.Item label="none" value="none" />
                <Picker.Item label="Days" value="days" />
                <Picker.Item label="Weeks" value="weeks" />
                <Picker.Item label="Month" value="months" />
              </Picker>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.textTitle}>Interval Value:</Text>
              <TextInput
                style={styles.input}
                value={formData.interval.value.toString()}
                onChangeText={(value) => handleIntervalChange(value, 'value')}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.textTitle}>Notify Intensity:</Text>
              <Picker
                style={{
                  backgroundColor: '#fff',
                  color: '#000',
                  borderWidth: 1,
                  borderColor: '#ccc',
                  width: '100%',
                }}
                itemStyle={{ height: 30, paddingVertical: 20 }}
                selectedValue={selectedNotify}
                onValueChange={(value) =>
                  handleNotifyChange(value, 'notifyintensity')
                }
              >
                <Picker.Item label="none" value="none" />
                <Picker.Item label="Mild" value="mild" />
                <Picker.Item label="Moderate" value="moderate" />
                <Picker.Item label="Urgent" value="urgent" />
              </Picker>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.textTitle}>Notes:</Text>
              <TextInput
                style={styles.input}
                value={formData.notes}
                onChangeText={(value) => handleChange(value, 'notes')}
              />
            </View>
          </View>
          <View>
            <View style={styles.buttonContainer}>
              <Button title="Submit" onPress={handleSubmit} color="yellow" />
              <Button title="Cancel" onPress={handleCancel} color="#E10600" />
            </View>
            {successfulAdd && (
              <Text style={styles.successText}>Task succussfully added</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  taskDetailContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    flex: 1,
    backgroundColor: '#1b4965',
  },
  textContainer: {
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTitle: {
    textAlign: 'center',
    fontSize: 18,
    color: 'white',
    marginBottom: 24,
  },
  textTitle: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    paddingBottom: 5,
  },
  textStyles: {
    textAlign: 'center',
    color: '#6acfe8',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    textAlign: 'center',
    backgroundColor: 'white',
    width: Dimensions.get('window').width * 0.5,
    padding: 5,
  },
  successText: {
    color: 'white',
    fontSize: 16,
  },
})

export default AddTaskScreen
